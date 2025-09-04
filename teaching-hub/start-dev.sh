#!/bin/bash

# Script per avviare Teaching Hub Development Environment
echo "🚀 Starting Teaching Hub Development Environment..."

# Colori per l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per verificare se un comando esiste
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Docker
echo -e "${BLUE}📦 Checking Docker...${NC}"
if ! command_exists docker; then
    echo -e "${RED}❌ Docker not found. Please install Docker Desktop first.${NC}"
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker not running. Please start Docker Desktop and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check Node.js and npm
echo -e "${BLUE}📦 Checking Node.js and npm...${NC}"
if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm not found. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) and npm $(npm --version) found${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Start Supabase (se disponibile)
echo -e "${BLUE}📀 Checking Supabase...${NC}"
if command_exists supabase; then
    echo -e "${YELLOW}📀 Starting Supabase...${NC}"
    supabase start || echo -e "${YELLOW}⚠️  Supabase not started (will use mock data)${NC}"
else
    echo -e "${YELLOW}⚠️  Supabase CLI not found (will use mock data)${NC}"
fi

# Start Redis (se disponibile)
echo -e "${BLUE}🔴 Checking Redis...${NC}"
REDIS_CONTAINER="teaching-hub-redis"

if docker ps -a --format "table {{.Names}}" | grep -q "^${REDIS_CONTAINER}$"; then
    echo -e "${YELLOW}🔴 Starting existing Redis container...${NC}"
    docker start $REDIS_CONTAINER
else
    echo -e "${YELLOW}🔴 Creating and starting new Redis container...${NC}"
    docker run -d --name $REDIS_CONTAINER -p 6379:6379 redis:alpine
fi

# Verify Redis is running
if docker ps --format "table {{.Names}}" | grep -q "^${REDIS_CONTAINER}$"; then
    echo -e "${GREEN}✅ Redis is running on port 6379${NC}"
else
    echo -e "${YELLOW}⚠️  Redis not running (caching disabled)${NC}"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "public/uploads" ]; then
    echo -e "${BLUE}📁 Creating uploads directory...${NC}"
    mkdir -p public/uploads
    touch public/uploads/.gitkeep
fi

# Check environment file
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Using defaults.${NC}"
    echo -e "   You may need to configure API keys for full functionality."
fi

echo -e "${GREEN}🎉 Environment setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "   • Next.js: Ready"
echo -e "   • Database: $(docker ps --format "table {{.Names}}" | grep -q supabase && echo "Supabase (local)" || echo "Mock data")"
echo -e "   • Redis: $(docker ps --format "table {{.Names}}" | grep -q $REDIS_CONTAINER && echo "Running" || echo "Disabled")"
echo -e "   • File uploads: Local filesystem"
echo ""
echo -e "${GREEN}🌐 Starting Next.js development server...${NC}"
echo -e "   Local:    http://localhost:3000"
echo -e "   Network:  http://$(hostname -I | awk '{print $1}'):3000"
echo ""

# Start Next.js
npm run dev