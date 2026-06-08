// Per-item cost configuration page
function CostSettings({ items, rates, onItem, onRate, onReset }) {
  const C = window.CATALOG;
  const { fmt, BRAND_DOT } = window.ClinicApp;
  const ids = Object.keys(C.items);

  const NumCell = ({ value, onChange }) => (
    <div className="cost-input">
      <span className="ci-prefix">HK$</span>
      <input
        type="text"
        value={value.toLocaleString("en-US")}
        onChange={(e) => {
          const v = parseInt(e.target.value.replace(/[^\d]/g, ""), 10);
          onChange(isNaN(v) ? 0 : v);
        }}
      />
    </div>
  );

  return (
    <div className="cost-page">
      <div className="cost-head">
        <div>
          <div className="ref-kicker">Cost settings</div>
          <h2 className="cost-title">Per-item cost configuration</h2>
          <p className="cost-intro">Set the unit material and installation cost for every catalogue item. Changes flow
          through every facility package, branch estimate and the exported Bill of Materials in real time.</p>
        </div>
        <button className="cost-reset" onClick={onReset}>Reset to defaults</button>
      </div>

      <div className="cost-table">
        <div className="ct-head">
          <div>Catalogue item</div>
          <div>Brand</div>
          <div className="r">Material / unit</div>
          <div className="r">Installation / unit</div>
          <div className="r">Unit total</div>
        </div>
        {ids.map((id) => {
          const def = C.items[id];
          const it = items[id];
          const changed = it.material !== def.material || it.install !== def.install;
          return (
            <div className={"ct-row" + (changed ? " changed" : "")} key={id}>
              <div className="ct-item">
                <div className="ct-name">
                  <span className="brand-dot" style={{ background: BRAND_DOT[def.brand] || "#94a3b8" }} />
                  {def.name}
                  {changed && <span className="ct-flag">edited</span>}
                </div>
                <div className="ct-note">{def.note} · per {def.unit}</div>
              </div>
              <div className="ct-brand">{def.brand}</div>
              <div className="r"><NumCell value={it.material} onChange={(v) => onItem(id, "material", v)} /></div>
              <div className="r"><NumCell value={it.install} onChange={(v) => onItem(id, "install", v)} /></div>
              <div className="r ct-total mono">{fmt(it.material + it.install)}</div>
            </div>
          );
        })}
      </div>

      <div className="rates-card">
        <h3>Project mark-ups</h3>
        <p className="rates-intro">Applied to the equipment + installation subtotal of every branch.</p>
        <div className="rates-grid">
          {[
            { key: "contingency", label: "Contingency" },
            { key: "projectManagement", label: "PM & commissioning" },
            { key: "warranty", label: "1-yr support & warranty" }
          ].map((r) => (
            <label className="rate-field" key={r.key}>
              <span>{r.label}</span>
              <div className="rate-input">
                <input
                  type="text"
                  value={(rates[r.key] * 100).toFixed(1).replace(/\.0$/, "")}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value.replace(/[^\d.]/g, ""));
                    onRate(r.key, isNaN(v) ? 0 : v / 100);
                  }}
                />
                <span className="ri-suffix">%</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

window.CostSettings = CostSettings;
