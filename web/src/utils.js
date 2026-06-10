import { CATALOG } from "./catalog";

export const fmt = (n) => "HK$" + Math.round(n).toLocaleString("en-US");

export const BRAND_DOT = {
  Fujifilm:  "#E60012",
  Dell:      "#5f6a72",
  Eizo:      "#41484F",
  Crestron:  "#004A80",
  ATEN:      "#6f2c91",
  Zebra:     "#5f6a72",
  Honeywell: "#E2231A",
  Hikvision: "#CE0037",
  Synology:  "#B5121B",
  Fortinet:  "#EE3124",
  APC:       "#003F72",
  "TP-Link": "#4DBBEB",
  Logitech:  "#00B8FC",
};

export function roomUnit(room, items) {
  items = items || CATALOG.items;
  let material = 0, install = 0;
  room.lines.forEach((l) => {
    const it = items[l.item];
    material += it.material * l.qty;
    install += it.install * l.qty;
  });
  return { material, install, total: material + install };
}

export function computeTotals(config, items, rates) {
  items = items || CATALOG.items;
  rates = rates || CATALOG.rates;
  let material = 0, install = 0;
  const roomTotals = {};
  CATALOG.rooms.forEach((room) => {
    const count = config[room.id] || 0;
    const u = roomUnit(room, items);
    roomTotals[room.id] = {
      unit: u,
      count,
      material: u.material * count,
      install: u.install * count,
      total: u.total * count,
    };
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

export function portfolioTotals(branches, items, rates) {
  const each = branches.map((b) => computeTotals(b.config, items, rates));
  const sum = (k) => each.reduce((a, t) => a + t[k], 0);
  return {
    material: sum("material"),
    install: sum("install"),
    equip: sum("equip"),
    contingency: sum("contingency"),
    pm: sum("pm"),
    warranty: sum("warranty"),
    grand: sum("grand"),
    perBranch: each,
  };
}

export function genRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return "FFBI-" + new Date().getFullYear() + "-" + s;
}

let BRANCH_SEQ = 1;

export function newBranchConfig() {
  const cfg = {};
  CATALOG.rooms.forEach((room) => { cfg[room.id] = room.count; });
  return cfg;
}

export function makeBranch(name, location) {
  return { id: "b" + (BRANCH_SEQ++), name, location, config: newBranchConfig() };
}

export function cloneItems() {
  const o = {};
  Object.keys(CATALOG.items).forEach((k) => { o[k] = { ...CATALOG.items[k] }; });
  return o;
}
