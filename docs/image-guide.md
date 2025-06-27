# Guide for Adding Images to Dakar-Cut

This guide explains how to replace placeholder images with real images in the Dakar-Cut application.

## Image Structure

The application uses images in the following locations:

1. **Salon Images**
   - Main gallery images for each salon
   - Located in `/public/assets/images/salons/`
   - Used in salon cards and salon detail pages

2. **Stylist Images**
   - Profile images for each stylist
   - Portfolio work images showing stylist's previous work
   - Located in `/public/assets/images/stylists/`
   - Used in stylist profiles and salon detail pages

3. **Onboarding Images**
   - Images used in the onboarding carousel
   - Located in `/public/assets/images/onboarding/`
   - Used in the onboarding page for new users

## Adding Your Own Images

### Step 1: Prepare Your Images

Prepare your images according to these specifications:

- **Salon Gallery Images**
  - Recommended size: 800x600 pixels
  - Format: JPG or WebP
  - Content: Interior/exterior shots of salons, styling stations, etc.

- **Stylist Profile Images**
  - Recommended size: 400x400 pixels
  - Format: JPG or WebP
  - Content: Professional headshots of stylists

- **Stylist Portfolio Images**
  - Recommended size: 600x800 pixels
  - Format: JPG or WebP
  - Content: Before/after shots of hairstyles, styling work, etc.

- **Onboarding Images**
  - Recommended size: 800x800 pixels
  - Format: JPG or WebP
  - Content: Images representing each onboarding step

### Step 2: Create Directory Structure

Ensure the following directory structure exists:

```
public/
  assets/
    images/
      salons/
      stylists/
      onboarding/
```

You can create these directories manually or run the provided scripts:

```bash
npm run download-images         # Creates salon and stylist directories
npm run download-onboarding-images  # Creates onboarding directory
```

### Step 3: Add Your Images

Place your images in the appropriate directories following these naming conventions:

- **Salon Images**
  - Format: `salon-name-number.jpg`
  - Example: `elegance-coiffure-1.jpg`, `elegance-coiffure-2.jpg`, etc.

- **Stylist Images**
  - Profile: `stylist-name.jpg`
  - Portfolio: `stylist-name-work-number.jpg`
  - Example: `aminata.jpg`, `aminata-work-1.jpg`, etc.

- **Onboarding Images**
  - Recommended names: `find-salons.jpg`, `try-new-look.jpg`, `book-appointment.jpg`, `get-advice.jpg`

### Step 4: Update Image References

The application references images in several files:

1. **Salon and Stylist Images**
   - These are referenced in `src/lib/placeholder-data.ts`
   - All paths should start with `/assets/images/`

2. **Onboarding Images**
   - These are referenced in `src/app/onboarding/page.tsx`
   - Update the `image` property in the `onboardingSteps` array

### Step 5: Default Images

The application includes default fallback images:

- `/assets/images/salons/default-salon.jpg` - Used when a salon image is not available
- `/assets/images/stylists/default-stylist.jpg` - Used when a stylist profile image is not available
- `/assets/images/stylists/default-portfolio.jpg` - Used when a portfolio work image is not available

You can replace these with your own default images if desired.

## Using Sample Images

If you don't have your own images yet, you can use the provided scripts to download sample images from Unsplash:

```bash
# Download salon and stylist sample images
npm run download-images

# Download onboarding sample images
npm run download-onboarding-images
```

These scripts will create the necessary directories and download appropriate sample images for testing.

## Troubleshooting

- If images don't appear, check that the file paths in your code match the actual location of your image files
- Ensure all image paths start with `/assets/images/`
- Verify that your images are in a supported format (JPG, PNG, WebP)
- Check the browser console for any errors related to loading images