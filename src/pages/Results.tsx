
import { useState } from "react";
import { ArrowLeft, AlertTriangle, Info, Clock, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import DosageChart from "@/components/DosageChart";
import SideEffectsChart from "@/components/SideEffectsChart";
import AlternativesCarousel from "@/components/AlternativesCarousel";

// Mock data for demonstration
const mockMedicineData = {
  name: "Ibuprofen 200mg",
  brand: "Advil",
  image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop",
  activeIngredient: "Ibuprofen",
  dosage: "200mg",
  form: "Tablet",
  manufacturer: "Pfizer Inc.",
  ndcNumber: "0573-0164-01",
  status: "Approved",
  indication: "Pain reliever and fever reducer",
  description: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation caused by conditions such as headaches, toothaches, back pain, arthritis, menstrual cramps, or minor injuries."
};

const Results = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-blue-50 transition-colors duration-200"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Medicine Image and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img 
                    src={mockMedicineData.image}
                    alt={mockMedicineData.name}
                    className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg mb-4"
                  />
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {mockMedicineData.name}
                  </h1>
                  <p className="text-lg text-blue-600 font-semibold">
                    {mockMedicineData.brand}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Ingredient:</span>
                    <Badge variant="secondary" className="font-semibold">
                      {mockMedicineData.activeIngredient}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Form:</span>
                    <span className="font-semibold">{mockMedicineData.form}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dosage:</span>
                    <span className="font-semibold">{mockMedicineData.dosage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="default" className="bg-green-500">
                      {mockMedicineData.status}
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
                <TabsTrigger value="dosage" className="rounded-lg">Dosage</TabsTrigger>
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
                      <p className="text-gray-700 leading-relaxed">
                        {mockMedicineData.description}
                      </p>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Primary Uses:</h4>
                        <ul className="text-blue-700 space-y-1">
                          <li>• Headache and migraine relief</li>
                          <li>• Muscle and joint pain</li>
                          <li>• Fever reduction</li>
                          <li>• Menstrual cramp relief</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Manufacturer Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600">Manufacturer:</span>
                          <p className="font-semibold">{mockMedicineData.manufacturer}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">NDC Number:</span>
                          <p className="font-semibold font-mono">{mockMedicineData.ndcNumber}</p>
                        </div>
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
                      Dosage Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DosageChart />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="side-effects">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
                      Side Effects Frequency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SideEffectsChart />
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
                    <AlternativesCarousel />
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
