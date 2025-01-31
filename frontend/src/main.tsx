import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { persistor, store } from './store/store.ts'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId =import.meta.env.VITE_GOOGLE_CLIENT_ID 
 
createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientId!}>
      <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <App />
      </StrictMode>
    </PersistGate>

  </Provider>

  </GoogleOAuthProvider>


)
