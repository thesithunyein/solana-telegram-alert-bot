# Solana Telegram Alert Bot

Private Telegram alerts for Solana wallets. Watches addresses via `onLogs`, filters by amount/program, and sends explorer links. Zero infra; runs on your host.

## Env
```
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
MONITORED_ADDRESSES=addr1,addr2
RPC_URL=https://api.mainnet-beta.solana.com
MIN_SOL=0.05
```

## Run
```
node scripts/telegram-wallet-alert.js
```

### Windows auto-start (loads .env)
1) Create `.env` in the repo root:
```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
MONITORED_ADDRESSES=addr1,addr2
RPC_URL=https://api.mainnet-beta.solana.com
MIN_SOL=0.05
```
2) Double-click `start-bot.cmd` (it reads `.env`, runs the bot).
3) Auto-run on boot: put a shortcut to `start-bot.cmd` in `shell:startup`.

## How it works
- Uses `connection.onLogs` to watch the addresses.
- Fetches the transaction, computes SOL balance delta, and sends a Telegram message with explorer link.
- Skips tiny moves under `MIN_SOL` (optional).
- Auto-adjusts explorer link for mainnet/devnet/testnet based on RPC URL.

## Offer (DM copy)
“I’ll deploy a private Solana wallet alert bot for your treasury in 24h. Alerts on swaps/transfers/LP adds over $X. Runs on your infra. Pay only after you see it working. $200 + $20/mo support. Demo ready. DM an address to monitor.”

## Fly.io deployment (free tier)
1) Install Fly CLI: https://fly.io/docs/hands-on/install/
2) Login: `fly auth login`
3) In repo root, set your app name in `fly.toml` (`app = "your-unique-name"`).
4) Set secrets (your env values):
```
fly secrets set TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... MONITORED_ADDRESSES=... RPC_URL=https://api.mainnet-beta.solana.com MIN_SOL=0.05
```
5) Deploy: `fly deploy`
Your bot stays on even when your laptop is off (within free tier limits).
