@echo off
echo Starting Solana Telegram Alert Bot...

REM Load env vars from .env (key=value per line)
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    set "%%a=%%b"
)

cd /d "C:\Users\sithu\solana-telegram-alert-bot"
node scripts\telegram-wallet-alert.js
pause
