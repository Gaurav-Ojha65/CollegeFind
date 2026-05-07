// FILE: frontend/pages/_app.js
import { AuthProvider } from '../context/AuthContext';
import { SavedProvider } from '../context/SavedContext';
import { CompareProvider } from '../context/CompareContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SavedProvider>
        <CompareProvider>
          <Component {...pageProps} />
        </CompareProvider>
      </SavedProvider>
    </AuthProvider>
  );
}
