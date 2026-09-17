import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import {
  connectMiniPay,
  getConnectedMiniPayAddress,
  payForPrediction,
} from './lib/minipay'

const TREASURY_ADDRESS = '0x67A2FB118863dB99B026c711e05D1799737c936D'
const ENTRY_AMOUNT = '0.01'

const match = {
  id: 'betis-rayo-2025-09-15',
  home: 'Real Betis',
  away: 'Rayo Vallecano',
  kickoff: 'Sep 15, 07:31 PM',
  question: 'Who will score first?',
  options: ['Vitor Roque', 'Giovani Lo Celso', 'Abde Ezzalzouli', 'Pablo Fornals', 'Jorge de Frutos', 'Álvaro García', 'Sergio Camello', 'No goal'],
}

function shorten(address) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''
}

function App() {
  const [wallet, setWallet] = useState('')
  const [selected, setSelected] = useState(null)
  const [paid, setPaid] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getConnectedMiniPayAddress().then((address) => address && setWallet(address))
  }, [])

  async function handleConnect() {
    try {
      setWallet(await connectMiniPay())
      setMessage('Wallet connected.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function handlePrediction() {
    if (!wallet) return setMessage('Connect MiniPay first.')
    if (selected === null) return setMessage('Choose one option first.')
    if (paid) return setMessage('You already submitted a prediction for this match.')

    try {
      setLoading(true)
      setMessage('Confirm the USDT payment in MiniPay…')
      const hash = await payForPrediction({
        from: wallet,
        treasury: TREASURY_ADDRESS,
        amount: ENTRY_AMOUNT,
      })
      setTxHash(hash)
      setPaid(true)
      setMessage('Payment submitted. Your prediction is pending verification.')
    } catch (error) {
      setMessage(error.message || 'Payment was not completed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app">
      <header className="browser-bar">
        <span className="time">4:06 PM</span>
        <span className="browser-icons">◔ ◌ ▮▮▮ 31</span>
      </header>

      <section className="topbar">
        <div className="brand"><span className="brand-mark">F</span><strong>foot<span>.</span></strong></div>
        <button className="wallet-button" onClick={handleConnect}>
          <span className="wallet-icon">▣</span>{wallet ? shorten(wallet) : 'Connect wallet'}
        </button>
      </section>

      <section className="hero">
        <p className="eyebrow">● Live prediction room</p>
        <h1>Read the match.<br /><em>Back your call.</em></h1>
        <p className="intro">One question, one entry, one record.<br />No noise between you and kick-off.</p>
      </section>

      <section className="match-card">
        <div className="match-status"><span>OPEN FOR PICKS</span><span>◷ 01:24:20</span></div>
        <div className="teams"><div><small>HOME</small><b>Real<br />Betis</b></div><strong className="versus">vs</strong><div className="away"><small>AWAY</small><b>Rayo<br />Vallecano</b></div></div>
        <div className="match-meta">Kick-off <strong>{match.kickoff}</strong><br />0 players in room <i>●</i></div>
      </section>

      <section className="info-card"><div className="card-label">PRIZE POOL <span>✣</span></div><div className="amount">0.00 <small>USDT</small></div><div className="progress"><i /></div><div className="card-footer"><span>0 entries</span><span>50% to winners</span></div></section>
      <section className="info-card entry"><div className="card-label">ENTRY <span>▣</span></div><div className="amount">{ENTRY_AMOUNT} <small>USDT</small></div><p>One verified token transfer secures one prediction.</p></section>

      <section className="question-card">
        <div className="question-label">THE QUESTION <span>?</span></div>
        <h2>{match.question}</h2>
        <div className="options">{match.options.map((option, index) => <button key={option} disabled={paid} className={`option ${selected === index ? 'chosen' : ''}`} onClick={() => setSelected(index)}><span className="avatar">{option[0]}</span><span className="option-copy"><strong>{option}</strong><small>{selected === index ? 'Your selection' : '0 picks in the pool'}</small></span><span className="radio" /></button>)}</div>
        <button className="submit" disabled={loading || paid} onClick={handlePrediction}>{loading ? 'Waiting for MiniPay…' : paid ? 'Prediction submitted' : `Stake ${ENTRY_AMOUNT} USDT`}</button>
        {message && <p className="message">{message}</p>}
        {txHash && <a className="tx" href={`https://celoscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">View transaction ↗</a>}
      </section>

      <nav className="bottom-nav"><div className="active">♜<span>Live match</span></div><div>◉<span>My predictions</span></div></nav>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
