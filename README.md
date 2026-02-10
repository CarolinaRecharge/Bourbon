# Winston-Salem Bourbon League Website

A refined, speakeasy-inspired website for the Winston-Salem Bourbon League.

## 📁 File Structure

```
/
├── index.html           # Homepage
├── styles.css           # All styling (colors, fonts, layout)
├── script.js            # Interactive features
├── logo.svg             # Club logo
├── content-config.js    # Easy content editing
└── README.md            # This file
```

## 🎨 Design Theme

**Speakeasy / Art Deco Aesthetic**
- Dark, refined color palette
- Gold and copper accents
- Playfair Display (serif) for headings
- Montserrat (sans-serif) for body text

## ✏️ How to Edit Content

### Quick Updates (No HTML Knowledge Required)

Edit the `content-config.js` file to update:
- Event details
- Welcome text
- Barrel pick information
- Social media links
- Site tagline

### Updating Colors

Edit the `:root` section in `styles.css`:

```css
:root {
    --primary-dark: #1a1410;      /* Main background */
    --accent-gold: #d4af37;        /* Gold accent color */
    --accent-copper: #b87333;      /* Copper accent */
    --text-light: #f5f1e8;         /* Main text color */
    --text-muted: #c4b5a0;         /* Muted text */
}
```

### Updating the Logo

Replace `logo.svg` with your own logo file, or edit the existing SVG to customize:
- Text content (WSBL, Winston-Salem, etc.)
- Colors (currently gold: #d4af37)
- Size and proportions

### Adding Images

1. Create an `images` folder in the same directory as index.html
2. Add your images to this folder
3. Update image paths in HTML:
   - Hero background: Line 47 in index.html
   - Barrel pick image: Update `.pick-image .image-placeholder` in HTML

Example:
```html
<!-- Replace placeholder with actual image -->
<div class="pick-image">
    <img src="images/barrel-pick-1.jpg" alt="Barrel Pick">
</div>
```

## 🎯 Monthly Updates Checklist

Each month, update:
1. ✅ Upcoming event details in `content-config.js`
2. ✅ Latest barrel pick information (if new)
3. ✅ Any new photos in the images folder

## 📱 Responsive Design

The site automatically adapts to:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (below 768px)

Mobile menu activates below 768px width.

## 🚀 Next Steps

### Pages to Create:
- about.html
- events.html
- membership.html
- barrel-picks.html
- forum.html

### Features to Add:
- Event calendar integration
- Member login/signup system
- Image gallery
- Newsletter signup form
- Contact form

## 🎨 Color Palette Reference

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Dark | #1a1410 | Main backgrounds |
| Secondary Dark | #2d2520 | Section backgrounds |
| Accent Gold | #d4af37 | Headings, buttons, accents |
| Accent Copper | #b87333 | Secondary accents |
| Text Light | #f5f1e8 | Main text |
| Text Muted | #c4b5a0 | Secondary text |

## 💡 Tips

1. **Maintain consistency**: Use the established color palette and fonts
2. **Keep it refined**: Less is more with this aesthetic
3. **Test on mobile**: Always check how changes look on phones
4. **Image quality**: Use high-resolution images, preferably 1920px wide for hero sections
5. **Backup regularly**: Keep copies of your files before making major changes

## 📧 Support

For questions or issues, contact: info@wsblbourbonleague.com

---

**Est. 2026** | Winston-Salem Bourbon League
