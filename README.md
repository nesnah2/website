# Men's Mentoring Website

A professional, modern website for Mikkel Hansen's men's mentoring services.

## Features

- **Professional Design**: Modern, responsive layout with beautiful gradients and typography
- **Mobile-First**: Fully responsive design that works on all devices
- **Interactive Elements**: Smooth animations, hover effects, and form validation
- **Professional Content**: Structured sections for services, about, and contact
- **Font Awesome Icons**: Professional iconography throughout the site
- **Google Fonts**: Inter font family for modern, readable typography

## Website Sections

1. **Hero Section**: Compelling headline with call-to-action buttons
2. **About Section**: Personal introduction with key features
3. **Services Section**: Three-tier pricing structure
   - Transformation Package ($800)
   - Mastery Program ($500)
   - Discovery Session ($150)
4. **Contact Section**: Contact form and information
5. **Footer**: Links and company information

## Technical Details

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript**: Interactive functionality and mobile navigation
- **Responsive Design**: Mobile-first approach with breakpoints
- **Performance**: Optimized images and smooth animations

## Getting Started

1. **Start the server**:
   ```bash
   start-server.bat
   ```

2. **View the website**:
   Open your browser and go to `http://localhost:8000`

## File Structure

```
website/
├── index.html                 # Main website file
├── public/
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   └── js/
│       └── main.js           # JavaScript functionality
├── assets/
│   ├── mentor.jpg            # Mentor profile image
│   └── video-thumbnail.jpg   # Custom video thumbnail (add this!)
├── start-server.bat          # Server startup script
└── README.md                 # This file
```

## 🎥 **Video Thumbnail Setup**

To complete the video section setup, you need to add your custom video thumbnail image:

1. **Save your new video picture** as `video-thumbnail.jpg`
2. **Place it in the `assets/` folder** alongside your existing `mentor.jpg`
3. **The image should be** at least 800x450 pixels for best quality

### **How the Video Section Works:**

1. **Visitors see your custom thumbnail** with a red play button overlay
2. **Click the thumbnail** to reveal the video player
3. **Video starts playing** from YouTube at [https://youtu.be/Ht3vwpCsYzo](https://youtu.be/Ht3vwpCsYzo)
4. **Mobile responsive** - works perfectly on all devices

### **Features Added:**

- ✅ **Custom Video Thumbnail** - Shows your new picture before video plays
- ✅ **Interactive Play Button** - Red YouTube-style play button overlay
- ✅ **Click to Play** - Click thumbnail to reveal the video
- ✅ **Professional Look** - Enhanced video section with your branding

## Customization

### Colors
The website uses a modern color scheme:
- Primary: `#667eea` (Blue)
- Secondary: `#764ba2` (Purple)
- Text: `#333` (Dark Gray)
- Background: `#f8fafc` (Light Gray)

### Content
Update the following in `index.html`:
- Personal information and bio
- Service descriptions and pricing
- Contact details
- Profile image

### Styling
Modify `public/css/styles.css` to:
- Change colors and fonts
- Adjust spacing and layout
- Modify animations and effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Future Enhancements

- Blog section for mentoring content
- Client testimonials
- Online booking system
- Payment integration
- Newsletter signup
- Social media integration

## Support

For questions or customization requests, contact Mikkel Hansen at mikkel@mikkelhansen.org

---

*Built with modern web technologies for a professional online presence.*

