hugo -s .
git add -A
git commit -m "updated in $(date +%H:%M-%d/%b/%Y)"
git push -u home master
