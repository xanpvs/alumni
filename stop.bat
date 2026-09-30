@echo off
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Sunucu basariyla kapatildi.
) else (
    echo [INFO] Calisan aktif bir sunucu bulunamadi (zaten kapali).
)
timeout /t 3 >nul
