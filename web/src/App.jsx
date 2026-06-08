import { useState } from "react";
import { CATALOG } from "./catalog";
import { fmt, computeTotals, portfolioTotals, genRef, makeBranch, cloneItems } from "./utils";
import FacilityCard from "./components/FacilityCard";
import SummaryRail from "./components/SummaryRail";
import BillOfMaterials from "./components/BillOfMaterials";
import CostSettings from "./components/CostSettings";
import fujiLogo from "./assets/fujifilm-logo.png";
import clinicLayout from "./assets/clinic-layout.jpeg";
import "./styles.css";

export default function App() {
  const [branches, setBranches] = useState(() => [
    makeBranch("Central Branch", "Central, HK Island"),
    makeBranch("Mong Kok Branch", "Mong Kok, Kowloon"),
  ]);
  const [activeId, setActiveId] = useState(() => branches[0].id);
  const [editingId, setEditingId] = useState(null);
  const [items, setItems] = useState(cloneItems);
  const [rates, setRates] = useState(() => ({ ...CATALOG.rates }));
  const [view, setView] = useState("config");
  const [showBOM, setShowBOM] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [meta, setMeta] = useState(() => ({
    client: "Harmony Medical Group",
    ref: genRef(),
    by: "Solutions Team",
    date: new Date().toISOString().slice(0, 10),
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
    const b = makeBranch(active.name + " (copy)", active.location);
    b.config = { ...active.config };
    setBranches((bs) => [...bs, b]);
    setActiveId(b.id);
  };
  const delBranch = (id) => {
    if (branches.length <= 1) return;
    setBranches((bs) => bs.filter((b) => b.id !== id));
    if (activeId === id) setActiveId(branches.find((b) => b.id !== id).id);
  };

  const setItemCost = (id, field, v) => setItems((m) => ({ ...m, [id]: { ...m[id], [field]: v } }));
  const setRate = (key, v) => setRates((r) => ({ ...r, [key]: v }));
  const resetCosts = () => { setItems(cloneItems()); setRates({ ...CATALOG.rates }); };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="lockup">
          <img className="fuji-logo" src={fujiLogo} alt="FUJIFILM — Value from Innovation" />
        </div>
        <div className="topbar-title">
          <div className="tt-kicker">Clinic Solutions</div>
          <div className="tt-main">Price Configurator</div>
        </div>
        <div className="topbar-total">
          <span>Portfolio total · {branches.length} {branches.length === 1 ? "branch" : "branches"}</span>
          <b className="mono">{fmt(portfolio.grand)}</b>
        </div>
      </header>

      <div className="viewnav">
        <button className={"view-tab" + (view === "config" ? " active" : "")} onClick={() => setView("config")}>Price Configurator</button>
        <button className={"view-tab" + (view === "costs" ? " active" : "")} onClick={() => setView("costs")}>Cost Settings</button>
      </div>

      {view === "costs" ? (
        <CostSettings items={items} rates={rates} onItem={setItemCost} onRate={setRate} onReset={resetCosts} />
      ) : (
        <>
          <div className="metabar">
            <label>
              <span>Client / Group</span>
              <input value={meta.client} onChange={(e) => setMeta({ ...meta, client: e.target.value })} />
            </label>
            <label className="meta-ref">
              <span>Reference</span>
              <div className="ref-row">
                <input value={meta.ref} onChange={(e) => setMeta({ ...meta, ref: e.target.value })} />
                <button className="ref-gen" title="Generate new code" onClick={() => setMeta({ ...meta, ref: genRef() })}>↻</button>
              </div>
            </label>
            <label>
              <span>Prepared by</span>
              <input value={meta.by} onChange={(e) => setMeta({ ...meta, by: e.target.value })} />
            </label>
            <label>
              <span>Date</span>
              <input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} />
            </label>
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
                  <img src={clinicLayout} alt="Clinic facility layout reference" />
                </button>
              </div>

              <div className="fac-grid-label">
                <span>Facility packages</span>
                <span className="fgl-hint">Each facility is a fixed standard package — set how many of each. Edit unit costs in Cost Settings.</span>
              </div>

              <div className="fac-grid">
                {CATALOG.rooms.map((room) => (
                  <FacilityCard
                    key={room.id}
                    room={room}
                    count={active.config[room.id]}
                    rt={totals.roomTotals[room.id]}
                    onCount={(v) => setCount(room.id, v)}
                  />
                ))}
              </div>
            </main>

            <SummaryRail
              totals={totals}
              portfolio={portfolio}
              branchCount={branches.length}
              branchName={active.name}
              onExport={() => setShowBOM(true)}
            />
          </div>
        </>
      )}

      {refOpen && (
        <div className="lightbox" onClick={() => setRefOpen(false)}>
          <img src={clinicLayout} alt="Clinic facility layout reference" />
          <button className="lb-close" onClick={() => setRefOpen(false)}>Close ✕</button>
        </div>
      )}

      {showBOM && (
        <BillOfMaterials
          branches={branches}
          meta={meta}
          portfolio={portfolio}
          items={items}
          rates={rates}
          onClose={() => setShowBOM(false)}
        />
      )}
    </div>
  );
}
