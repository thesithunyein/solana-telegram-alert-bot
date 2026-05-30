/**
 * Minimal Telegram wallet alert bot for Solana wallets.
 * Usage:
 * MONITORED_ADDRESSES=addr1,addr2 TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=123 `
 * RPC_URL=https://api.mainnet-beta.solana.com MIN_SOL=0.05 `
 * node scripts/telegram-wallet-alert.js
 */
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const RPC_URL = process.env.RPC_URL || clusterApiUrl("mainnet-beta");
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ADDRESSES = (process.env.MONITORED_ADDRESSES || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const MIN_SOL = parseFloat(process.env.MIN_SOL || "0");

if (!BOT_TOKEN || !CHAT_ID || ADDRESSES.length === 0) {
  console.error(
    "Missing env. Required: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, MONITORED_ADDRESSES (comma-separated). Optional: RPC_URL, MIN_SOL"
  );
  process.exit(1);
}

const explorerSuffix = RPC_URL.includes("devnet")
  ? "?cluster=devnet"
  : RPC_URL.includes("testnet")
    ? "?cluster=testnet"
    : "";

const connection = new Connection(RPC_URL, { commitment: "confirmed" });

async function sendTelegram(message) {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    console.error("Telegram send failed:", res.status, text);
  }
}

async function handleSignature(address, signature, slot, err) {
  try {
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    const keys =
      tx?.transaction?.message?.getAccountKeys?.().staticAccountKeys?.map((k) =>
        k.toBase58()
      );
    const idx = keys?.indexOf(address) ?? -1;

    let deltaSol = null;
    if (
      idx !== -1 &&
      tx?.meta?.preBalances?.[idx] !== undefined &&
      tx?.meta?.postBalances?.[idx] !== undefined
    ) {
      const deltaLamports =
        tx.meta.postBalances[idx] - tx.meta.preBalances[idx];
      deltaSol = deltaLamports / LAMPORTS_PER_SOL;
    }

    if (deltaSol !== null && Math.abs(deltaSol) < MIN_SOL) return; // skip tiny moves

    const direction =
      deltaSol === null ? "activity" : deltaSol > 0 ? "received" : "sent";
    const amount = deltaSol === null ? "" : `${deltaSol.toFixed(6)} SOL`;
    const explorer = `https://explorer.solana.com/tx/${signature}${explorerSuffix}`;

    const text = [
      "🚨 Wallet alert",
      `Address: \`${address}\``,
      `Action: ${direction} ${amount}`,
      `Slot: ${slot}`,
      err ? `Error: ${JSON.stringify(err)}` : null,
      `Tx: ${explorer}`,
    ]
      .filter(Boolean)
      .join("\n");

    await sendTelegram(text);
  } catch (e) {
    console.error("handleSignature error", e);
  }
}

function watchAddress(address) {
  const pk = new PublicKey(address);
  connection.onLogs(pk, (logInfo) => {
    handleSignature(address, logInfo.signature, logInfo.slot, logInfo.err).catch(
      (e) => console.error("onLogs handler error", e)
    );
  });
  console.log(`Watching ${address} via ${RPC_URL}`);
}

ADDRESSES.forEach(watchAddress);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
});

console.log("Telegram wallet alert bot running...");
