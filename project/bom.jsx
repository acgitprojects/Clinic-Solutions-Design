// Bill of Materials overlay — multi-branch, print + CSV export
function BillOfMaterials({ branches, meta, portfolio, items, rates, onClose }) {
  const C = window.CATALOG;
  const { fmt, computeTotals } = window.ClinicApp;
  items = items || C.items;

  // Build per-branch -> per-facility -> rows
  const branchData = branches.map((b) => {
    const totals = computeTotals(b.config, items, rates);
    const groups = C.rooms.map((room) => {
      const count = b.config[room.id];
      if (!count) return null;
      const rows = room.lines.map((line) => {
        const it = items[line.item];
        const eff = line.qty * count;
        return {
          sku: line.item.toUpperCase().slice(0, 8), name: it.name, brand: it.brand, note: it.note,
          qty: eff, material: it.material, install: it.install,
          lineTotal: (it.material + it.install) * eff
        };
      });
      return { room, count, rows, total: totals.roomTotals[room.id].total };
    }).filter(Boolean);
    return { branch: b, totals, groups };
  });

  const downloadCSV = () => {
    const out = [["Branch", "Location", "Facility", "SKU", "Item", "Brand", "Qty", "Unit Material", "Unit Install", "Line Total (HKD)"]];
    branchData.forEach((bd) => {
      bd.groups.forEach((g) => {
        g.rows.forEach((r) => {
          out.push([bd.branch.name, bd.branch.location, g.room.name, r.sku, r.name, r.brand, r.qty, r.material, r.install, r.lineTotal]);
        });
      });
      out.push(["", "", "", "", "", "", "", "", bd.branch.name + " total", Math.round(bd.totals.grand)]);
    });
    out.push([]);
    out.push(["", "", "", "", "", "", "", "", "PORTFOLIO TOTAL", Math.round(portfolio.grand)]);
    const csv = out.map((row) => row.map((c) => {
      const s = String(c);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BOM_" + (meta.client.replace(/\s+/g, "_") || "Clinic") + "_" + meta.date + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bom-overlay">
      <div className="bom-toolbar no-print">
        <span>Bill of Materials · {branches.length} {branches.length === 1 ? "branch" : "branches"}</span>
        <div className="bom-actions">
          <button className="btn-ghost" onClick={downloadCSV}>Download CSV</button>
          <button className="btn-ghost" onClick={() => window.print()}>Print / PDF</button>
          <button className="btn-close" onClick={onClose}>Close ✕</button>
        </div>
      </div>

      <div className="bom-doc" id="bom-doc">
        <div className="bom-head">
          <div>
            <div className="bom-title">Bill of Materials</div>
            <div className="bom-sub">Clinic Digital Solution · FUJIFILM Business Innovation</div>
          </div>
          <div className="bom-meta">
            <div><span>Client / Group</span>{meta.client || "—"}</div>
            <div><span>Reference</span>{meta.ref || "—"}</div>
            <div><span>Prepared by</span>{meta.by || "—"}</div>
            <div><span>Date</span>{meta.date}</div>
          </div>
        </div>

        {/* Portfolio summary band */}
        <div className="bom-portfolio">
          <div className="bp-title">Portfolio summary</div>
          <table className="bp-table">
            <thead>
              <tr><th>Branch</th><th>Location</th><th className="r">Materials</th><th className="r">Installation</th><th className="r">Branch total</th></tr>
            </thead>
            <tbody>
              {branchData.map((bd) => (
                <tr key={bd.branch.id}>
                  <td className="strong">{bd.branch.name}</td>
                  <td className="dim">{bd.branch.location || "—"}</td>
                  <td className="r mono">{fmt(bd.totals.material)}</td>
                  <td className="r mono">{fmt(bd.totals.install)}</td>
                  <td className="r mono strong">{fmt(bd.totals.grand)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan="4" className="r">Portfolio total (excl. GST)</td><td className="r mono grand-cell">{fmt(portfolio.grand)}</td></tr>
            </tfoot>
          </table>
        </div>

        {branchData.map((bd) => (
          <div className="bom-branch" key={bd.branch.id}>
            <div className="bom-branch-head">
              <span className="bbh-name">{bd.branch.name}</span>
              <span className="bbh-loc">{bd.branch.location}</span>
              <span className="bbh-total mono">{fmt(bd.totals.grand)}</span>
            </div>

            {bd.groups.map((g) => (
              <div className="bom-group" key={g.room.id}>
                <div className="bom-group-head">
                  <span>{g.room.name}{g.count > 1 ? ` ×${g.count}` : ""}</span>
                  <span className="bom-group-zone">{g.room.zone}</span>
                </div>
                <table className="bom-table">
                  <thead>
                    <tr>
                      <th>SKU</th><th>Item</th><th>Brand</th>
                      <th className="r">Qty</th><th className="r">Unit Mat.</th>
                      <th className="r">Unit Inst.</th><th className="r">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((r, i) => (
                      <tr key={i}>
                        <td className="mono dim">{r.sku}</td>
                        <td><div className="bt-name">{r.name}</div><div className="bt-note">{r.note}</div></td>
                        <td>{r.brand}</td>
                        <td className="r mono">{r.qty}</td>
                        <td className="r mono">{fmt(r.material)}</td>
                        <td className="r mono">{fmt(r.install)}</td>
                        <td className="r mono strong">{fmt(r.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr><td colSpan="6" className="r">Facility subtotal</td><td className="r mono strong">{fmt(g.total)}</td></tr>
                  </tfoot>
                </table>
              </div>
            ))}

            <div className="bom-totals">
              <div className="btr"><span>Materials</span><b className="mono">{fmt(bd.totals.material)}</b></div>
              <div className="btr"><span>Installation</span><b className="mono">{fmt(bd.totals.install)}</b></div>
              <div className="btr div"><span>Equipment subtotal</span><b className="mono">{fmt(bd.totals.equip)}</b></div>
              <div className="btr sm"><span>Contingency (5%)</span><b className="mono">{fmt(bd.totals.contingency)}</b></div>
              <div className="btr sm"><span>PM &amp; commissioning (8%)</span><b className="mono">{fmt(bd.totals.pm)}</b></div>
              <div className="btr sm"><span>1-yr support &amp; warranty (6%)</span><b className="mono">{fmt(bd.totals.warranty)}</b></div>
              <div className="btr grand"><span>{bd.branch.name} total</span><b className="mono">{fmt(bd.totals.grand)}</b></div>
            </div>
          </div>
        ))}

        <div className="bom-disclaimer">
          Figures are indicative budgetary estimates in Hong Kong Dollars (HKD) and exclude statutory taxes,
          builder's works, and freight unless stated. Each facility is supplied as a fixed standard package.
          Final pricing subject to site survey and formal quotation. Prepared by FUJIFILM
          Business Innovation as a clinic solution proposal.
        </div>
      </div>
    </div>
  );
}

window.BillOfMaterials = BillOfMaterials;
