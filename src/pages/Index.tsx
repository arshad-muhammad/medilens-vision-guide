
import { useState } from "react";
import { Upload, Search, Shield, Zap, BarChart3, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";
import FeatureCard from "@/components/FeatureCard";
import SearchResults from "@/components/SearchResults";
import { useMedicineSearch } from "@/hooks/useMedicineSearch";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { searchMedicine, isSearching, searchResults, clearSearch } = useMedicineSearch();

  const features = [
    {
      icon: Camera,
      title: "Smart Image Recognition",
      description: "Upload photos of medicines and get instant AI-powered identification with 99% accuracy"
    },
    {
      icon: Shield,
      title: "Verified Information",
      description: "Access FDA-verified drug data, ingredients, dosage guidelines, and safety information"
    },
    {
      icon: BarChart3,
      title: "Visual Insights",
      description: "Interactive charts showing dosage schedules, side effects, and alternative comparisons"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive medicine information in seconds, not hours of research"
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    await searchMedicine(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
    clearSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              MediLens
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Instantly identify medicines with AI-powered image recognition. 
              Get verified information, dosage schedules, and safety insights in seconds.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search medicine by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300"
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Search Results or Upload Section */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {hasSearched ? (
              <SearchResults 
                results={searchResults} 
                query={searchQuery}
                onClear={handleClearSearch}
              />
            ) : (
              <UploadSection />
            )}
          </div>
        </div>
      </section>

      {/* Features Section - Only show if not searching */}
      {!hasSearched && (
        <>
          <section className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Why Choose MediLens?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the future of medicine identification with our cutting-edge AI technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 py-20">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 border-none shadow-2xl">
              <CardContent className="p-12 text-center text-white">
                <h3 className="text-3xl font-bold mb-4">
                  Ready to Identify Your Medicine?
                </h3>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of users who trust MediLens for accurate medicine information
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Medicine Photo
                </Button>
              </CardContent>
            </Card>
          </section>
        </>
      )}

      {/* Disclaimer */}
      <section className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500 max-w-4xl mx-auto">
          <p className="mb-2">
            <strong>Medical Disclaimer:</strong> MediLens is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always consult with qualified healthcare professionals before making any medical decisions or changes to your medication regimen.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
