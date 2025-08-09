# Men's Mentoring Website - Performance Optimized

A high-performance, SEO-optimized website for men's mentoring services. Built with modern web technologies and optimized for speed, accessibility, and search engine visibility.

## 🚀 Performance Features

### Core Web Vitals Optimized
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms  
- **Cumulative Layout Shift (CLS)**: < 0.1

### Performance Optimizations
- ✅ Critical CSS inlined for above-the-fold content
- ✅ Non-critical CSS loaded asynchronously
- ✅ JavaScript deferred and optimized
- ✅ Images optimized and lazy-loaded
- ✅ Font loading optimized with preloading
- ✅ Service Worker for caching
- ✅ Gzip compression enabled
- ✅ Browser caching configured
- ✅ CDN-ready structure

### SEO Optimizations
- ✅ Semantic HTML structure
- ✅ Meta tags optimized
- ✅ Structured data (JSON-LD)
- ✅ Sitemap.xml generated
- ✅ Robots.txt configured
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs

## 📁 Project Structure

```
website/
├── index.html              # Main homepage (optimized)
├── public/
│   ├── css/
│   │   ├── critical.css    # Critical above-the-fold styles
│   │   └── main.css        # Non-critical styles
│   ├── js/
│   │   └── main.js         # Optimized JavaScript
│   ├── sw.js              # Service Worker
│   ├── robots.txt         # SEO robots file
│   └── sitemap.xml        # SEO sitemap
├── assets/
│   └── mentor.jpg         # Optimized images
├── server.js              # Optimized Express server
├── package.json           # Dependencies and scripts
├── webpack.config.js      # Build optimization
└── deploy.sh             # Deployment script
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run optimization
npm run optimize
```

## 📊 Performance Commands

```bash
# Build optimized version
npm run build

# Run Lighthouse audit
npm run lighthouse

# Optimize CSS
npm run minify-css

# Compress images
npm run compress-images

# Full optimization
npm run optimize
```

## 🚀 Deployment

### Quick Deployment
```bash
# Run the deployment script
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment Steps
1. **Build the project**: `npm run build`
2. **Optimize assets**: `npm run optimize`
3. **Upload to hosting provider**
4. **Configure domain and SSL**
5. **Set up CDN (recommended)**

### Hosting Recommendations
- **Vercel**: Excellent for static sites with automatic optimization
- **Netlify**: Great performance and easy deployment
- **Cloudflare Pages**: Built-in CDN and optimization
- **AWS S3 + CloudFront**: Enterprise-grade performance

## 📈 Performance Monitoring

### Built-in Monitoring
The website includes performance monitoring that logs:
- Page load times
- DOM content loaded times
- Core Web Vitals metrics

### External Tools
- **Google PageSpeed Insights**: Test performance
- **GTmetrix**: Detailed performance analysis
- **WebPageTest**: Advanced performance testing
- **Lighthouse**: Comprehensive audits

## 🔧 Customization

### Adding New Pages
1. Create HTML file in root directory
2. Add route in `server.js`
3. Update `sitemap.xml`
4. Add to navigation if needed

### Styling Changes
- **Critical styles**: Edit `public/css/critical.css`
- **Non-critical styles**: Edit `public/css/main.css`
- **Build**: Run `npm run build` to optimize

### JavaScript Modifications
- Edit `public/js/main.js`
- Run `npm run build` to optimize and bundle

## 📱 Mobile Optimization

The website is fully optimized for mobile devices:
- Responsive design
- Touch-friendly interactions
- Optimized font sizes
- Fast loading on mobile networks
- PWA-ready structure

## 🔒 Security Features

- Content Security Policy (CSP) headers
- Helmet.js security middleware
- XSS protection
- CSRF protection
- Secure headers configuration

## 📊 Analytics Setup

### Google Analytics
Add your GA tracking code to the analytics section in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Other Analytics
- Facebook Pixel
- LinkedIn Insight Tag
- Custom event tracking

## 🐛 Troubleshooting

### Common Issues

**Build fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Performance issues**
```bash
# Run full optimization
npm run optimize
npm run lighthouse
```

**CSS not loading**
- Check file paths in `index.html`
- Verify CSS files exist in `public/css/`
- Clear browser cache

## 📞 Support

For technical support or questions about the optimization:
- Check the performance logs in browser console
- Run Lighthouse audit for detailed analysis
- Review the optimization checklist in this README

## 📄 License

MIT License - feel free to use this optimized structure for your own projects.

---

**Performance Score Target**: 95+ on Google PageSpeed Insights
**SEO Score Target**: 100/100
**Accessibility Score Target**: 95+