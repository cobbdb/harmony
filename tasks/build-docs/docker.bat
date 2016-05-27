@echo off

echo.
echo :::: Purging existing documentation...
del docs-clone\* /q
rd docs-clone\actions /s /q
del docs-clone\%1\* /q
rd docs-clone\%1\actions /s /q

echo.
echo :::: Building new documentation...
docker -i src -o docs-clone\%1 && copy docs-clone\%1\harmony.js.html docs-clone\%1\index.html
