#!/bin/bash
# by lcs
# 2020-07-28

echo "⚠️"
echo "⚠️  Deprecated ❗️"
echo "⚠️"

if [ "$1" = "pro" ]; then
  if [ -z "$2" ]; then
    echo "🈲 deploy pro with tag name . usage: ./deploy.sh pro <tag>"
    exit 1
  fi
  tag_name="$2"
  git tag "$tag_name" || exit 1
  git push origin "$tag_name" || exit 1

  exit 0
fi

git push origin || exit 1
