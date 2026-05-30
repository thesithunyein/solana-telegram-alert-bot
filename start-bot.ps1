$env:TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"
$env:TELEGRAM_CHAT_ID = "YOUR_CHAT_ID_HERE"
$env:MONITORED_ADDRESSES = "YOUR_ADDRESSES_HERE"
$env:RPC_URL = "https://api.mainnet-beta.solana.com"
$env:MIN_SOL = "0.05"

cd "C:\Users\sithu\solana-telegram-alert-bot"
node scripts\telegram-wallet-alert.js
