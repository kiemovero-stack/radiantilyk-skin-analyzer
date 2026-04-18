/**
 * Generate Android app icons from the iOS 1024px source icon.
 * Sizes: mdpi=48, hdpi=72, xhdpi=96, xxhdpi=144, xxxhdpi=192
 * Foreground (adaptive): mdpi=108, hdpi=162, xhdpi=216, xxhdpi=324, xxxhdpi=432
 */
import { execSync } from "child_process";
import { existsSync } from "fs";

const SOURCE = "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png";
const BASE = "android/app/src/main/res";

if (!existsSync(SOURCE)) {
  console.error("Source icon not found:", SOURCE);
  process.exit(1);
}

const sizes = {
  "mipmap-mdpi": { launcher: 48, foreground: 108 },
  "mipmap-hdpi": { launcher: 72, foreground: 162 },
  "mipmap-xhdpi": { launcher: 96, foreground: 216 },
  "mipmap-xxhdpi": { launcher: 144, foreground: 324 },
  "mipmap-xxxhdpi": { launcher: 192, foreground: 432 },
};

for (const [dir, { launcher, foreground }] of Object.entries(sizes)) {
  const outDir = `${BASE}/${dir}`;
  // Launcher icon
  execSync(`python3 -c "
from PIL import Image
img = Image.open('${SOURCE}')
img = img.resize((${launcher}, ${launcher}), Image.LANCZOS)
img.save('${outDir}/ic_launcher.png')
img.save('${outDir}/ic_launcher_round.png')
"`);
  // Foreground (centered with padding for adaptive icon)
  execSync(`python3 -c "
from PIL import Image
img = Image.open('${SOURCE}')
fg = Image.new('RGBA', (${foreground}, ${foreground}), (0, 0, 0, 0))
icon_size = int(${foreground} * 0.65)
icon = img.resize((icon_size, icon_size), Image.LANCZOS)
offset = (${foreground} - icon_size) // 2
fg.paste(icon, (offset, offset))
fg.save('${outDir}/ic_launcher_foreground.png')
"`);
  console.log(`Generated ${dir}: ${launcher}px launcher, ${foreground}px foreground`);
}

console.log("Android icons generated successfully!");
