
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  medicine_name: string;
  medicine_type: string;
  identification_confidence: number;
  search_date: string;
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
      // Search in search history first
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
        .ilike('medicine_name', `%${query}%`)
        .order('search_date', { ascending: false })
        .limit(10);

      if (historyError) {
        console.error('Search history error:', historyError);
      }

      // If we have results from history, get the detailed results
      if (historyData && historyData.length > 0) {
        const searchIds = historyData
          .map(item => item.medicine_search_id)
          .filter(Boolean);

        let detailedResults = historyData;
        
        if (searchIds.length > 0) {
          const { data: searchData, error: searchError } = await supabase
            .from('medicine_searches')
            .select('id, results')
            .in('id', searchIds);

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
        
        if (detailedResults.length > 0) {
          toast({
            title: "Search Complete",
            description: `Found ${detailedResults.length} result(s) for "${query}"`,
          });
        } else {
          toast({
            title: "No Results",
            description: `No medicines found for "${query}"`,
            variant: "destructive",
          });
        }
      } else {
        setSearchResults([]);
        toast({
          title: "No Results",
          description: `No medicines found for "${query}". Try uploading an image for identification.`,
          variant: "destructive",
        });
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
