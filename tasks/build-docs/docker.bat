@echo off

echo.
echo :::: Purging existing documentation...
del docs-clone\* /q
rd docs-clone\actions /s /q

echo.
echo :::: Building new documentation...
docker -i src -o docs-clone && copy docs-clone\harmony.js.html docs-clone\index.html
