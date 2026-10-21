export default function Buttons({ cantidad, max, onChange }) {
  const disminuir = () => onChange(Math.max(1, cantidad - 1))
  const aumentar = () => onChange(Math.min(max, cantidad + 1))

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={disminuir}
        disabled={cantidad <= 1}
        aria-label="Restar unidad"
        className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-sky-300 border border-slate-700 rounded-lg w-8 h-8 font-bold disabled:opacity-30 transition-all flex items-center justify-center cursor-pointer"
      >
        -
      </button>
      <span className="bg-slate-900 text-sky-100 border border-slate-700 rounded-lg px-3 py-1 text-center font-mono font-semibold w-12 text-sm select-none">
        {cantidad}
      </span>
      <button
        type="button"
        onClick={aumentar}
        disabled={cantidad >= max}
        aria-label="Sumar unidad"
        className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-sky-300 border border-slate-700 rounded-lg w-8 h-8 font-bold disabled:opacity-30 transition-all flex items-center justify-center cursor-pointer"
      >
        +
      </button>
    </div>
  )
}