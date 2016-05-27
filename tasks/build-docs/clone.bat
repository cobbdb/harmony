@echo off

echo.
echo :::: Cloning documentation branch...
git clone git@github.com:cobbdb/harmony.git docs-clone
cd docs-clone
git checkout gh-pages
