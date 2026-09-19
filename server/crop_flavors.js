import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

const sourceImage = 'C:/Users/L9IIRCH/.gemini/antigravity/brain/487f1db3-4204-4edf-bb90-d0a514f0be22/.user_uploaded/media_1788884874788.png';
const outputDir = 'c:/Users/L9IIRCH/Desktop/Kenzna/client/public/flavors';

async function cropFlavors() {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const image = await Jimp.read(sourceImage);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    console.log(`Image dimensions: ${width}x${height}`);

    const cols = 4;
    const rows = 2;
    const cardWidth = Math.floor(width / cols);
    const cardHeight = Math.floor(height / rows);

    const names = [
      ['cheese-peanuts.png', 'herb-almonds.png', 'spicy-peanuts.png', 'honey-almonds.png'],
      ['bbq-cashews.png', 'smoked-cashews.png', 'garlic-nuts.png', 'paprika-nuts.png']
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cardWidth;
        const y = r * cardHeight;
        const filename = names[r][c];
        const destPath = path.join(outputDir, filename);

        const cropped = image.clone().crop({ x, y, w: cardWidth, h: cardHeight });
        await cropped.write(destPath);
        console.log(`✅ Saved ${filename}`);
      }
    }

    console.log('🎉 All 8 flavored nuts images cropped successfully!');
  } catch (error) {
    console.error('Crop error:', error);
  }
}

cropFlavors();
