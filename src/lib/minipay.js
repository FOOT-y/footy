export const USDT_TOKEN_ADDRESS = '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e'
export const USDT_DECIMALS = 6

function encodeAddress(address) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) throw new Error('Invalid wallet address.')
  return address.slice(2).toLowerCase().padStart(64, '0')
}

function encodeAmount(amount) {
  if (!/^\d+(\.\d{1,6})?$/.test(amount)) throw new Error('Invalid USDT amount.')
  const [whole, fraction = ''] = amount.split('.')
  return BigInt(`${whole}${fraction.padEnd(USDT_DECIMALS, '0')}`).toString(16).padStart(64, '0')
}

export function getMiniPayProvider() {
  if (typeof window === 'undefined') return undefined
  return window.ethereum
}

export async function getConnectedMiniPayAddress() {
  const provider = getMiniPayProvider()
  if (!provider?.request) return null
  const accounts = await provider.request({ method: 'eth_accounts' })
  return accounts?.[0] || null
}

export async function connectMiniPay() {
  const provider = getMiniPayProvider()
  if (!provider?.request) throw new Error('Open Footy inside MiniPay.')
  const accounts = await provider.request({ method: 'eth_requestAccounts' })
  if (!accounts?.[0]) throw new Error('Wallet connection was rejected.')
  return accounts[0]
}

export async function payForPrediction({ from, treasury, amount }) {
  const provider = getMiniPayProvider()
  if (!provider?.request) throw new Error('Open Footy inside MiniPay.')
  if (!from) throw new Error('Connect your wallet first.')

  const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [{
      from,
      to: USDT_TOKEN_ADDRESS,
      data: `0xa9059cbb${encodeAddress(treasury)}${encodeAmount(amount)}`,
      value: '0x0',
      feeCurrency: USDT_TOKEN_ADDRESS,
    }],
  })

  if (!txHash) throw new Error('MiniPay did not return a transaction hash.')
  return txHash
}
