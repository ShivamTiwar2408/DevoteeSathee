#!/bin/bash

# DevoteeSaathi - Deploy Script
# Usage: 
#   ./deploy.sh          - Publish update to EAS (permanent URL)
#   ./deploy.sh dev      - Start local dev server with tunnel
#   ./deploy.sh vm       - Deploy to VM and start tunnel

set -e

APP_NAME="DevoteeSaathi"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

case "${1:-publish}" in
  "publish"|"preview"|"")
    echo -e "${GREEN}🚀 Publishing $APP_NAME to EAS (preview branch)...${NC}"
    
    # Get commit message or use default
    MESSAGE="${2:-Update $(date '+%Y-%m-%d %H:%M')}"
    
    CI=1 eas update --branch preview --message "$MESSAGE"
    
    echo -e "${GREEN}✅ Published to preview!${NC}"
    echo -e "${BLUE}Dashboard: https://expo.dev/accounts/shivamtiwari2408/projects/devoteesathee${NC}"
    echo -e "${BLUE}Testers can access via Expo Go by logging in as shivamtiwari2408${NC}"
    ;;

  "development")
    echo -e "${GREEN}🚀 Publishing $APP_NAME to EAS (development branch)...${NC}"
    
    # Get commit message or use default
    MESSAGE="${2:-Dev Update $(date '+%Y-%m-%d %H:%M')}"
    
    CI=1 eas update --branch development --message "$MESSAGE"
    
    echo -e "${GREEN}✅ Published to development!${NC}"
    echo -e "${BLUE}Dashboard: https://expo.dev/accounts/shivamtiwari2408/projects/devoteesathee${NC}"
    echo -e "${BLUE}Development branch available in Expo Go${NC}"
    ;;
    
  "dev")
    echo -e "${GREEN}🔧 Starting local dev server...${NC}"
    npx expo start --tunnel
    ;;
    
  "vm")
    # VM deployment config
    VM_USER="ubuntu"
    VM_IP="206.1.62.196"
    SSH_KEY="~/.ssh/id_ecdsa"
    REMOTE_DIR="~/$APP_NAME"

    echo -e "${GREEN}🚀 Deploying $APP_NAME to VM...${NC}"

    # Sync code to VM
    echo "📦 Syncing code to VM..."
    rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' \
      -e "ssh -i $SSH_KEY" \
      ./ $VM_USER@$VM_IP:$REMOTE_DIR/

    # SSH and setup
    echo "🔧 Setting up on VM..."
    ssh -i $SSH_KEY $VM_USER@$VM_IP << 'ENDSSH'
      cd ~/DevoteeSaathi
      pkill -f "expo" 2>/dev/null || true
      pkill -f "node.*metro" 2>/dev/null || true
      sleep 2
      npm install
      npx expo start --tunnel
ENDSSH
    ;;
    
  *)
    echo "Usage: ./deploy.sh [command] [message]"
    echo ""
    echo "Commands:"
    echo "  publish      Publish to EAS preview branch (default)"
    echo "  development  Publish to EAS development branch"
    echo "  dev          Start local dev server with tunnel"
    echo "  vm           Deploy to VM and start tunnel"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh                           # Publish to preview branch"
    echo "  ./deploy.sh publish 'Fixed bug'       # Publish to preview with message"
    echo "  ./deploy.sh development 'New feature' # Publish to development branch"
    echo "  ./deploy.sh dev                       # Local development"
    ;;
esac
