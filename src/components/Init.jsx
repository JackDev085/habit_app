import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Init() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = "/home";
    }
  }, [user]);

  return (
    <div id="topo" className="bg-[#050505] text-zinc-100 min-h-screen bg-tactical selection:bg-emerald-500 selection:text-black">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden border-b border-zinc-900">
        
        {/* Basketball Court Tactical Line Art (Background Layer) */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center z-0">
          <svg className="w-[1000px] h-[600px] text-emerald-500" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="0.2">
            {/* Court boundary */}
            <rect x="2" y="2" width="96" height="56" />
            {/* Center line & circle */}
            <line x1="50" y1="2" x2="50" y2="58" />
            <circle cx="50" cy="30" r="12" />
            <circle cx="50" cy="30" r="1.5" fill="currentColor" />
            {/* Left key */}
            <rect x="2" y="19" width="19" height="22" />
            <path d="M 21,24 A 6,6 0 0,1 21,36 Z" />
            <circle cx="19" cy="30" r="1.5" fill="currentColor" />
            {/* Right key */}
            <rect x="79" y="19" width="19" height="22" />
            <path d="M 79,24 A 6,6 0 0,0 79,36 Z" />
            <circle cx="81" cy="30" r="1.5" fill="currentColor" />
            {/* Three point lines */}
            <path d="M 2,10 C 25,10 25,50 2,50" />
            <path d="M 98,10 C 75,10 75,50 98,50" />
          </svg>
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-8 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Alta Performance & Saúde
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] uppercase">
            Domine a quadra, <br className="hidden sm:inline"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">controle o esforço.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-12 font-medium">
            Monitore seu desgaste físico, fadiga e bem-estar pré e pós-treino. Evite lesões e potencialize seu desenvolvimento com decisões guiadas por dados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="/home"
              className="bg-emerald-500 text-black px-8 py-4 rounded-xl font-bold hover:bg-emerald-400 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 text-center text-base"
            >
              Começar Agora
            </a>

            <a
              href="#sabermais"
              className="border border-zinc-800 bg-zinc-900/60 backdrop-blur-md text-zinc-300 px-8 py-4 rounded-xl font-semibold hover:border-emerald-500/40 hover:text-white transition-all text-center text-base"
            >
              Saber mais
            </a>
          </div>

        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="sabermais" className="px-6 py-24 max-w-6xl mx-auto relative">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm">Metodologia</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Como funciona o monitoramento
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md font-medium">
            Dividimos a rotina esportiva em etapas claras para coletar indicadores essenciais do seu corpo.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl mb-6 border border-emerald-500/20">
              01
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
              Avaliação Pré-Treino
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Responda rapidamente sobre a qualidade do seu sono, nível de alimentação e dores antes de iniciar as atividades na quadra.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl mb-6 border border-emerald-500/20">
              02
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
              Avaliação Pós-Treino
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Reporte o tipo de treino realizado, nível de fadiga, dores musculares localizadas e a sua Percepção Subjetiva de Esforço (PSE).
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl mb-6 border border-emerald-500/20">
              03
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
              Dashboard Inteligente
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Acompanhe seu histórico de cargas, analise gráficos interativos e identifique momentos de fadiga extrema para planejar descansos.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="px-6 py-24 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm">Alta Performance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Principais Benefícios para o Atleta
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            
            <div className="glass-panel p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500/20 transition-all duration-300">
              <span className="text-3xl mb-4 block">🩺</span>
              <h3 className="text-lg font-bold text-white mb-2">Prevenção de Lesões</h3>
              <p className="text-zinc-400 text-sm">
                Ao registrar dores fortes e fadiga contínua, você previne lesões graves de sobrecarga muscular ou articular.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500/20 transition-all duration-300">
              <span className="text-3xl mb-4 block">📊</span>
              <h3 className="text-lg font-bold text-white mb-2">Histórico de Carga</h3>
              <p className="text-zinc-400 text-sm">
                Visualização clara de volume e intensidade para que sua comissão técnica dose o volume de treinos semanais.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500/20 transition-all duration-300">
              <span className="text-3xl mb-4 block">🏀</span>
              <h3 className="text-lg font-bold text-white mb-2">Treino Planejado</h3>
              <p className="text-zinc-400 text-sm">
                Decisões inteligentes baseadas na sua real condição física melhoram o aproveitamento de cada arremesso e corrida.
              </p>
            </div>

          </div>

          <div className="flex justify-center mt-16">
            <a
              className="text-emerald-400 hover:text-emerald-300 transition font-semibold underline flex items-center gap-1"
              href="#topo"
            >
              Voltar ao topo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </a>
          </div>

        </div>
      </section>
      
    </div>
  );
}
