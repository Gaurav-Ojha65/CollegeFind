// FILE: frontend/pages/_app.js
import { CompareProvider } from '../context/CompareContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <CompareProvider>
      <Component {...pageProps} />
    </CompareProvider>
  );
}
