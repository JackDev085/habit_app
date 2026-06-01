export default function InputAvaliacao({ title, form, handleChange, field }) {
  const isEsforco = field === "pain" || field === "fadigue" || field === "effort";

  return (
    <div className="input-group mb-6">
      <h3 className="text-xs uppercase text-emerald-400 tracking-widest font-bold mb-4">
        {title}
      </h3>

      {field === "workout" ? (
        <div>
          <select
            className="bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-3 rounded-xl w-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200"
            name={field}
            id={field}
            value={form[field]}
            onChange={handleChange}
            required
          >
            <option value="" className="bg-zinc-950">Selecione o tipo de treino...</option>
            <option value="tecnico-tatico" className="bg-zinc-950">Técnico-tático</option>
            <option value="fisico" className="bg-zinc-950">Físico</option>
            <option value="apronto" className="bg-zinc-950">Apronto</option>
          </select>
        </div>
      ) : (
        <>
          {/* INPUTS 1–5 */}
          <div className="flex justify-between max-w-xs mx-auto gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <label key={val} className="flex flex-col items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name={field}
                  value={val}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: field,
                        value: Number(e.target.value),
                      },
                    })
                  }
                  checked={Number(form[field]) === val}
                  required
                  className="
                    w-7 h-7 rounded-full appearance-none border-2 
                    border-zinc-800 bg-zinc-950 checked:border-emerald-500 
                    checked:bg-emerald-500 checked:scale-110 focus:outline-none transition-all cursor-pointer
                  "
                />
                <span className={`text-[10px] font-bold ${Number(form[field]) === val ? "text-emerald-400" : "text-zinc-600"}`}>
                  {val}
                </span>
              </label>
            ))}
          </div>

          {/* GRADIENTE */}
          <div
            className={`
              w-full h-1.5 mt-3 mb-1.5 rounded-full bg-gradient-to-r 
              ${isEsforco ? "from-emerald-500 to-rose-500" : "from-rose-500 to-emerald-500"}
            `}
          />

          {/* LABELS */}
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            {isEsforco ? (
              <>
                <span className="text-emerald-400">Baixo</span>
                <span className="text-rose-400">Alto</span>
              </>
            ) : (
              <>
                <span className="text-rose-400">Ruim</span>
                <span className="text-emerald-400">Bom</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
