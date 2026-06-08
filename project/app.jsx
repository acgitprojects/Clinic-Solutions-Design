// Clinic Solutions Price Configurator — facility-package model
const { useState, useMemo } = React;

const fmt = (n) => "HK$" + Math.round(n).toLocaleString("en-US");

const BRAND_DOT = {
  Fujifilm: "#E60012",
  Dell: "#5f6a72",
  Eizo: "#41484F"
};

// ---- Fujifilm header lockup ---------------------------------------------
function BrandLockup() {
  return (
    <div className="lockup">
      <img className="fuji-logo" src="assets/fujifilm-logo.png" alt="FUJIFILM — Value from Innovation" />
    </div>
  );
}

// ---- quantity stepper ----------------------------------------------------
function Stepper({ value, onChange, min = 0, max = 99 }) {
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

// unit price of one facility package
function roomUnit(room, items) {
  items = items || window.CATALOG.items;
  let material = 0, install = 0;
  room.lines.forEach((l) => {
    const it = items[l.item];
    material += it.material * l.qty;
    install += it.install * l.qty;
  });
  return { material, install, total: material + install };
}

// ---- compute totals ------------------------------------------------------
function computeTotals(config, items, rates) {
  const C = window.CATALOG;
  items = items || C.items;
  rates = rates || C.rates;
  let material = 0, install = 0;
  const roomTotals = {};
  C.rooms.forEach((room) => {
    const count = config[room.id] || 0;
    const u = roomUnit(room, items);
    roomTotals[room.id] = { unit: u, count, material: u.material * count, install: u.install * count, total: u.total * count };
    material += u.material * count;
    install += u.install * count;
  });
  const equip = material + install;
  const contingency = equip * rates.contingency;
  const pm = equip * rates.projectManagement;
  const warranty = equip * rates.warranty;
  const grand = equip + contingency + pm + warranty;
  return { material, install, equip, contingency, pm, warranty, grand, roomTotals };
}

// portfolio = sum across an array of branch configs
function portfolioTotals(branches, items, rates) {
  const each = branches.map((b) => computeTotals(b.config, items, rates));
  const sum = (k) => each.reduce((a, t) => a + t[k], 0);
  return {
    material: sum("material"), install: sum("install"), equip: sum("equip"),
    contingency: sum("contingency"), pm: sum("pm"), warranty: sum("warranty"),
    grand: sum("grand"), perBranch: each
  };
}

function useTotals(config) {
  return useMemo(() => computeTotals(config), [config]);
}

// ---- facility package card ----------------------------------------------
function FacilityCard({ room, count, rt, onCount }) {
  const C = window.CATALOG;
  const u = rt.unit;
  const included = room.lines.some((l) => count === 0);
  return (
    <div className={"fac-card" + (count === 0 ? " excluded" : "")}>
      <div className="fac-head">
        <div className="fac-head-l">
          <div className="zone-tag">{room.zone}</div>
          <h3>{room.name}</h3>
          <p className="fac-blurb">{room.blurb}</p>
        </div>
        <div className="fac-head-r">
          <div className="fac-price-label">Package price</div>
          <div className="fac-price mono">{fmt(u.total)}</div>
          <div className="fac-price-split mono">{fmt(u.material)} mat · {fmt(u.install)} install</div>
        </div>
      </div>

      <div className="fac-includes">
        <div className="fac-includes-label">Standard package includes</div>
        <ul>
          {room.lines.map((l) => {
            const it = C.items[l.item];
            return (
              <li key={l.item}>
                <span className="brand-dot" style={{ background: BRAND_DOT[it.brand] || "#94a3b8" }} />
                <span className="inc-name">{it.name}</span>
                {l.qty > 1 && <span className="inc-qty">×{l.qty}</span>}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="fac-foot">
        {room.fixedCount ? (
          <div className="fac-fixed">
            <label className="fac-toggle">
              <input type="checkbox" checked={count > 0} onChange={(e) => onCount(e.target.checked ? 1 : 0)} />
              <span>Include this facility</span>
            </label>
          </div>
        ) : (
          <div className="fac-qty">
            <span className="fac-qty-label">Facilities</span>
            <Stepper value={count} min={0} max={20} onChange={onCount} />
          </div>
        )}
        <div className="fac-linetotal">
          <span>{count === 0 ? "Excluded" : (count > 1 ? `${count} × ${fmt(u.total)}` : "Subtotal")}</span>
          <b className="mono">{fmt(rt.total)}</b>
        </div>
      </div>
    </div>
  );
}

// ---- summary rail --------------------------------------------------------
function SummaryRail({ totals, portfolio, branchCount, branchName, onExport }) {
  const C = window.CATALOG;
  const pct = (r) => (r * 100).toFixed(0) + "%";
  const matPct = totals.equip ? (totals.material / totals.equip * 100) : 0;
  return (
    <aside className="summary">
      <div className="summary-card">
        <h3>{branchName} · Estimate</h3>
        <div className="sum-row"><span>Materials</span><b className="mono">{fmt(totals.material)}</b></div>
        <div className="sum-row"><span>Installation</span><b className="mono">{fmt(totals.install)}</b></div>
        <div className="sum-row divide"><span>Equipment subtotal</span><b className="mono">{fmt(totals.equip)}</b></div>
        <div className="sum-row sub"><span>Contingency ({pct(C.rates.contingency)})</span><b className="mono">{fmt(totals.contingency)}</b></div>
        <div className="sum-row sub"><span>PM &amp; commissioning ({pct(C.rates.projectManagement)})</span><b className="mono">{fmt(totals.pm)}</b></div>
        <div className="sum-row sub"><span>1-yr support &amp; warranty ({pct(C.rates.warranty)})</span><b className="mono">{fmt(totals.warranty)}</b></div>
        <div className="grand">
          <span>Total estimate</span>
          <b className="mono">{fmt(totals.grand)}</b>
          <div className="grand-note">Indicative · excl. GST · HKD</div>
        </div>
        {branchCount > 1 && (
          <div className="portfolio-row">
            <span>Portfolio total · {branchCount} branches</span>
            <b className="mono">{fmt(portfolio.grand)}</b>
          </div>
        )}
        <button className="btn-export" onClick={onExport}>Export Bill of Materials</button>
        <div className="split-bar">
          <div className="split-mat" style={{ width: matPct + "%" }} />
          <div className="split-inst" style={{ width: (100 - matPct) + "%" }} />
        </div>
        <div className="split-legend">
          <span><i style={{ background: "#E60012" }} /> Materials {matPct.toFixed(0)}%</span>
          <span><i style={{ background: "#241c19" }} /> Installation {(100 - matPct).toFixed(0)}%</span>
        </div>
      </div>
    </aside>
  );
}

window.ClinicApp = { fmt, BRAND_DOT, BrandLockup, Stepper, roomUnit, computeTotals, portfolioTotals, useTotals, FacilityCard, SummaryRail };
