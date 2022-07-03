@echo off

:start
set "version="
set /p version="Enter your IDE[vs2022]: "
if not defined version (
	set version="vs2022"
)
goto execute

:execute
if exist "vendor\bin\premake\premake5.exe" (
    call vendor\bin\premake\premake5.exe %version%
	goto start
) else (
    echo Premake is not installed in this project
	pause
)