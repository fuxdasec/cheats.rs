#!/bin/bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
FOLDER_PREP="$PROJECT_ROOT/public"
FOLDER_DIST="$PROJECT_ROOT/public.clean"

cd "$PROJECT_ROOT"
rm -rf "$FOLDER_DIST"

# Keep CSS and JavaScript shared across every route. PostHTML optimizes the HTML
# in place, and the complete Zola output is then packaged recursively.
npm run posthtml
cp -a "$FOLDER_PREP" "$FOLDER_DIST"
