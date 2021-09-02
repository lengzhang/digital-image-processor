import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import ImageCanvas from "src/components/ImageCanvas";

interface ImageProps {
  title: string;
  imageData: ImageData | null;
}

const Image: React.FC<ImageProps> = ({ title, imageData }) => {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent
        component={Box}
        overflow="auto"
        maxWidth="100%"
        maxHeight={600}
      >
        <ImageCanvas imageData={imageData} />
      </CardContent>
    </Card>
  );
};

export default Image;
