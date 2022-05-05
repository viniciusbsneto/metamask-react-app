import logo from './logo.svg'
import './App.css'
import { useMetamask } from './hooks/use-metamask'

function App() {
  const { connectToMetamask, ethereumWalletAddress } = useMetamask();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Connect to Metamask example!</p>
        <p>
          {ethereumWalletAddress ? <span>Address: {ethereumWalletAddress}</span> : <button type="button" onClick={() => connectToMetamask()}>
            Connect
          </button>}
        </p>
      </header>
    </div>
  )
}

export default App
