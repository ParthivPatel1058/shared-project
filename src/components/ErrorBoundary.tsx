import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors so a single bad component cannot blank the app.
 *
 * Without this, any thrown error in any child unmounts the entire React tree
 * and the farmer is left on a white screen with no way back — the worst
 * possible failure on a phone in a field, and the one most likely to happen
 * in front of a judge.
 *
 * A class component because error boundaries have no hooks equivalent.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Kept to console rather than swallowed: without a report the only trace
    // of a production crash is the user saying "it stopped working".
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-500" />

          {/* Deliberately bilingual without the language context: the provider
              itself may be what failed. */}
          <h1 className="mb-2 text-xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="mb-1 text-muted-foreground">कुछ गड़बड़ हो गई</p>
          <p className="mb-6 mt-3 text-sm text-muted-foreground">
            The screen could not load. Your saved data is safe.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={() => this.setState({ error: null })}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Try again / फिर कोशिश करें
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 font-semibold text-foreground"
            >
              <Home className="h-4 w-4" />
              Home / होम
            </button>
          </div>

          {import.meta.env.DEV && (
            <pre className="mt-6 max-h-48 overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
              {error.stack ?? error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
