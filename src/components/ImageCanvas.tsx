import React from "react";

interface ImageCanvasProps {
  imageData: ImageData | null;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ imageData }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current !== null) {
      if (imageData != null) {
        // canvasRef.current?.putImageData(imageData, 0, 0)
        const canvas = canvasRef.current;
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const context = canvas.getContext("2d");
        context?.putImageData(imageData, 0, 0);
      } else {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0;
        canvas.height = 0;
      }
    }
  }, [canvasRef, imageData]);

  return <canvas ref={canvasRef} />;
};

export default ImageCanvas;
