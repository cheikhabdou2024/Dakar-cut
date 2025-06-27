# Dakar-Cut

A modern web application for finding and booking hair salons and stylists in Dakar, built with Next.js.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:9002](http://localhost:9002) in your browser

## Image Assets

The application uses real images for salons and stylists, stored in the `public/assets/images/` directory. The images are referenced in `src/lib/placeholder-data.ts`.

### Adding Your Own Images

You can add your own images to the `public/assets/images/` directory following these steps:

1. Create the necessary directories if they don't exist:
   - `public/assets/images/salons/`
   - `public/assets/images/stylists/`
   - `public/assets/images/onboarding/`

2. Add your images following the naming conventions described in `public/assets/images/README.md`

3. Update the references in `src/lib/placeholder-data.ts` and other files to point to your new images

For detailed instructions, see the [Image Guide](docs/image-guide.md).

### Downloading Sample Images

For testing purposes, you can download sample images using the provided scripts:

```bash
# Download salon and stylist images
npm run download-images

# Download onboarding page images
npm run download-onboarding-images
```

These scripts will download sample images from Unsplash and place them in the correct directories.

## Project Structure

- `src/app/` - Next.js application routes
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and data
- `public/assets/` - Static assets including images
- `scripts/` - Utility scripts for development

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

To get started with development, take a look at `src/app/page.tsx`.
