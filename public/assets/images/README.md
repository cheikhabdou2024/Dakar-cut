# Image Assets for Dakar-Cut

This folder contains all the image assets used in the Dakar-Cut application.

## Folder Structure

- `/salons/` - Contains images of salon interiors and exteriors
- `/stylists/` - Contains profile images of stylists and their portfolio work
- `/onboarding/` - Contains images used in the onboarding carousel

## Image Naming Conventions

### Salon Images
- Main salon images: `salon-name-1.jpg`, `salon-name-2.jpg`, etc.
- Example: `elegance-coiffure-1.jpg`

### Stylist Images
- Profile images: `stylist-name.jpg`
- Portfolio work: `stylist-name-work-1.jpg`, `stylist-name-work-2.jpg`, etc.
- Example: `aminata.jpg`, `aminata-work-1.jpg`

### Onboarding Images
- Recommended names: `find-salons.jpg`, `try-new-look.jpg`, `book-appointment.jpg`, `get-advice.jpg`
- These correspond to the four steps in the onboarding process

## Image Requirements

### Salon Images
- Recommended size: 800x600 pixels
- Format: JPG or WebP
- Content: Interior/exterior shots of salons, styling stations, etc.

### Stylist Profile Images
- Recommended size: 400x400 pixels
- Format: JPG or WebP
- Content: Professional headshots of stylists

### Stylist Portfolio Images
- Recommended size: 600x800 pixels
- Format: JPG or WebP
- Content: Before/after shots of hairstyles, styling work, etc.

### Onboarding Images
- Recommended size: 800x800 pixels
- Format: JPG or WebP
- Content: Images representing each onboarding step (salon maps, hairstyles, salon interior, hair products)

## Adding New Images

1. Place your images in the appropriate folder following the naming conventions
2. Update the references in `src/lib/placeholder-data.ts` to point to your new images
3. Make sure all image paths start with `/assets/images/`

## Default Images

If you need fallback images, use:
- `/assets/images/salons/default-salon.jpg` - Default salon image
- `/assets/images/stylists/default-stylist.jpg` - Default stylist image
- `/assets/images/stylists/default-portfolio.jpg` - Default portfolio work image

For onboarding, you can temporarily use these default images until you have your own:
- `/assets/images/salons/default-salon.jpg` - For salon-related steps
- `/assets/images/stylists/default-portfolio.jpg` - For hairstyle-related steps
- `/assets/images/stylists/default-stylist.jpg` - For product-related steps