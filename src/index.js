import style from './main.css';

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App';
import { MoralisProvider } from "react-moralis"
import { ChakraProvider } from '@chakra-ui/react'
import theme from './components/SRTheme'

const appId = "EdHexSHSSul3zTSkNECq5eJQZyl7l5szTupRArw0"
const serverUrl = "https://bdadpk97k92l.usemoralis.com:2053/server"

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
)