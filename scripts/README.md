# Solana Telegram Alert Bot

Private Telegram alerts when monitored Solana addresses appear in a transaction. Runs on your infra; no extra dependencies beyond @solana/web3.js.

## Env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
MONITORED_ADDRESSES=addr1,addr2
RPC_URL=https://api.mainnet-beta.solana.com
MIN_SOL=0.05

## Run
node scripts/telegram-wallet-alert.js

## How it works
- Uses connection.onLogs to watch the addresses.
- Fetches the transaction, computes SOL balance delta, and sends a Telegram message with explorer link.
- Skips tiny moves under MIN_SOL (optional).
- Auto-adjusts explorer link for mainnet/devnet/testnet based on RPC URL.

## Offer (DM copy)
“I’ll deploy a private Solana wallet alert bot for your treasury in 24h. Alerts on swaps/transfers/LP adds over $X. Runs on your infra. Pay only after you see it working. $200 + $20/mo support. Demo ready. DM an address to monitor.”
