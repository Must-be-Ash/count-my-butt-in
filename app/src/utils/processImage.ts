import Jimp from "jimp";
import axios from "axios";
import { gradient } from "./overlay";

const fetchImageFromUrl = async (url: string) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const imageBuffer = Buffer.from(response.data);
  return imageBuffer;
}

export async function overlayImages({
  url, // url of the backgroung image
  overlaySignature, // data uri of the autograph
}: {
  url: string,
  overlaySignature: string,
}) {
  try {
    // Replace these paths with your actual file paths
    const autograph = Buffer.from(overlaySignature.split(',')[1], 'base64')
    // const autographResizer = await sharp(autograph).resize({width: 700, height: 700}).toBuffer();
    const autographResizer = (await Jimp.read(autograph))
      .resize(700, 700)
    const backgroundImage = await fetchImageFromUrl(url);

    // Create a gradient image (adjust parameters as needed)
    const gradientOverlay = (await Jimp.read(Buffer.from(gradient.split(',')[1], 'base64'))).resize(800, 800)


    // Load the background image
    const background = await Jimp.read(backgroundImage);

    // Load the PNG image, resize, and overlay on the background
    const output = await (await background)
      .resize(800,800)
      .composite(gradientOverlay, 0, 0, { mode: Jimp["BLEND_SOURCE_OVER"], opacityDest: 1, opacitySource: 1 })
      .composite(autographResizer, 0, 0, { mode: Jimp["BLEND_EXCLUSION"], opacityDest: 1, opacitySource: 1 })
      .getBufferAsync(Jimp.MIME_PNG);

    const dataURI =`data:image/png;base64,${output.toString('base64')}`;
    return dataURI;
  } catch (err) {
    console.error('Error processing image:', err);
  }
  return '';
}
