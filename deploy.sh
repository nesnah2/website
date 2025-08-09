#!/bin/bash

# Men's Mentoring Website Deployment Script
# This script optimizes and deploys the website for production

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run optimization
echo "⚡ Running optimization..."
npm run optimize

# Compress images
echo "🖼️  Compressing images..."
npm run compress-images

# Build for production
echo "🔨 Building for production..."
npm run build

# Run Lighthouse audit
echo "📊 Running Lighthouse audit..."
npm run lighthouse

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📈 Performance optimization complete!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Upload files to your hosting provider"
    echo "2. Configure your domain (mikkelhansen.org)"
    echo "3. Set up SSL certificate"
    echo "4. Configure CDN for better performance"
    echo "5. Set up monitoring and analytics"
    echo ""
    echo "🌐 Your optimized website is ready for deployment!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi 