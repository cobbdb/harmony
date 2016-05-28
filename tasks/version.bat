@echo off

:: version.bat <version> "<commit msg>"
:: Assumes package.json version has already been bumped.

if [%1]==[] (
    echo.
    echo :::: ^(FATAL^) Missing version.
    echo :::: version.bat <version> "<commit msg>"
    goto:eof
)
if [%2]==[] (
    echo.
    echo :::: ^(FATAL^) Missing git commit message.
    echo :::: version.bat <version> "<commit msg>"
    goto:eof
)

echo.
echo :::: Creating version %1...

call grunt
call grunt docs

call git add -A
call git commit -am %2
call git tag %1
call git push origin master --tags
call npm publish
