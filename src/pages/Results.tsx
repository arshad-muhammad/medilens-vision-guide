
import { useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle, Info, Clock, Users, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import DosageChart from "@/components/DosageChart";
import SideEffectsChart from "@/components/SideEffectsChart";
import AlternativesCarousel from "@/components/AlternativesCarousel";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    // Get analysis result from navigation state
    if (location.state?.analysisResult) {
      setAnalysisResult(location.state.analysisResult);
    } else {
      // If no analysis result, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Analysis Found</h1>
            <p className="text-gray-600 mb-6">Please upload an image to analyze medicine.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { extracted, summary, confidence } = analysisResult;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-blue-50 transition-colors duration-200"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>

        {/* Confidence Badge */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
            {confidence >= 80 ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : confidence >= 60 ? (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="font-semibold">
              Confidence: {confidence}%
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Medicine Image and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mx-auto shadow-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">💊</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {summary.name}
                  </h1>
                  {summary.brand && (
                    <p className="text-lg text-blue-600 font-semibold">
                      {summary.brand}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Ingredient:</span>
                    <Badge variant="secondary" className="font-semibold">
                      {summary.activeIngredient}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Form:</span>
                    <span className="font-semibold">{summary.form}</span>
                  </div>
                  {summary.strength && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Strength:</span>
                      <span className="font-semibold">{summary.strength}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="default" className="bg-green-500">
                      {summary.fdaStatus || 'Identified'}
                    </Badge>
                  </div>
                </div>

                <Alert className="mt-6 border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    This information is for reference only. Always consult your healthcare provider.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm rounded-xl p-1">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="dosage" className="rounded-lg">Usage</TabsTrigger>
                <TabsTrigger value="side-effects" className="rounded-lg">Side Effects</TabsTrigger>
                <TabsTrigger value="alternatives" className="rounded-lg">Alternatives</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Info className="w-5 h-5 mr-2 text-blue-500" />
                        What is this medicine?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {summary.description}
                      </p>
                      
                      {summary.uses.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Primary Uses:</h4>
                          <ul className="text-blue-700 space-y-1">
                            {summary.uses.map((use, index) => (
                              <li key={index}>• {use}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {summary.warnings.length > 0 && (
                    <Card className="shadow-lg border-red-200">
                      <CardHeader>
                        <CardTitle className="flex items-center text-red-600">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Important Warnings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {summary.warnings.map((warning, index) => (
                            <div key={index} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                              <p className="text-red-800 text-sm">{warning}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Identification Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {extracted.color && (
                          <div>
                            <span className="text-gray-600">Color:</span>
                            <p className="font-semibold">{extracted.color}</p>
                          </div>
                        )}
                        {extracted.shape && (
                          <div>
                            <span className="text-gray-600">Shape:</span>
                            <p className="font-semibold">{extracted.shape}</p>
                          </div>
                        )}
                        {extracted.markings && (
                          <div>
                            <span className="text-gray-600">Markings:</span>
                            <p className="font-semibold font-mono">{extracted.markings}</p>
                          </div>
                        )}
                        {summary.manufacturer && (
                          <div>
                            <span className="text-gray-600">Manufacturer:</span>
                            <p className="font-semibold">{summary.manufacturer}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="dosage">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-green-500" />
                      Usage Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {summary.dosageInstructions ? (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">How to take this medicine:</h4>
                        <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg">
                          {summary.dosageInstructions}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-yellow-800">
                          Specific dosage instructions not available. Please consult the medicine packaging or your healthcare provider.
                        </p>
                      </div>
                    )}
                    <DosageChart />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="side-effects">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
                      Side Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {summary.sideEffects.common.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-orange-600 mb-2">Common Side Effects:</h4>
                          <ul className="space-y-1">
                            {summary.sideEffects.common.map((effect, index) => (
                              <li key={index} className="text-sm bg-orange-50 p-2 rounded">{effect}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {summary.sideEffects.serious.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2">Serious Side Effects:</h4>
                          <ul className="space-y-1">
                            {summary.sideEffects.serious.map((effect, index) => (
                              <li key={index} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-500">{effect}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <SideEffectsChart data={summary.sideEffects.frequencies} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alternatives">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-500" />
                      Alternative Medicines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {summary.alternatives.length > 0 ? (
                      <AlternativesCarousel alternatives={summary.alternatives} />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No alternative medicines information available at this time.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Consult your healthcare provider for alternative options.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
