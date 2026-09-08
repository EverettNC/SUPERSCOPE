@echo off
setlocal EnableDelayedExpansion
set HERE=%~dp0
set WAV=
if exist "%HERE%incoming\cletus.wav" set WAV=%HERE%incoming\cletus.wav
if exist "%HERE%cletus.wav" set WAV=%HERE%cletus.wav
if exist "%USERPROFILE%\Downloads\cletus.wav" set WAV=%USERPROFILE%\Downloads\cletus.wav
if exist "%USERPROFILE%\Downloads\CLETUS.wav" set WAV=%USERPROFILE%\Downloads\CLETUS.wav
if exist "%USERPROFILE%\Downloads\incoming\cletus.wav" set WAV=%USERPROFILE%\Downloads\incoming\cletus.wav
for %%F in ("%USERPROFILE%\Downloads\*cletus*.wav") do if exist "%%F" set WAV=%%F
for %%F in ("%USERPROFILE%\Downloads\*Cletus*.wav") do if exist "%%F" set WAV=%%F

if "%WAV%"=="" (
  echo Cletus wav not next to this file and not in Downloads.
  pause
  exit /b 1
)

set DEST=
if exist "%HERE%Voice_registry.py" set DEST=%HERE%
if exist "%USERPROFILE%\Voice_Creation_Center\Voice_registry.py" set DEST=%USERPROFILE%\Voice_Creation_Center
if exist "%USERPROFILE%\Documents\Voice_Creation_Center\Voice_registry.py" set DEST=%USERPROFILE%\Documents\Voice_Creation_Center
if exist "%USERPROFILE%\Desktop\Voice_Creation_Center\Voice_registry.py" set DEST=%USERPROFILE%\Desktop\Voice_Creation_Center

if "%DEST%"=="" set DEST=%HERE%

mkdir "%DEST%\incoming" 2>nul
mkdir "%DEST%\packs\cletus" 2>nul
copy /Y "%WAV%" "%DEST%\incoming\cletus.wav" >nul
copy /Y "%WAV%" "%DEST%\packs\cletus\reference.wav" >nul
echo SEATED
echo %DEST%\incoming\cletus.wav
echo Voice Creation Center has Cletus.
pause
exit /b 0
