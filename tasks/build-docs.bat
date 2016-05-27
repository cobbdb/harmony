@echo off

set pwd=%cd%
call tasks\build-docs\clone
cd %pwd%
call tasks\build-docs\docker && tasks\build-docs\push
