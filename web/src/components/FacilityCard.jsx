import { CATALOG } from "../catalog";
import { fmt, BRAND_DOT } from "../utils";
import Stepper from "./Stepper";

export default function FacilityCard({ room, count, rt, onCount }) {
  const u = rt.unit;
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
            const it = CATALOG.items[l.item];
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
