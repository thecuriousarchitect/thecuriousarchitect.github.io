# Image Directory Structure

This directory contains all images for The Curious Architect website.

## Directory Organization

```
images/
├── buildings/          # Full-size building photos for story pages
├── thumbs/            # Thumbnail images for cards and previews
├── backgrounds/       # Hero section background images
├── about/            # Images for about page
└── assets/           # Icons and other assets
```

## Image Guidelines

### Format & Quality
- **Preferred format:** WebP (with JPG fallback)
- **Resolution:** 
  - Buildings: 1920x1080px minimum
  - Thumbnails: 600x400px
  - Hero images: 2560x1440px
- **Style:** Black and white, high contrast
- **Quality:** 85-90% compression for optimal balance

### Naming Convention
- Use lowercase with hyphens
- Format: `building-name-descriptor.jpg`
- Examples:
  - `sagrada-familia-main.jpg`
  - `sagrada-familia-interior.jpg`
  - `colosseum-exterior.jpg`

### Adding New Images

1. **Edit images:**
   - Convert to black and white
   - Adjust contrast for dramatic effect
   - Crop to highlight architectural features
   - Ensure proper composition

2. **Optimize images:**
   ```bash
   # Using ImageMagick
   convert input.jpg -quality 85 -grayscale Rec709Luma output.jpg
   
   # Or use online tools:
   # - TinyPNG (tinypng.com)
   # - Squoosh (squoosh.app)
   ```

3. **Place in correct directory:**
   - Story main images → `buildings/`
   - Gallery thumbnails → `thumbs/`
   - Hero backgrounds → `backgrounds/`

4. **Update data:**
   - Add image paths to `data/buildings.json`
   - Reference in HTML files

## Placeholder Images

For development, you can use placeholder services:
- https://placeholder.com/
- https://picsum.photos/
- https://unsplash.com/ (free stock photos)

Example:
```html
<img src="https://picsum.photos/1920/1080?grayscale" alt="Building">
```

## Copyright & Attribution

- Only use images you have rights to
- Provide attribution where required
- Consider using Creative Commons licensed images
- Take your own photos when possible

## Current Image Needs

### Priority Images Needed:
1. Sagrada Familia (main + 3 gallery)
2. Colosseum (main + 2 gallery)
3. Taj Mahal (main)
4. Burj Khalifa (main)
5. Guggenheim Bilbao (main)
6. Sydney Opera House (main)

### Category Thumbnails:
- Religious structures
- Modern architecture
- Historical monuments
- Museums & cultural spaces

### Hero Images:
- Homepage hero background
- About page profile photo

## Resources

### Free Architecture Photo Sources:
- **Unsplash:** unsplash.com/s/photos/architecture
- **Pexels:** pexels.com/search/architecture/
- **Pixabay:** pixabay.com/images/search/architecture/
- **Wikimedia Commons:** commons.wikimedia.org

### Image Editing Tools:
- **GIMP:** Free, open-source (gimp.org)
- **Photopea:** Free, browser-based (photopea.com)
- **Adobe Lightroom:** Professional (paid)
- **Darktable:** Free, professional (darktable.org)
