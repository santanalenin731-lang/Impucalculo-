#!/bin/bash

# Configuration
INTERVAL=5  # Check every 5 seconds
PROJECT_DIR="/Users/leninsantanadejesus/Documents/impucalculo-deploy"

# Change to project directory explicitly
cd "$PROJECT_DIR" || { echo "Failed to change directory to $PROJECT_DIR"; exit 1; }

echo "=========================================="
echo "   Auto-Sync GitHub: ACTIVATED"
echo "   Monitoring for changes every $INTERVAL seconds..."
echo "   Press [CTRL+C] to stop."
echo "=========================================="

while true; do
  # Check for changes using git status --porcelain which returns output if there are changes
  if [[ -n $(git status --porcelain) ]]; then
    echo "[$(date '+%H:%M:%S')] Changes detected. Syncing to GitHub..."
    
    # Add all changes
    git add .
    
    # Commit with a timestamp
    git commit -m "Auto-update: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push to the current branch
    git push
    
    if [ $? -eq 0 ]; then
      echo "[$(date '+%H:%M:%S')] ✅ Sync complete."
    else
      echo "[$(date '+%H:%M:%S')] ❌ Sync failed. Checking again in $INTERVAL seconds."
    fi
  fi
  sleep $INTERVAL
done
