@echo off

echo.
echo :::: Commiting changes...
cd docs-clone
git add -A
git commit -am "Built %DATE:~-4%-%DATE:~4,2%-%DATE:~7,2%-%TIME%"
git push origin gh-pages
