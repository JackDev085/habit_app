import React from "react";
import { logError, getLogs } from "../utils/logger";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logError("ReactErrorBoundary", error, { componentStack: errorInfo?.componentStack });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const logs = getLogs();
      const currentError = this.state.error;

      return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-xl font-extrabold tracking-wide uppercase text-white">
                Algo deu errado
              </h1>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed">
              Ocorreu uma falha ao carregar a interface. Você pode tentar recarregar a página ou limpar os dados locais.
            </p>

            {currentError && (
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 text-xs font-mono text-rose-300 break-words overflow-x-auto">
                {currentError.message || String(currentError)}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-wider text-sm transition"
              >
                Recarregar Aplicativo
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase tracking-wider text-xs transition"
              >
                Limpar Dados Locais & Reiniciar
              </button>

              <button
                onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline text-center pt-2"
              >
                {this.state.showDetails ? "Ocultar Logs Técnicos" : "Ver Logs de Diagnóstico"}
              </button>
            </div>

            {this.state.showDetails && (
              <div className="mt-4 pt-4 border-t border-zinc-800 text-xs font-mono text-zinc-400 space-y-3 max-h-60 overflow-y-auto">
                <div className="font-bold text-zinc-300">Histórico de Erros Recentes:</div>
                {logs.length === 0 ? (
                  <p className="text-zinc-500 italic">Nenhum log gravado.</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="p-2 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                      <div className="text-emerald-400 text-[10px]">[{log.timestamp}] {log.source}</div>
                      <div className="text-rose-300">{log.message}</div>
                      {log.stack && <pre className="text-[10px] text-zinc-500 overflow-x-auto">{log.stack}</pre>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
