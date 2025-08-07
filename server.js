import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import winston from 'winston';
import { createClient } from 'redis';
import { sendContactEmail, sendBookingConfirmation, sendNewsletterConfirmation } from './email.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mens-mentoring-website' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Performance middleware
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving with caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Redis client for caching and sessions
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL
  });
  
  redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err);
  });
  
  redisClient.connect().catch(console.error);
}

// Analytics middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request processed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Store in Redis for processing
    if (redisClient) {
      await redisClient.lPush('contact_requests', JSON.stringify({
        name,
        email,
        message,
        phone,
        timestamp: new Date().toISOString(),
        ip: req.ip
      }));
    }
    
    // Send email
    try {
      await sendContactEmail({ name, email, phone, message });
    } catch (emailError) {
      logger.error('Email sending failed:', emailError);
      // Continue processing even if email fails
    }
    
    // Log the contact request
    logger.info('Contact form submitted', {
      name,
      email,
      hasPhone: !!phone,
      ip: req.ip
    });
    
    res.json({
      success: true,
      message: 'Thank you for your message. I\'ll get back to you within 24 hours.'
    });
    
  } catch (error) {
    logger.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Store subscription
    if (redisClient) {
      await redisClient.hSet('newsletter_subscribers', email, JSON.stringify({
        name,
        email,
        subscribedAt: new Date().toISOString(),
        active: true
      }));
    }
    
    // Send newsletter confirmation email
    try {
      await sendNewsletterConfirmation({ email, name });
    } catch (emailError) {
      logger.error('Newsletter confirmation email failed:', emailError);
      // Continue processing even if email fails
    }
    
    logger.info('Newsletter subscription', { email, name });
    
    res.json({
      success: true,
      message: 'Successfully subscribed to the newsletter!'
    });
    
  } catch (error) {
    logger.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Subscription failed. Please try again.'
    });
  }
});

// Session booking endpoint
app.post('/api/book-session', async (req, res) => {
  try {
    const { name, email, phone, package: packageType, preferredDate, message } = req.body;
    
    if (!name || !email || !packageType) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and package selection are required'
      });
    }
    
    // Store booking request
    if (redisClient) {
      await redisClient.lPush('session_bookings', JSON.stringify({
        name,
        email,
        phone,
        package: packageType,
        preferredDate,
        message,
        timestamp: new Date().toISOString(),
        ip: req.ip
      }));
    }
    
    // Send booking confirmation email
    try {
      await sendBookingConfirmation({ 
        name, 
        email, 
        phone, 
        package: packageType, 
        preferredDate, 
        message 
      });
    } catch (emailError) {
      logger.error('Booking email sending failed:', emailError);
      // Continue processing even if email fails
    }
    
    logger.info('Session booking requested', {
      name,
      email,
      package: packageType,
      hasPreferredDate: !!preferredDate
    });
    
    res.json({
      success: true,
      message: 'Booking request received. I\'ll contact you within 24 hours to confirm.'
    });
    
  } catch (error) {
    logger.error('Session booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Booking failed. Please try again.'
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({
        success: false,
        message: 'Analytics not available'
      });
    }
    
    const contactCount = await redisClient.lLen('contact_requests');
    const newsletterCount = await redisClient.hLen('newsletter_subscribers');
    const bookingCount = await redisClient.lLen('session_bookings');
    
    res.json({
      success: true,
      data: {
        contactRequests: contactCount,
        newsletterSubscribers: newsletterCount,
        sessionBookings: bookingCount
      }
    });
    
  } catch (error) {
    logger.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch analytics'
    });
  }
});

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  if (redisClient) {
    redisClient.quit();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  if (redisClient) {
    redisClient.quit();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app; 