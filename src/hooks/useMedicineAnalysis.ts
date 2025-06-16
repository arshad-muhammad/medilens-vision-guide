
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  searchId?: string;
  extracted: {
    medicineName: string;
    activeIngredient: string;
    strength: string;
    form: string;
    manufacturer?: string;
    color: string;
    shape: string;
    confidence: number;
  };
  fdaData: any;
  summary: {
    name: string;
    brand?: string;
    activeIngredient: string;
    strength?: string;
    form: string;
    description: string;
    uses: string[];
    dosageInstructions?: string;
    sideEffects: {
      common: string[];
      serious: string[];
      frequencies: {
        common: number;
        uncommon: number;
        rare: number;
      };
    };
    warnings: string[];
    manufacturer?: string;
    fdaStatus?: string;
    alternatives: Array<{
      name: string;
      activeIngredient: string;
      reason: string;
    }>;
  };
  confidence: number;
}

export const useMedicineAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMedicine = async (imageFile: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('analyze-medicine', {
        body: {
          imageData,
          userId: user?.id || null
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
      
      toast({
        title: "Analysis Complete!",
        description: `Successfully identified: ${data.data.summary.name}`,
      });

      return data.data;

    } catch (error) {
      console.error('Medicine analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze medicine image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeMedicine,
    isAnalyzing,
    result,
    setResult
  };
};
