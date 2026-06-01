export default function StatCard({ label, value, icon }) {
  return (
    <div className="glass-panel border border-zinc-800 rounded-2xl p-6 w-full flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex flex-col">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
          {label}
        </p>
        <p className="text-4xl font-black text-white mt-2 tracking-tight group-hover:text-emerald-400 transition-colors">
          {value}
        </p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-zinc-950/60 border border-zinc-900 flex items-center justify-center text-xl shrink-0 group-hover:border-emerald-500/30 transition-colors">
        {icon}
      </div>
    </div>
  );
}
