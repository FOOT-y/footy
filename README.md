# Footy

A mobile-first MiniPay sports prediction UI inspired by the provided screenshots.

## Run locally

```bash
npm install
npm run dev
```

Open the app inside MiniPay for wallet connection and USDT payment testing.

## Current scope

- React + Vite starter app
- Eight prediction options
- One-selection UI lock after successful payment
- MiniPay wallet connection and silent reconnect
- USDT transfer to the configured treasury wallet
- Transaction hash link to CeloScan

This starter does **not** include a smart contract or backend verification yet. Before accepting real money, add a server that verifies the transaction receipt, token contract, recipient, amount, sender, market ID, and enforces a unique `(market_id, wallet)` record. Never place private keys or API secrets in the frontend.

Configure the payment constants in `src/lib/minipay.js` before using a different network or token. Test with a small amount on the intended Celo network first.
