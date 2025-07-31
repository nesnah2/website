# Men's Mentoring Website - Professional Edition

A modern, professional website for men's mentoring services with advanced features including analytics, performance optimization, and secure backend functionality.

## 🚀 Features

### Frontend
- **Modern Design**: Clean, professional design optimized for conversion
- **Responsive Layout**: Mobile-first approach with perfect mobile experience
- **Performance Optimized**: Fast loading with service worker caching
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Accessibility**: WCAG compliant with keyboard navigation
- **Analytics**: Google Analytics integration with custom event tracking
- **Offline Support**: Service worker for offline functionality

### Backend
- **Express.js Server**: Fast, secure Node.js backend
- **Security**: Helmet.js, CORS, rate limiting, input validation
- **Database**: Redis for caching and session management
- **Email Integration**: Nodemailer for contact form processing
- **Payment Processing**: Stripe integration ready
- **SMS Notifications**: Twilio integration ready
- **File Uploads**: AWS S3 integration ready
- **Logging**: Winston for comprehensive logging
- **Monitoring**: Health checks and performance monitoring

### Professional Features
- **Contact Form Processing**: Secure form handling with validation
- **Newsletter Subscription**: Email list management
- **Session Booking**: Automated booking system
- **Analytics Dashboard**: Track conversions and user behavior
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Handling**: Comprehensive error management
- **Background Jobs**: Queue system for heavy tasks

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Redis (optional, for caching)
- MongoDB (optional, for database)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   REDIS_URL=redis://localhost:6379
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Project Structure

```
website/
├── public/                 # Static files
│   ├── js/
│   │   └── main.js        # Main JavaScript application
│   ├── css/
│   │   └── main.css       # Styles (if separated)
│   ├── assets/            # Images and media
│   └── sw.js             # Service worker
├── logs/                  # Application logs
├── server.js             # Express server
├── package.json          # Dependencies and scripts
├── env.example           # Environment variables template
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `PORT` | Server port | No | `3000` |
| `REDIS_URL` | Redis connection URL | No | - |
| `SMTP_HOST` | SMTP server host | No | - |
| `SMTP_USER` | SMTP username | No | - |
| `SMTP_PASS` | SMTP password | No | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | No | - |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | No | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | No | - |

### Feature Flags

Control which features are enabled:

```env
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
ENABLE_PAYMENTS=true
ENABLE_FILE_UPLOADS=true
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   npm run optimize
   ```

2. **Set production environment**
   ```bash
   export NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### PM2 Deployment

```bash
npm install -g pm2
pm2 start server.js --name "mens-mentoring"
pm2 save
pm2 startup
```

## 📊 Analytics & Monitoring

### Google Analytics
- Page views and user behavior tracking
- Custom events for form submissions
- Conversion tracking
- Performance monitoring

### Performance Monitoring
- Core Web Vitals tracking
- Page load times
- API response times
- Error tracking

### Custom Analytics
- Contact form submissions
- Newsletter subscriptions
- Session bookings
- User engagement metrics

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API protection
- **Input Validation**: Joi validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token-based protection

## 📱 PWA Features

- **Service Worker**: Offline functionality
- **App Manifest**: Installable web app
- **Push Notifications**: Real-time updates
- **Background Sync**: Offline form submissions
- **Caching**: Intelligent resource caching

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Format code
npm run format
```

## 📈 Performance Optimization

- **Image Optimization**: Automatic image compression
- **CSS/JS Minification**: Production builds
- **Gzip Compression**: Reduced file sizes
- **Caching**: Multiple cache layers
- **CDN Ready**: Static asset optimization
- **Lazy Loading**: On-demand resource loading

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run optimize     # Optimize assets
npm run deploy       # Build and optimize
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run tests
```

### Code Quality

- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **Supertest**: API testing

## 📞 Support

For support and questions:

- **Email**: [your-email@domain.com]
- **Documentation**: [docs-url]
- **Issues**: [GitHub issues]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🎯 Roadmap

- [ ] Payment processing integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced booking system
- [ ] Video call integration
- [ ] Client portal
- [ ] Automated email sequences
- [ ] Advanced SEO features

---

**Built with ❤️ for professional men's mentoring services**