@echo off

set pwd=%cd%
call tasks\build-docs\clone %1
cd %pwd%
call tasks\build-docs\docker %1 && tasks\build-docs\push %1
