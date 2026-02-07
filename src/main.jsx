import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { I18nProvider } from './i18n.jsx'
import './index.css'
import App from './App.jsx'

registerSW({
  onNeedRefresh() {
    window.location.reload()
  },
  onOfflineReady() {},
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
