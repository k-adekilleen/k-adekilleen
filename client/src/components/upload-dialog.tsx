import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera } from "lucide-react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function UploadDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const { toast } = useToast();

  const handleStartScanning = async () => {
    setIsCameraActive(true);

    if (!codeReader.current) {
      codeReader.current = new BrowserMultiFormatReader();
    }

    try {
      // Start continuous scanning
      const interval = setInterval(async () => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            try {
              const result = await codeReader.current.decodeFromImage(imageSrc);
              if (result) {
                handleScanResult(result.getText());
                clearInterval(interval);
                setIsCameraActive(false);
                setIsOpen(false);
              }
            } catch (error) {
              // Ignore errors during scanning attempts
            }
          }
        }
      }, 500);

      // Clean up interval when dialog closes
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to start scanning:', error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleScanResult = (result: string) => {
    toast({
      title: "Product Scanned",
      description: `Scanned code: ${result}. Searching database...`,
    });
    // TODO: Implement product lookup based on scanned code
  };

  const handleClose = () => {
    setIsCameraActive(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Camera className="h-4 w-4 mr-2" />
          Scan Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Product</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isCameraActive ? (
            <div className="relative aspect-video">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-lg w-full"
              />
              <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none" />
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                onClick={handleStartScanning}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Position the product's barcode or QR code in front of your camera
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}