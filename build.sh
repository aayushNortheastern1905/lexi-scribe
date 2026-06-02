#!/bin/bash
# Rebuilds the extension zip and copies it to the web public folder

rm -f web/public/lexi-scribe-extension.zip

zip -r web/public/lexi-scribe-extension.zip extension/ \
  --exclude "extension/config.js" \
  --exclude "extension/*.DS_Store"

echo "✓ lexi-scribe-extension.zip updated ($(du -sh web/public/lexi-scribe-extension.zip | cut -f1))"
