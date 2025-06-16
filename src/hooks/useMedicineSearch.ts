
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  medicine_name: string;
  medicine_type: string;
  identification_confidence: number;
  search_date: string;
  medicine_search_id?: string;
  results?: any;
}

export const useMedicineSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  const searchMedicine = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('Searching for:', query);
      
      // Search in search history with a more flexible pattern
      const { data: historyData, error: historyError } = await supabase
        .from('search_history')
        .select(`
          id,
          medicine_name,
          medicine_type,
          identification_confidence,
          search_date,
          medicine_search_id
        `)
        .or(`medicine_name.ilike.%${query}%,medicine_type.ilike.%${query}%`)
        .order('search_date', { ascending: false })
        .limit(20);

      console.log('Search history results:', historyData);
      console.log('Search history error:', historyError);

      if (historyError) {
        console.error('Search history error:', historyError);
        throw historyError;
      }

      // If we have results from history, get the detailed results
      if (historyData && historyData.length > 0) {
        const searchIds = historyData
          .map(item => item.medicine_search_id)
          .filter(Boolean);

        console.log('Found search IDs:', searchIds);

        let detailedResults = historyData;
        
        if (searchIds.length > 0) {
          const { data: searchData, error: searchError } = await supabase
            .from('medicine_searches')
            .select('id, results')
            .in('id', searchIds);

          console.log('Medicine searches results:', searchData);
          console.log('Medicine searches error:', searchError);

          if (!searchError && searchData) {
            // Merge the results
            detailedResults = historyData.map(historyItem => {
              const searchResult = searchData.find(s => s.id === historyItem.medicine_search_id);
              return {
                ...historyItem,
                results: searchResult?.results
              };
            });
          }
        }

        setSearchResults(detailedResults);
        
        toast({
          title: "Search Complete",
          description: `Found ${detailedResults.length} result(s) for "${query}"`,
        });
      } else {
        setSearchResults([]);
        
        // Also search in medicine_searches table directly in case there's data there
        const { data: directSearchData, error: directSearchError } = await supabase
          .from('medicine_searches')
          .select('*')
          .or(`query.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .limit(10);

        console.log('Direct search results:', directSearchData);
        
        if (!directSearchError && directSearchData && directSearchData.length > 0) {
          // Convert medicine_searches results to SearchResult format
          const convertedResults = directSearchData.map(item => ({
            id: item.id,
            medicine_name: item.results?.extracted?.medicine_name || item.query || 'Unknown Medicine',
            medicine_type: item.results?.extracted?.medicine_type || 'Unknown',
            identification_confidence: item.results?.confidence || 0,
            search_date: item.created_at,
            medicine_search_id: item.id,
            results: item.results
          }));
          
          setSearchResults(convertedResults);
          
          toast({
            title: "Search Complete",
            description: `Found ${convertedResults.length} result(s) for "${query}"`,
          });
        } else {
          toast({
            title: "No Results",
            description: `No medicines found for "${query}". Try uploading an image for identification.`,
            variant: "destructive",
          });
        }
      }

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search medicines. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return {
    searchMedicine,
    isSearching,
    searchResults,
    clearSearch
  };
};
