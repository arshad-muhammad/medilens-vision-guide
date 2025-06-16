
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Alternative {
  name: string;
  activeIngredient: string;
  reason: string;
}

interface AlternativesCarouselProps {
  alternatives: Alternative[];
}

const AlternativesCarousel = ({ alternatives }: AlternativesCarouselProps) => {
  if (!alternatives || alternatives.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No alternatives available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alternatives.map((alternative, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {alternative.name}
              </h3>
              <Badge variant="outline" className="ml-2">
                Alternative
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Active Ingredient: </span>
                <span className="font-medium">{alternative.activeIngredient}</span>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Why it's an alternative: </span>
                <p className="text-gray-700 leading-relaxed">{alternative.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>Important:</strong> Always consult your healthcare provider before switching medications or considering alternatives.
        </p>
      </div>
    </div>
  );
};

export default AlternativesCarousel;
