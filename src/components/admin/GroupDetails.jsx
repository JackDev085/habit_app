import { useState, useMemo } from "react";
import UserCard from "./UserCard";
import TodayStatusModal from "./TodayStatusModal";

export default function GroupDetails({
  group,
  users,
  evalMap,
  isLoading,
  onOpenUserDash,
  onOpenMembers,
  filterMonths,
  onFilterChange,
}) {
  const [sortBy, setSortBy] = useState("name");
  const [todayStatusOpen, setTodayStatusOpen] = useState(false);

  // Sorting logic based on selected filter
  const sortedUsers = useMemo(() => {
    const list = [...(users ?? [])];

    list.sort((a, b) => {
      const evalA = evalMap.get(a.username) || evalMap.get(a.id) || null;
      const evalB = evalMap.get(b.username) || evalMap.get(b.id) || null;

      // Extract metrics for user A
      const preA = evalA?.pre ?? {};
      const posA = evalA?.pos ?? {};
      const sleepA = Number(preA.sleep ?? 0);
      const foodA = Number(preA.food ?? 0);
      const painPreA = Number(preA.pain ?? 0);
      const painPosA = Number(posA.pain_pos ?? 0);
      const fadigueA = Number(posA.fadigue ?? 0);
      const effortA = Number(posA.effort ?? 0);

      const severePainCountA = evalA?.muscle_in_risk
        ? evalA.muscle_in_risk.length
        : 0;

      // Extract metrics for user B
      const preB = evalB?.pre ?? {};
      const posB = evalB?.pos ?? {};
      const sleepB = Number(preB.sleep ?? 0);
      const foodB = Number(preB.food ?? 0);
      const painPreB = Number(preB.pain ?? 0);
      const painPosB = Number(posB.pain_pos ?? 0);
      const fadigueB = Number(posB.fadigue ?? 0);
      const effortB = Number(posB.effort ?? 0);

      const severePainCountB = evalB?.muscle_in_risk
        ? evalB.muscle_in_risk.length
        : 0;

      // Global wellness score calculation (Higher is better)
      // Normalizing inverted variables (pain/fatigue/effort): 6 - value
      const scoreA = (
        (sleepA || 3) +
        (foodA || 3) +
        (6 - (painPreA || 3)) +
        (6 - (painPosA || 3)) +
        (6 - (fadigueA || 3)) +
        (6 - (effortA || 3))
      ) / 6;

      const scoreB = (
        (sleepB || 3) +
        (foodB || 3) +
        (6 - (painPreB || 3)) +
        (6 - (painPosB || 3)) +
        (6 - (fadigueB || 3)) +
        (6 - (effortB || 3))
      ) / 6;

      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "lesao") {
        // High risk: more severe pains first, then higher pain averages
        if (severePainCountA !== severePainCountB) {
          return severePainCountB - severePainCountA;
        }
        const maxPainA = Math.max(painPreA, painPosA);
        const maxPainB = Math.max(painPreB, painPosB);
        return maxPainB - maxPainA;
      }
      if (sortBy === "melhores") {
        // Highest wellness scores first
        return scoreB - scoreA;
      }
      if (sortBy === "sono") {
        // Worst sleep first (if 0 or invalid, push to the end)
        if (sleepA === 0) return 1;
        if (sleepB === 0) return -1;
        return sleepA - sleepB;
      }
      if (sortBy === "nutricao") {
        // Worst nutrition first
        if (foodA === 0) return 1;
        if (foodB === 0) return -1;
        return foodA - foodB;
      }
      if (sortBy === "dor") {
        // Highest pain first
        return Math.max(painPreB, painPosB) - Math.max(painPreA, painPosA);
      }
      if (sortBy === "fadiga") {
        // Highest fatigue first
        return fadigueB - fadigueA;
      }
      if (sortBy === "esforco") {
        // Highest physical effort first
        return effortB - effortA;
      }

      return 0;
    });

    return list;
  }, [users, evalMap, sortBy]);

  if (!group) {
    return (
      <div className="glass-panel border border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-zinc-500 font-medium">
          Selecione um grupo na lista lateral para visualizar atletas e cargas de treino.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-6">
        <div>
          <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Grupo Selecionado</span>
          <h2 className="text-2xl font-black text-white mt-0.5">
            {group.name}
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">ID: {group.id}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1 min-w-[130px]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Período</span>
            <select
              value={filterMonths}
              onChange={(e) => onFilterChange(Number(e.target.value))}
              className="bg-zinc-950 text-zinc-200 border border-zinc-800 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value={1}>1 Mês (Padrão)</option>
              <option value={2}>2 Meses</option>
              <option value={3}>3 Meses</option>
              <option value={4}>4 Meses</option>
              <option value={5}>5 Meses</option>
              <option value={0}>Todo o período</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 min-w-[150px]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Ordenar Por</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-950 text-zinc-200 border border-zinc-800 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="name">Nome (A-Z)</option>
              <option value="lesao">Risco de Lesão</option>
              <option value="melhores">Melhores Métricas</option>
              <option value="sono">Pior Sono</option>
              <option value="dor">Maior Dor Geral</option>
              <option value="nutricao">Pior Nutrição</option>
              <option value="fadiga">Maior Fadiga</option>
              <option value="esforco">Maior Esforço</option>
            </select>
          </div>

          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={() => setTodayStatusOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-emerald-500/10"
            >
              Envios de Hoje
            </button>

            <button
              type="button"
              onClick={onOpenMembers}
              className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-900 text-zinc-300 hover:text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all duration-200"
            >
              Gerenciar Atletas
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <img src="/spin.svg" className="w-10 h-10 animate-spin invert opacity-60" alt="loading" />
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Carregando detalhes...</span>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sortedUsers.map((u) => {
            const evaluation =
              evalMap.get(u.username) ||
              evalMap.get(u.id) ||
              evalMap.get(u.usuario) ||
              null;

            return (
              <UserCard
                key={u.id ?? u.username}
                user={u}
                evaluation={evaluation}
                onOpenDash={() => onOpenUserDash(u)}
              />
            );
          })}

          {sortedUsers.length === 0 && (
            <div className="text-zinc-500 text-sm text-center py-12 sm:col-span-2 bg-zinc-950/40 border border-dashed border-zinc-800 rounded-2xl">
              Nenhum atleta vinculado a este grupo.
            </div>
          )}
        </div>
      )}

      <TodayStatusModal
        open={todayStatusOpen}
        onClose={() => setTodayStatusOpen(false)}
        groupId={group.id}
        groupName={group.name}
      />
    </div>
  );
}
