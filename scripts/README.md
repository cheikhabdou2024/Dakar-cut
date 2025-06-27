# Dakar-Cut Scripts

This directory contains utility scripts for the Dakar-Cut application.

## Available Scripts

### download-sample-images.js

This script downloads sample images from Unsplash for testing purposes. It creates the necessary folder structure in `public/assets/images/` and downloads placeholder images that match the paths specified in the `placeholder-data.ts` file.

### download-onboarding-images.js

This script downloads sample images for the onboarding page. It creates an `onboarding` directory in `public/assets/images/` and downloads images that can be used in the onboarding carousel.

#### Usage

Run the script using npm:

```bash
npm run download-images
```

Or directly with Node.js:

```bash
node scripts/download-sample-images.js
```

#### What it does

1. Creates the necessary directory structure:
   - `public/assets/images/salons/`
   - `public/assets/images/stylists/`

2. Downloads sample images for:
   - Salon gallery images (3 images per salon)
   - Stylist profile images
   - Stylist portfolio work images (3 images per stylist)
   - Default fallback images

#### Notes

- The script uses Unsplash's random image API to fetch relevant images
- Images are downloaded with a small delay between requests to avoid rate limiting
- The script will not re-download images that already exist
- Default fallback images are created for cases where specific images are not available

## Adding Your Own Images

Instead of using the sample images, you can add your own images to the `public/assets/images/` directory. Follow the naming conventions described in the `public/assets/images/README.md` file.