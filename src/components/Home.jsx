import { useState } from "react";
import ModalAvaliacao from "./ModalAvaliacao";
import InstallPWAButton from "./InstallPWAButton";

export default function Home() {
  const hoje = new Date();
  const dia = `${hoje.getDate()}/${hoje.getMonth() + 1}/${hoje.getFullYear()}`;

  const [modalPreOpen, setModalPreOpen] = useState(false);
  const [modalPosOpen, setModalPosOpen] = useState(false);

  return (
    <div className="min-h-[85vh] bg-[#050505] bg-tactical text-white flex flex-col items-center justify-center px-6 py-12 relative">
      <InstallPWAButton />

      {/* Date Header */}
      <div className="text-center mb-12 relative z-10">
        <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Console do Atleta</span>
        <h2 className="font-extrabold text-3xl md:text-4xl mt-1 text-white tracking-tight">
          Hoje é dia <span className="text-emerald-400 underline decoration-emerald-500/30 decoration-wavy">{dia}</span>
        </h2>
        <p className="text-zinc-400 text-sm mt-2 max-w-xs mx-auto">
          Mantenha seus registros atualizados para monitoramento ideal de carga.
        </p>
      </div>

      {/* Options Cards container */}
      <div className="w-full max-w-xl flex flex-col gap-6 relative z-10">
        
        {/* Card Pré-Treino */}
        <div
          role="button"
          tabIndex={0}
          className="w-full p-6 rounded-2xl glass-panel border border-zinc-800 cursor-pointer 
          hover:border-emerald-500/40 hover:bg-zinc-900/60 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 flex items-center gap-5 group"
          onClick={() => setModalPreOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setModalPreOpen(true);
          }}
        >
          {/* Tactical Icon (Clipboard with basketball plays) */}
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all duration-300 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          
          <div className="text-left">
            <h3 className="text-lg uppercase font-bold text-emerald-400 tracking-wider">
              Avaliação Pré-Treino
            </h3>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
              Monitore sono, alimentação e nível de dor inicial antes de entrar em quadra.
            </p>
          </div>
        </div>

        {/* Card Pós-Treino */}
        <div
          role="button"
          tabIndex={0}
          className="w-full p-6 rounded-2xl glass-panel border border-zinc-800 cursor-pointer 
          hover:border-emerald-500/40 hover:bg-zinc-900/60 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 flex items-center gap-5 group"
          onClick={() => setModalPosOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setModalPosOpen(true);
          }}
        >
          {/* Tactical Icon (Basketball Court Play Action) */}
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all duration-300 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="text-left">
            <h3 className="text-lg uppercase font-bold text-emerald-400 tracking-wider">
              Avaliação Pós-Treino
            </h3>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
              Reporte esforço, fadiga, intensidade e mapeamento de dores após o treino.
            </p>
          </div>
        </div>

      </div>

      {/* Modais */}
      <ModalAvaliacao
        isOpen={modalPreOpen}
        onClose={() => setModalPreOpen(false)}
        pos={false}
      />
      <ModalAvaliacao
        isOpen={modalPosOpen}
        onClose={() => setModalPosOpen(false)}
        pos={true}
      />
    </div>
  );
}
