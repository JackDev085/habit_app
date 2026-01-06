export default function InputAvaliacao({ title, form, handleChange, field }) {

  const isEsforco = field === "pain" || field === "fadigue" || field === "effort";

  return (
    <div className="input-group mb-6">
      <h3 className="text-md mb-4 uppercase text-green-400 tracking-wide font-semibold">
        {title}
      </h3>

      {field === "workout" ? (
        <div>
          <select
            className="bg-neutral-900 border border-neutral-700 text-white px-4 py-2 rounded-xl w-full focus:outline-none focus:border-green-500"
            name={field}
            id={field}
            value={form[field]}
            onChange={handleChange}
            required
          >
            <option value="">Selecione…</option>
            <option value="tecnico-tatico">Técnico-tático</option>
            <option value="fisico">Físico</option>
            <option value="apronto">Apronto</option>
          </select>
        </div>
      ) : (
        <>
          {/* INPUTS 1–5 */}
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((val) => (
              <label key={val}>
                <input
                  type="radio"
                  name={field}
                  value={val}                // valor como número
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: field,
                        value: Number(e.target.value), // força número
                      },
                    })
                  }
                  checked={Number(form[field]) === val} // compara corretamente
                  required
                  className="
                    w-6 h-6 rounded-full appearance-none border-2 
                    border-neutral-700 bg-neutral-900 checked:border-green-500 
                    checked:bg-green-500 focus:outline-none
                  "
                />
              </label>
            ))}
          </div>

          {/* GRADIENTE */}
          <div
            className={`
              w-full h-2 mt-3 mb-1 rounded-full bg-gradient-to-r 
              ${isEsforco ? "from-green-500 to-red-500" : "from-red-500 to-green-500"}
            `}
          />

          {/* LABELS */}
          <div className="flex justify-between text-xs uppercase tracking-wide">
            {isEsforco ? (
              <>
                <span className="text-green-400">Baixo</span>
                <span className="text-red-400">Alto</span>
              </>
            ) : (
              <>
                <span className="text-red-400">Ruim</span>
                <span className="text-green-400">Bom</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
