import { CATALOG } from "../catalog";
import { fmt } from "../utils";

export default function SummaryRail({ totals, portfolio, branchCount, branchName, onExport }) {
  const pct = (r) => (r * 100).toFixed(0) + "%";
  const matPct = totals.equip ? (totals.material / totals.equip * 100) : 0;
  return (
    <aside className="summary">
      <div className="summary-card">
        <h3>{branchName} · Estimate</h3>
        <div className="sum-row"><span>Materials</span><b className="mono">{fmt(totals.material)}</b></div>
        <div className="sum-row"><span>Installation</span><b className="mono">{fmt(totals.install)}</b></div>
        <div className="sum-row divide"><span>Equipment subtotal</span><b className="mono">{fmt(totals.equip)}</b></div>
        <div className="sum-row sub"><span>Contingency ({pct(CATALOG.rates.contingency)})</span><b className="mono">{fmt(totals.contingency)}</b></div>
        <div className="sum-row sub"><span>PM &amp; commissioning ({pct(CATALOG.rates.projectManagement)})</span><b className="mono">{fmt(totals.pm)}</b></div>
        <div className="sum-row sub"><span>1-yr support &amp; warranty ({pct(CATALOG.rates.warranty)})</span><b className="mono">{fmt(totals.warranty)}</b></div>
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
