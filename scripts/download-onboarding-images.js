/**
 * This script downloads sample images for the onboarding page of the Dakar-Cut application.
 * It creates the necessary folder structure and downloads images that match the paths
 * specified in the onboarding page.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Base directories
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const IMAGES_DIR = path.join(ASSETS_DIR, 'images');
const ONBOARDING_DIR = path.join(IMAGES_DIR, 'onboarding');

// Sample image URLs (replace these with your actual image URLs)
const SAMPLE_IMAGES = [
  {
    name: 'find-salons.jpg',
    url: 'https://source.unsplash.com/random/800x800/?salon,map'
  },
  {
    name: 'try-new-look.jpg',
    url: 'https://source.unsplash.com/random/800x800/?hairstyle,before,after'
  },
  {
    name: 'book-appointment.jpg',
    url: 'https://source.unsplash.com/random/800x800/?salon,interior'
  },
  {
    name: 'get-advice.jpg',
    url: 'https://source.unsplash.com/random/800x800/?hair,products'
  }
];

// Create directories if they don't exist
async function createDirectories() {
  const dirs = [PUBLIC_DIR, ASSETS_DIR, IMAGES_DIR, ONBOARDING_DIR];
  
  for (const dir of dirs) {
    try {
      if (!fs.existsSync(dir)) {
        await mkdir(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
}

// Download an image from a URL and save it to a file
async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filePath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download onboarding images
async function downloadOnboardingImages() {
  for (const image of SAMPLE_IMAGES) {
    const filePath = path.join(ONBOARDING_DIR, image.name);
    if (!fs.existsSync(filePath)) {
      try {
        await downloadImage(image.url, filePath);
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error downloading image ${filePath}:`, error);
      }
    }
  }
}

// Main function
async function main() {
  try {
    console.log('Starting download of onboarding images...');
    await createDirectories();
    await downloadOnboardingImages();
    console.log('All onboarding images downloaded successfully!');
    console.log('\nTo use these images in your onboarding page, update the image paths in src/app/onboarding/page.tsx to:');
    console.log('  - /assets/images/onboarding/find-salons.jpg');
    console.log('  - /assets/images/onboarding/try-new-look.jpg');
    console.log('  - /assets/images/onboarding/book-appointment.jpg');
    console.log('  - /assets/images/onboarding/get-advice.jpg');
  } catch (error) {
    console.error('Error downloading onboarding images:', error);
  }
}

// Run the script
main();