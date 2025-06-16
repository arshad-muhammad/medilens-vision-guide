
import { useState, useCallback } from "react";
import { Upload, Camera, FileImage, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMedicineAnalysis } from "@/hooks/useMedicineAnalysis";
import { useNavigate } from "react-router-dom";

const UploadSection = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { analyzeMedicine, isAnalyzing } = useMedicineAnalysis();
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileUpload = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setUploadedFile(file);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Image uploaded successfully!",
      description: "Click 'Analyze Medicine' to get detailed information",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    try {
      const result = await analyzeMedicine(uploadedFile);
      // Navigate to results page with the analysis data
      navigate('/results', { state: { analysisResult: result } });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setUploadedFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card 
        className={`border-2 border-dashed transition-all duration-300 hover:shadow-lg ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-12">
          {isAnalyzing ? (
            <div className="text-center">
              <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Analyzing Medicine...
              </h3>
              <p className="text-gray-500 mb-2">
                Our AI is identifying your medicine
              </p>
              <div className="text-sm text-gray-400">
                This may take 10-30 seconds...
              </div>
            </div>
          ) : uploadedImage ? (
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded medicine" 
                  className="w-32 h-32 object-cover rounded-xl mx-auto shadow-lg"
                />
              </div>
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Image Uploaded Successfully
              </h3>
              <p className="text-gray-500 mb-6">
                Click "Analyze Medicine" to get detailed information
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Medicine"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={resetUpload}
                  className="px-8 py-3 rounded-xl font-semibold"
                  disabled={isAnalyzing}
                >
                  Upload Another
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
                  <span className="text-sm font-medium text-amber-800">Medical Disclaimer</span>
                </div>
                <p className="text-xs text-amber-700">
                  This tool is for informational purposes only. Always consult healthcare professionals for medical advice.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  Upload Medicine Image
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Drag and drop your medicine photo here, or click to browse. 
                  Supports tablets, syrups, capsules, and medicine packaging.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <label htmlFor="file-upload">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    asChild
                  >
                    <span>
                      <Upload className="mr-2 h-5 w-5" />
                      Choose File
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="text-gray-400 text-sm">or</div>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 rounded-xl font-semibold text-lg border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                >
                  <FileImage className="mr-2 h-5 w-5" />
                  Browse Gallery
                </Button>
              </div>

              <div className="mt-8 text-xs text-gray-400">
                <p>Supported formats: JPG, PNG, WEBP • Max size: 10MB</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
