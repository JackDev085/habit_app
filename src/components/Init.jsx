export default function Init() {
  return (
    <div id="topo" className="bg-black text-white min-h-screen">
      {/* HERO */}
      <section
        className="
          relative 
          bg-[url('/hero.png')]
          bg-cover bg-center
          min-h-[100dvh]
          flex flex-col items-center justify-center
          text-center px-4 sm:px-6 py-24
        "
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 relative z-10 leading-tight">
          Otimize sua performance no basquete.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-xl sm:max-w-2xl mb-10 relative z-10">
          Acompanhe sua carga pré e pós-treino com precisão e treine mais inteligente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <a
            href="/home"
            className="
              bg-green-500 text-black 
              px-8 py-3 rounded-xl font-semibold 
              hover:bg-green-400 
              transition w-full sm:w-auto
            "
          >
            Começar agora
          </a>

          <a
            href="#sabermais"
            className="
              border border-green-500 px-8 py-3 
              rounded-xl hover:bg-green-500 hover:text-black
              transition w-full sm:w-auto
            "
          >
            Saber mais
          </a>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="sabermais" className="px-4 sm:px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-12 text-green-500">
          Como funciona
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-400">
              1. Avaliação pré-treino
            </h3>
            <p className="text-neutral-400">
              Registre fadiga, dor muscular, sono, humor e stress antes de começar.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-400">
              2. Avaliação pós-treino
            </h3>
            <p className="text-neutral-400">
              Informe intensidade, duração e percepção de esforço após treinar.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-400">
              3. Dashboard inteligente
            </h3>
            <p className="text-neutral-400">
              Visualize carga interna, evolução semanal e alertas de risco.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="px-4 sm:px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-12 text-green-500">
          Benefícios
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 hover:border-green-500 transition">
            <h3 className="text-xl font-semibold mb-3">🧠 Prevenção de lesões</h3>
            <p className="text-neutral-400">
              Monitore alertas de fadiga e evite treinar acima do limite.
            </p>
          </div>

          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 hover:border-green-500 transition">
            <h3 className="text-xl font-semibold mb-3">📈 Evolução clara</h3>
            <p className="text-neutral-400">
              Acompanhe gráficos semanais e mensais com sua evolução física.
            </p>
          </div>

          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 hover:border-green-500 transition">
            <h3 className="text-xl font-semibold mb-3">🚀 Treinos inteligentes</h3>
            <p className="text-neutral-400">
              Decisões baseadas em dados tornam seus treinos muito mais eficientes.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <a className="text-green-500 underline hover:text-green-400" href="#topo">
            Voltar ao topo
          </a>
        </div>
      </section>
    </div>
  );
}
