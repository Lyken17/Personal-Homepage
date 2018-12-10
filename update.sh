hugo -s .
rm -rf docs/post/
rm -rf docs/publication/
rm -rf docs/project/
git add -A
git commit -m "updated in $(date +%H:%M-%d/%b/%Y)"
git push -u origin master
