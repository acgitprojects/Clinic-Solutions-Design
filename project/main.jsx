// Main shell — multi-branch facility-package configurator + cost settings
const { useState: useStateM } = React;

let BRANCH_SEQ = 1;
function newBranchConfig() {
  const cfg = {};
  window.CATALOG.rooms.forEach((room) => { cfg[room.id] = room.count; });
  return cfg;
}
function makeBranch(name, location) {
  return { id: "b" + (BRANCH_SEQ++), name, location, config: newBranchConfig() };
}
function cloneItems() {
  const o = {};
  Object.keys(window.CATALOG.items).forEach((k) => { o[k] = { ...window.CATALOG.items[k] }; });
  return o;
}
// Random reference code — no DB, so generated client-side and (statistically) unique.
function genRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return "FFBI-" + new Date().getFullYear() + "-" + s;
}

function App() {
  const { BrandLockup, computeTotals, portfolioTotals, FacilityCard, SummaryRail, fmt } = window.ClinicApp;
  const C = window.CATALOG;

  const [branches, setBranches] = useStateM(() => [
    makeBranch("Central Branch", "Central, HK Island"),
    makeBranch("Mong Kok Branch", "Mong Kok, Kowloon")
  ]);
  const [activeId, setActiveId] = useStateM(branches[0].id);
  const [editingId, setEditingId] = useStateM(null);
  const [items, setItems] = useStateM(cloneItems);
  const [rates, setRates] = useStateM(() => ({ ...C.rates }));
  const [view, setView] = useStateM("config"); // config | costs
  const [showBOM, setShowBOM] = useStateM(false);
  const [refOpen, setRefOpen] = useStateM(false);
  const [meta, setMeta] = useStateM(() => ({
    client: "Harmony Medical Group",
    ref: genRef(),
    by: "Solutions Team",
    date: "2026-06-08"
  }));

  const active = branches.find((b) => b.id === activeId) || branches[0];
  const totals = computeTotals(active.config, items, rates);
  const portfolio = portfolioTotals(branches, items, rates);

  const updateBranch = (id, patch) => setBranches((bs) => bs.map((b) => b.id === id ? { ...b, ...patch } : b));
  const setCount = (roomId, v) => updateBranch(active.id, { config: { ...active.config, [roomId]: v } });

  const addBranch = () => {
    const b = makeBranch("New Branch " + branches.length, "");
    setBranches((bs) => [...bs, b]);
    setActiveId(b.id);
  };
  const dupBranch = () => {
    const b = { id: "b" + (BRANCH_SEQ++), name: active.name + " (copy)", location: active.location, config: { ...active.config } };
    setBranches((bs) => [...bs, b]);
    setActiveId(b.id);
  };
  const delBranch = (id) => {
    if (branches.length <= 1) return;
    setBranches((bs) => bs.filter((b) => b.id !== id));
    if (activeId === id) setActiveId(branches.find((b) => b.id !== id).id);
  };

  // cost settings handlers
  const setItemCost = (id, field, v) => setItems((m) => ({ ...m, [id]: { ...m[id], [field]: v } }));
  const setRate = (key, v) => setRates((r) => ({ ...r, [key]: v }));
  const resetCosts = () => { setItems(cloneItems()); setRates({ ...C.rates }); };

  return (
    <div className="shell">
      <header className="topbar">
        <BrandLockup />
        <div className="topbar-title">
          <div className="tt-kicker">Clinic Solutions</div>
          <div className="tt-main">Price Configurator</div>
        </div>
        <div className="topbar-total">
          <span>Portfolio total · {branches.length} {branches.length === 1 ? "branch" : "branches"}</span>
          <b className="mono">{fmt(portfolio.grand)}</b>
        </div>
      </header>

      {/* View switch */}
      <div className="viewnav">
        <button className={"view-tab" + (view === "config" ? " active" : "")} onClick={() => setView("config")}>Price Configurator</button>
        <button className={"view-tab" + (view === "costs" ? " active" : "")} onClick={() => setView("costs")}>Cost Settings</button>
      </div>

      {view === "costs" ? (
        <window.CostSettings items={items} rates={rates} onItem={setItemCost} onRate={setRate} onReset={resetCosts} />
      ) : (
        <React.Fragment>
          <div className="metabar">
            <label><span>Client / Group</span><input value={meta.client} onChange={(e) => setMeta({ ...meta, client: e.target.value })} /></label>
            <label className="meta-ref"><span>Reference</span>
              <div className="ref-row">
                <input value={meta.ref} onChange={(e) => setMeta({ ...meta, ref: e.target.value })} />
                <button className="ref-gen" title="Generate new code" onClick={() => setMeta({ ...meta, ref: genRef() })}>↻</button>
              </div>
            </label>
            <label><span>Prepared by</span><input value={meta.by} onChange={(e) => setMeta({ ...meta, by: e.target.value })} /></label>
            <label><span>Date</span><input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} /></label>
          </div>

          <div className="branchbar">
            <div className="branch-tabs">
              {branches.map((b) => {
                const bt = computeTotals(b.config, items, rates);
                const editing = editingId === b.id;
                return (
                  <div key={b.id} className={"branch-tab" + (b.id === activeId ? " active" : "")} onClick={() => setActiveId(b.id)}>
                    {editing ? (
                      <input
                        className="bt-name-edit"
                        autoFocus
                        value={b.name}
                        onChange={(e) => updateBranch(b.id, { name: e.target.value })}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingId(null); }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="bt-name" title="Double-click to rename" onDoubleClick={(e) => { e.stopPropagation(); setActiveId(b.id); setEditingId(b.id); }}>{b.name}</span>
                    )}
                    <span className="bt-total mono">{fmt(bt.grand)}</span>
                    <span className="bt-rename" title="Rename branch" onClick={(e) => { e.stopPropagation(); setActiveId(b.id); setEditingId(b.id); }}>✎</span>
                    {branches.length > 1 && (
                      <span className="bt-del" title="Remove branch" onClick={(e) => { e.stopPropagation(); delBranch(b.id); }}>✕</span>
                    )}
                  </div>
                );
              })}
              <button className="branch-add" onClick={addBranch}>+ Add branch</button>
            </div>
          </div>

          <div className="body">
            <main className="main">
              <div className="branch-ident">
                <div className="bi-fields">
                  <input className="bi-name" value={active.name} onChange={(e) => updateBranch(active.id, { name: e.target.value })} placeholder="Branch name" />
                  <input className="bi-loc" value={active.location} onChange={(e) => updateBranch(active.id, { location: e.target.value })} placeholder="Location / address" />
                </div>
                <button className="bi-dup" onClick={dupBranch}>Duplicate branch</button>
              </div>

              <div className="reference">
                <div className="ref-head">
                  <div>
                    <div className="ref-kicker">Solution reference</div>
                    <div className="ref-title">Standard clinic facility layout</div>
                  </div>
                  <button className="ref-expand" onClick={() => setRefOpen(true)}>Enlarge ⤢</button>
                </div>
                <button className="ref-imgwrap" onClick={() => setRefOpen(true)}>
                  <img src="assets/clinic-layout.jpeg" alt="Clinic facility layout reference" />
                </button>
              </div>

              <div className="fac-grid-label">
                <span>Facility packages</span>
                <span className="fgl-hint">Each facility is a fixed standard package — set how many of each. Edit unit costs in Cost Settings.</span>
              </div>

              <div className="fac-grid">
                {C.rooms.map((room) => (
                  <FacilityCard key={room.id} room={room} count={active.config[room.id]} rt={totals.roomTotals[room.id]} onCount={(v) => setCount(room.id, v)} />
                ))}
              </div>
            </main>

            <SummaryRail totals={totals} portfolio={portfolio} branchCount={branches.length} branchName={active.name} onExport={() => setShowBOM(true)} />
          </div>
        </React.Fragment>
      )}

      {refOpen && (
        <div className="lightbox" onClick={() => setRefOpen(false)}>
          <img src="assets/clinic-layout.jpeg" alt="Clinic facility layout reference" />
          <button className="lb-close" onClick={() => setRefOpen(false)}>Close ✕</button>
        </div>
      )}

      {showBOM && <window.BillOfMaterials branches={branches} meta={meta} portfolio={portfolio} items={items} rates={rates} onClose={() => setShowBOM(false)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
