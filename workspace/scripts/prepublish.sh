#!/usr/bin/env bash
# Prepublish script: build the TypeScript sources before publishing the package.
set -e

echo "Building TypeScript sources..."
npm run build

echo "Prepublish steps completed."
