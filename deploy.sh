#!/bin/bash

# DevoteeSathee - Deploy to VM Script
# Usage: ./deploy.sh

set -e

# Configuration
VM_USER="ubuntu"
VM_IP="206.1.62.196"
SSH_KEY="~/.ssh/id_ecdsa"
APP_NAME="DevoteeSathee"
REMOTE_DIR="~/$APP_NAME"

echo "🚀 Deploying $APP_NAME to VM..."

# Step 1: Sync code to VM (excluding node_modules)
echo "📦 Syncing code to VM..."
rsync -avz --exclude 'node_modules' --exclude '.git' \
  -e "ssh -i $SSH_KEY" \
  ./ $VM_USER@$VM_IP:$REMOTE_DIR/

# Step 2: SSH into VM and run commands
echo "🔧 Setting up on VM..."
ssh -i $SSH_KEY $VM_USER@$VM_IP << 'ENDSSH'
  cd ~/DevoteeSathee

  # Kill any existing Expo processes
  echo "🛑 Stopping existing Expo processes..."
  pkill -f "expo" 2>/dev/null || true
  pkill -f "node.*metro" 2>/dev/null || true
  
  # Wait a moment for ports to free up
  sleep 2

  # Install dependencies
  echo "📥 Installing dependencies..."
  npm install

  # Start Expo with tunnel
  echo "🌐 Starting Expo with tunnel..."
  npx expo start --tunnel
ENDSSH
