#!/bin/bash

# Professional Deployment Script for Men's Mentoring Website
# Usage: ./deploy.sh [environment] [method]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
DEPLOY_METHOD=${2:-docker}
DOMAIN=${DOMAIN_NAME:-localhost}
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18 or higher is required"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        error ".env file not found. Please copy env.example to .env and configure it"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Backup current deployment
backup_current() {
    log "Creating backup of current deployment..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup current files
    if [ -d "dist" ]; then
        cp -r dist "$BACKUP_DIR/"
    fi
    
    if [ -d "logs" ]; then
        cp -r logs "$BACKUP_DIR/"
    fi
    
    # Backup package files
    cp package*.json "$BACKUP_DIR/"
    
    success "Backup created at $BACKUP_DIR"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm install
    
    success "Dependencies installed"
}

# Build application
build_application() {
    log "Building application..."
    
    # Clean previous build
    rm -rf dist
    
    # Build for production
    npm run build
    
    # Optimize assets
    npm run optimize
    
    success "Application built successfully"
}

# Deploy with Docker
deploy_docker() {
    log "Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Build and start services
    docker-compose up -d --build
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        success "Docker deployment successful"
    else
        error "Health check failed"
        exit 1
    fi
}

# Deploy with PM2
deploy_pm2() {
    log "Deploying with PM2..."
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        log "Installing PM2..."
        npm install -g pm2
    fi
    
    # Stop existing process
    pm2 stop mens-mentoring 2>/dev/null || true
    pm2 delete mens-mentoring 2>/dev/null || true
    
    # Start with PM2
    pm2 start server.js --name "mens-mentoring" --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup 2>/dev/null || true
    
    success "PM2 deployment successful"
}

# Deploy with traditional method
deploy_traditional() {
    log "Deploying with traditional method..."
    
    # Set environment
    export NODE_ENV=production
    
    # Start the application
    nohup npm start > logs/app.log 2>&1 &
    
    # Save PID
    echo $! > .pid
    
    # Wait for startup
    sleep 10
    
    # Check if process is running
    if kill -0 $(cat .pid) 2>/dev/null; then
        success "Traditional deployment successful"
    else
        error "Application failed to start"
        exit 1
    fi
}

# Run tests
run_tests() {
    log "Running tests..."
    
    if npm test; then
        success "Tests passed"
    else
        error "Tests failed"
        exit 1
    fi
}

# Security check
security_check() {
    log "Running security checks..."
    
    # Check for vulnerabilities
    if npm audit --audit-level moderate; then
        success "Security audit passed"
    else
        warning "Security vulnerabilities found. Consider running 'npm audit fix'"
    fi
}

# Performance check
performance_check() {
    log "Running performance checks..."
    
    # Check bundle size
    if [ -f "dist/asset-manifest.json" ]; then
        log "Bundle size analysis:"
        ls -lh dist/js/ dist/css/ 2>/dev/null || true
    fi
    
    # Check load time
    if command -v curl &> /dev/null; then
        START_TIME=$(date +%s%N)
        curl -s http://localhost:3000/api/health > /dev/null
        END_TIME=$(date +%s%N)
        LOAD_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
        log "API response time: ${LOAD_TIME}ms"
    fi
}

# SSL setup (for production)
setup_ssl() {
    if [ "$ENVIRONMENT" = "production" ] && [ "$DOMAIN" != "localhost" ]; then
        log "Setting up SSL certificates..."
        
        # Check if certbot is available
        if command -v certbot &> /dev/null; then
            certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos --email "$CERTBOT_EMAIL"
            success "SSL certificate obtained"
        else
            warning "Certbot not found. SSL setup skipped"
        fi
    fi
}

# Main deployment function
main() {
    log "Starting deployment for environment: $ENVIRONMENT"
    log "Deployment method: $DEPLOY_METHOD"
    
    # Pre-deployment checks
    check_prerequisites
    backup_current
    run_tests
    security_check
    
    # Build and deploy
    install_dependencies
    build_application
    
    case $DEPLOY_METHOD in
        "docker")
            deploy_docker
            ;;
        "pm2")
            deploy_pm2
            ;;
        "traditional")
            deploy_traditional
            ;;
        *)
            error "Unknown deployment method: $DEPLOY_METHOD"
            error "Available methods: docker, pm2, traditional"
            exit 1
            ;;
    esac
    
    # Post-deployment checks
    performance_check
    setup_ssl
    
    success "Deployment completed successfully!"
    log "Application is running at: http://$DOMAIN"
}

# Rollback function
rollback() {
    log "Rolling back to previous deployment..."
    
    if [ -d "$BACKUP_DIR" ]; then
        # Stop current deployment
        case $DEPLOY_METHOD in
            "docker")
                docker-compose down
                ;;
            "pm2")
                pm2 stop mens-mentoring
                ;;
            "traditional")
                if [ -f .pid ]; then
                    kill $(cat .pid) 2>/dev/null || true
                    rm .pid
                fi
                ;;
        esac
        
        # Restore from backup
        cp -r "$BACKUP_DIR"/* .
        
        # Restart deployment
        main
        
        success "Rollback completed"
    else
        error "No backup found for rollback"
        exit 1
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [environment] [method]"
    echo ""
    echo "Environments:"
    echo "  production  - Production deployment (default)"
    echo "  staging     - Staging deployment"
    echo "  development - Development deployment"
    echo ""
    echo "Methods:"
    echo "  docker      - Deploy with Docker Compose (default)"
    echo "  pm2         - Deploy with PM2"
    echo "  traditional - Deploy with traditional method"
    echo ""
    echo "Examples:"
    echo "  $0                    # Production with Docker"
    echo "  $0 production docker  # Production with Docker"
    echo "  $0 staging pm2        # Staging with PM2"
    echo "  $0 rollback           # Rollback to previous deployment"
}

# Handle command line arguments
case "${1:-}" in
    "rollback")
        rollback
        ;;
    "help"|"-h"|"--help")
        usage
        ;;
    *)
        main
        ;;
esac 