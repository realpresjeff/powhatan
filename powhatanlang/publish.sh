#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  exit 1
fi

# Add all changes
git add -A

# Commit with the provided message
git commit -m "$1"

# Push to the current branch
git push origin $(git branch --show-current)

# Output success message
echo "Changes have been published!"
