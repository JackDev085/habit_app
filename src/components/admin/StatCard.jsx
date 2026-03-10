export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 w-full">
      <div className="flex items-center justify-between">
        <p className="text-neutral-400 text-sm uppercase tracking-wide">
          {label}
        </p>
        <span className="text-neutral-400">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-neutral-100 mt-2">{value}</p>
    </div>
  );
}
