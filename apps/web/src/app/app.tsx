import NxWelcome from './nx-welcome';
import { ApiButton } from './api-button';
import styles from './app.module.css';

const API_URL       = import.meta.env['VITE_API_URL']       ?? 'http://localhost:3000/api';
const ADMIN_API_URL = import.meta.env['VITE_ADMIN_API_URL'] ?? 'http://localhost:3001/api';

export function App() {
  return (
    <div>
      <NxWelcome title="web app" />

      <section className={styles.apiSection}>
        <ApiButton label="Ping API"       apiUrl={API_URL} />
        <ApiButton label="Ping Admin API" apiUrl={ADMIN_API_URL} />
      </section>
    </div>
  );
}

export default App;
