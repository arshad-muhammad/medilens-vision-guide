
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Pill, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  medicine_name: string;
  medicine_type: string;
  identification_confidence: number;
  search_date: string;
  medicine_search_id?: string;
  results?: any;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onClear: () => void;
}

const SearchResults = ({ results, query, onClear }: SearchResultsProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (result: SearchResult) => {
    if (result.results) {
      navigate('/results', { 
        state: { 
          analysisResult: {
            searchId: result.medicine_search_id || result.id,
            extracted: result.results.extracted || {},
            fdaData: result.results.fda_data || null,
            summary: result.results.summary || {},
            confidence: result.identification_confidence || 0
          }
        } 
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <Pill className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No results found for "{query}"
        </h3>
        <p className="text-gray-500 mb-4">
          Try uploading an image of your medicine for AI identification
        </p>
        <Button onClick={onClear} variant="outline">
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Search Results for "{query}"
        </h2>
        <Button onClick={onClear} variant="outline" size="sm">
          Clear Search
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {result.medicine_name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {result.medicine_type && (
                      <div className="flex items-center gap-1">
                        <Pill className="w-4 h-4" />
                        <span className="capitalize">{result.medicine_type}</span>
                      </div>
                    )}
                    
                    {result.identification_confidence && (
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{result.identification_confidence}% confidence</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(result.search_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {result.identification_confidence && (
                    <Badge 
                      variant={result.identification_confidence >= 80 ? "default" : "secondary"}
                      className="whitespace-nowrap"
                    >
                      {result.identification_confidence >= 80 ? "High Confidence" : "Medium Confidence"}
                    </Badge>
                  )}
                </div>
              </div>

              {result.results?.summary?.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {result.results.summary.description}
                </p>
              )}

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleViewDetails(result)}
                  disabled={!result.results}
                  size="sm"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
