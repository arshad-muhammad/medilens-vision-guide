
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://ijhbmtnoddweqyvlpdbp.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, userId } = await req.json();
    
    console.log('Starting medicine analysis...');

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey!);

    // Step 1: Analyze image with Gemini 2.0 Flash
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this medicine image and extract the following information in JSON format:
              {
                "medicineName": "exact medicine name",
                "activeIngredient": "main active ingredient",
                "strength": "dosage strength",
                "form": "tablet/capsule/syrup/etc",
                "manufacturer": "company name if visible",
                "color": "medicine color",
                "shape": "shape description",
                "markings": "any text or numbers on the medicine",
                "packaging": "blister pack/bottle/etc",
                "confidence": "confidence level 0-100"
              }
              
              Focus on extracting text from labels, identifying the medicine form, and noting visual characteristics. Be precise and only include information you can clearly see.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        }
      }),
    });

    const geminiData = await geminiResponse.json();
    console.log('Gemini analysis completed');

    let extractedInfo;
    try {
      const geminiText = geminiData.candidates[0].content.parts[0].text;
      // Extract JSON from the response
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      extractedInfo = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      extractedInfo = null;
    }

    if (!extractedInfo || !extractedInfo.medicineName) {
      throw new Error('Could not extract medicine information from image');
    }

    console.log('Extracted info:', extractedInfo);

    // Step 2: Search openFDA API for detailed information
    const searchTerms = [
      extractedInfo.medicineName,
      extractedInfo.activeIngredient,
      `${extractedInfo.medicineName} ${extractedInfo.strength}`.trim()
    ].filter(Boolean);

    let fdaData = null;
    for (const searchTerm of searchTerms) {
      try {
        const fdaResponse = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(searchTerm)}"&limit=1`
        );
        
        if (fdaResponse.ok) {
          const data = await fdaResponse.json();
          if (data.results && data.results.length > 0) {
            fdaData = data.results[0];
            console.log('Found FDA data for:', searchTerm);
            break;
          }
        }
      } catch (error) {
        console.log('FDA search failed for term:', searchTerm);
        continue;
      }
    }

    // If no exact match, try generic name search
    if (!fdaData && extractedInfo.activeIngredient) {
      try {
        const fdaResponse = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(extractedInfo.activeIngredient)}"&limit=1`
        );
        
        if (fdaResponse.ok) {
          const data = await fdaResponse.json();
          if (data.results && data.results.length > 0) {
            fdaData = data.results[0];
            console.log('Found FDA data by generic name');
          }
        }
      } catch (error) {
        console.log('Generic name FDA search failed');
      }
    }

    // Step 3: Generate human-friendly summary with Gemini
    const summaryPrompt = `Based on the following medicine information, create a comprehensive, human-friendly summary in JSON format:

    Extracted from image: ${JSON.stringify(extractedInfo)}
    FDA Data: ${fdaData ? JSON.stringify(fdaData) : 'No FDA data available'}

    Generate this exact JSON structure:
    {
      "name": "Medicine name",
      "brand": "Brand name if available",
      "activeIngredient": "Active ingredient",
      "strength": "Dosage strength",
      "form": "Tablet/Capsule/etc",
      "description": "What this medicine is and what it treats (2-3 sentences)",
      "uses": ["Primary use", "Secondary use"],
      "dosageInstructions": "How to take this medicine",
      "sideEffects": {
        "common": ["side effect 1", "side effect 2"],
        "serious": ["serious side effect 1"],
        "frequencies": {
          "common": 70,
          "uncommon": 20,
          "rare": 10
        }
      },
      "warnings": ["Important warning 1", "Important warning 2"],
      "manufacturer": "Company name",
      "fdaStatus": "Approved/Over-the-counter/etc",
      "alternatives": [
        {
          "name": "Alternative medicine name",
          "activeIngredient": "Active ingredient",
          "reason": "Why it's an alternative"
        }
      ]
    }

    Make the language simple and easy to understand for non-medical people. If FDA data is not available, use general knowledge about the identified medicine.`;

    const summaryResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: summaryPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2000,
        }
      }),
    });

    const summaryData = await summaryResponse.json();
    console.log('Summary generation completed');

    let medicineInfo;
    try {
      const summaryText = summaryData.candidates[0].content.parts[0].text;
      const jsonMatch = summaryText.match(/\{[\s\S]*\}/);
      medicineInfo = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
      console.error('Error parsing summary response:', error);
      // Fallback to basic info
      medicineInfo = {
        name: extractedInfo.medicineName,
        activeIngredient: extractedInfo.activeIngredient,
        description: "Medicine information extracted from image analysis.",
        uses: ["Treatment information not available"],
        sideEffects: { common: [], serious: [], frequencies: { common: 60, uncommon: 30, rare: 10 } },
        warnings: ["Consult healthcare provider before use"],
        alternatives: []
      };
    }

    // Step 4: Save to database
    const searchRecord = {
      user_id: userId,
      query: extractedInfo.medicineName,
      search_type: 'image_upload',
      status: 'completed',
      image_url: imageData,
      results: {
        extracted: extractedInfo,
        fda_data: fdaData,
        summary: medicineInfo
      }
    };

    const { data: searchData, error: searchError } = await supabase
      .from('medicine_searches')
      .insert(searchRecord)
      .select()
      .single();

    if (searchError) {
      console.error('Error saving search:', searchError);
    }

    // Save to search history
    if (searchData) {
      const historyRecord = {
        user_id: userId,
        medicine_search_id: searchData.id,
        medicine_name: medicineInfo.name || extractedInfo.medicineName,
        medicine_type: extractedInfo.form,
        identification_confidence: extractedInfo.confidence
      };

      const { error: historyError } = await supabase
        .from('search_history')
        .insert(historyRecord);

      if (historyError) {
        console.error('Error saving history:', historyError);
      }
    }

    console.log('Analysis complete, returning results');

    return new Response(JSON.stringify({
      success: true,
      data: {
        searchId: searchData?.id,
        extracted: extractedInfo,
        fdaData: fdaData,
        summary: medicineInfo,
        confidence: extractedInfo.confidence || 85
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-medicine function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
