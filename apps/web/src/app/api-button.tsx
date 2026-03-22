import { useState } from 'react';
import type { HealthStatusDto } from '@org/shared-types';
import styles from './api-button.module.css';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

interface ApiButtonProps {
  /** Label shown on the button */
  label: string;
  /** Base URL of the API to ping, e.g. "http://localhost:3000/api" */
  apiUrl: string;
}

export function ApiButton({ label, apiUrl }: ApiButtonProps) {
  const [state, setState] = useState<FetchState>('idle');
  const [response, setResponse] = useState<string | null>(null);

  async function handleClick() {
    setState('loading');
    setResponse(null);

    try {
      const res = await fetch(`${apiUrl}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: HealthStatusDto = await res.json();
      setResponse(data.message);
      setState('success');
    } catch {
      setResponse('Could not reach the API');
      setState('error');
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.btn} ${styles[state]}`}
        onClick={handleClick}
        disabled={state === 'loading'}
      >
        {state === 'loading' ? 'Calling…' : label}
      </button>

      {response && (
        <p className={`${styles.message} ${styles[state]}`}>{response}</p>
      )}
    </div>
  );
}
