export default function Stepper({ value, onChange, min = 0, max = 99 }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="decrease">–</button>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
          onChange(isNaN(v) ? min : Math.min(max, Math.max(min, v)));
        }}
      />
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="increase">+</button>
    </div>
  );
}
