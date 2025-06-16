
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";

const alternatives = [
  {
    id: 1,
    name: "Acetaminophen 500mg",
    brand: "Tylenol",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    rating: 4.5,
    price: "$8.99",
    pros: ["Gentler on stomach", "Safe with alcohol (moderate)"],
    cons: ["Less anti-inflammatory effect"],
    similarity: 85
  },
  {
    id: 2,
    name: "Naproxen 220mg",
    brand: "Aleve",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    rating: 4.3,
    price: "$12.49",
    pros: ["Longer lasting (8-12 hours)", "Strong anti-inflammatory"],
    cons: ["Higher stomach risk", "Not for heart conditions"],
    similarity: 78
  },
  {
    id: 3,
    name: "Aspirin 325mg",
    brand: "Bayer",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    rating: 4.1,
    price: "$6.99",
    pros: ["Heart protective", "Anti-clotting benefits"],
    cons: ["Higher bleeding risk", "Not for children"],
    similarity: 72
  }
];

const AlternativesCarousel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Why Consider Alternatives?</h4>
        <p className="text-blue-700 text-sm">
          Different pain relievers work better for different conditions and have varying side effect profiles. 
          Consult your healthcare provider to find the best option for your specific needs.
        </p>
      </div>

      <div className="grid gap-6">
        {alternatives.map((alt) => (
          <Card key={alt.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={alt.image}
                    alt={alt.name}
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                </div>

                {/* Main Info */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="text-lg font-semibold text-gray-800">{alt.name}</h5>
                      <p className="text-blue-600 font-medium">{alt.brand}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {alt.rating}
                      </div>
                      <p className="text-lg font-bold text-green-600">{alt.price}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {alt.similarity}% Similar to Ibuprofen
                    </Badge>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h6 className="font-semibold text-green-700 text-sm mb-2">✓ Advantages:</h6>
                      <ul className="text-sm text-green-600 space-y-1">
                        {alt.pros.map((pro, index) => (
                          <li key={index}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold text-red-700 text-sm mb-2">⚠ Considerations:</h6>
                      <ul className="text-sm text-red-600 space-y-1">
                        {alt.cons.map((con, index) => (
                          <li key={index}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <h5 className="font-semibold text-amber-800 mb-2">💡 Important Note:</h5>
        <p className="text-amber-700 text-sm">
          Never switch medications without consulting your healthcare provider. They can help you choose 
          the safest and most effective option based on your medical history and current medications.
        </p>
      </div>
    </div>
  );
};

export default AlternativesCarousel;
