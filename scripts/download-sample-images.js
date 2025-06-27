/**
 * This script helps download sample images for the Dakar-Cut application.
 * It creates the necessary folder structure and downloads placeholder images
 * that match the paths specified in the placeholder-data.ts file.
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
const SALONS_DIR = path.join(IMAGES_DIR, 'salons');
const STYLISTS_DIR = path.join(IMAGES_DIR, 'stylists');

// Sample image URLs (replace these with your actual image URLs)
const SAMPLE_SALON_IMAGE = 'https://source.unsplash.com/random/800x600/?salon';
const SAMPLE_STYLIST_IMAGE = 'https://source.unsplash.com/random/400x400/?hairstylist';
const SAMPLE_PORTFOLIO_IMAGE = 'https://source.unsplash.com/random/600x800/?hairstyle';

// Create directories if they don't exist
async function createDirectories() {
  const dirs = [PUBLIC_DIR, ASSETS_DIR, IMAGES_DIR, SALONS_DIR, STYLISTS_DIR];
  
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

// Download salon images
async function downloadSalonImages() {
  const salonNames = ['elegance-coiffure', 'maitres-style', 'prestige-barbier', 'femme-chic'];
  
  for (const salon of salonNames) {
    for (let i = 1; i <= 3; i++) {
      const filePath = path.join(SALONS_DIR, `${salon}-${i}.jpg`);
      if (!fs.existsSync(filePath)) {
        try {
          await downloadImage(`${SAMPLE_SALON_IMAGE}&sig=${salon}${i}`, filePath);
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error downloading salon image ${filePath}:`, error);
        }
      }
    }
  }

  // Create default salon image
  const defaultSalonPath = path.join(SALONS_DIR, 'default-salon.jpg');
  if (!fs.existsSync(defaultSalonPath)) {
    try {
      await downloadImage(`${SAMPLE_SALON_IMAGE}&sig=default`, defaultSalonPath);
    } catch (error) {
      console.error(`Error downloading default salon image:`, error);
    }
  }
}

// Download stylist images
async function downloadStylistImages() {
  const stylists = ['aminata', 'ousmane', 'khadija', 'ibrahim', 'moussa', 'fatima', 'ndeye'];
  
  for (const stylist of stylists) {
    // Download profile image
    const profilePath = path.join(STYLISTS_DIR, `${stylist}.jpg`);
    if (!fs.existsSync(profilePath)) {
      try {
        await downloadImage(`${SAMPLE_STYLIST_IMAGE}&sig=${stylist}`, profilePath);
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error downloading stylist image ${profilePath}:`, error);
      }
    }
    
    // Download portfolio images
    for (let i = 1; i <= 3; i++) {
      const portfolioPath = path.join(STYLISTS_DIR, `${stylist}-work-${i}.jpg`);
      if (!fs.existsSync(portfolioPath)) {
        try {
          await downloadImage(`${SAMPLE_PORTFOLIO_IMAGE}&sig=${stylist}${i}`, portfolioPath);
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error downloading portfolio image ${portfolioPath}:`, error);
        }
      }
    }
  }

  // Create default stylist images
  const defaultStylistPath = path.join(STYLISTS_DIR, 'default-stylist.jpg');
  if (!fs.existsSync(defaultStylistPath)) {
    try {
      await downloadImage(`${SAMPLE_STYLIST_IMAGE}&sig=default`, defaultStylistPath);
    } catch (error) {
      console.error(`Error downloading default stylist image:`, error);
    }
  }

  const defaultPortfolioPath = path.join(STYLISTS_DIR, 'default-portfolio.jpg');
  if (!fs.existsSync(defaultPortfolioPath)) {
    try {
      await downloadImage(`${SAMPLE_PORTFOLIO_IMAGE}&sig=default`, defaultPortfolioPath);
    } catch (error) {
      console.error(`Error downloading default portfolio image:`, error);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('Starting download of sample images...');
    await createDirectories();
    await downloadSalonImages();
    await downloadStylistImages();
    console.log('All sample images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading sample images:', error);
  }
}

// Run the script
main();