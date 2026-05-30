# Solana Telegram Alert Bot

Private Telegram alerts for Solana wallets. Watches addresses via `onLogs`, filters by amount, and sends explorer links. Zero infra: runs on your machine (or Docker/VPS if you want).

## Features
- Real-time `onLogs` monitoring for any wallet(s)
- Balance delta + direction, explorer link, cluster-aware (mainnet/devnet/testnet)
- `MIN_SOL` threshold to ignore dust
- Windows one-click runner + autostart, Dockerfile for VPS

## Env
Create `.env` in the repo root:
```
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
MONITORED_ADDRESSES=addr1,addr2
RPC_URL=https://api.mainnet-beta.solana.com
MIN_SOL=0.05
```

## Run (Windows)
Double-click `start-bot.cmd` (loads `.env`). Keep the window open.

Autostart: `Win + R` → `shell:startup` → add shortcut to `start-bot.cmd`. Set Windows sleep to “Never” while plugged in.

Manual (PowerShell):
```
$env:TELEGRAM_BOT_TOKEN="..."
$env:TELEGRAM_CHAT_ID="..."
$env:MONITORED_ADDRESSES="addr1,addr2"
$env:RPC_URL="https://api.mainnet-beta.solana.com"
$env:MIN_SOL="0.05"
node scripts/telegram-wallet-alert.js
```

## Test
- Send any tx to/from a monitored address (devnet faucet for tests or small mainnet transfer).
- You should see a Telegram alert with direction, amount, slot/pending, and explorer link.

## How it works
- Uses `connection.onLogs` per address, fetches the tx, computes SOL delta, and sends Telegram with explorer link.
- Skips moves under `MIN_SOL`.
- Auto-adjusts explorer URL for mainnet/devnet/testnet.

## Sales DM (copy/paste)
“I’ll deploy a private Solana wallet alert bot for your treasury in 24h. Alerts on swaps/transfers/LP adds over $X. Runs on your infra. Pay only after you see it working. $200 + $20/mo support. Demo ready. DM an address to monitor.”

