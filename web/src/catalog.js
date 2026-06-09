// Clinic Solutions — FUJIFILM Business Innovation
// All figures in HKD. Indicative list estimates for materials and installation.

export const CATALOG = {
  currency: "HKD",
  items: {
    mfd:          { name: "Fujifilm Apeos C2560 MFD",              brand: "Fujifilm", note: "A3 colour MFD, scan-to-EMR, secure release",          material: 26000, install: 2200,  unit: "ea"   },
    labelPrinter: { name: "Zebra ZD421 Thermal Label Printer",    brand: "Zebra",    note: "Patient / specimen labelling",                          material:  2000, install:  350,  unit: "ea"   },
    barcodeScanner:{ name: "Honeywell Xenon 2D Barcode Scanner",  brand: "Honeywell",note: "Check-in & document capture",                           material:  1100, install:  180,  unit: "ea"   },
    pcTerminal:   { name: "Dell OptiPlex 3000 PC Terminal",       brand: "Dell",     note: "Reception / front-desk workstation",                    material:  5800, install:  500,  unit: "ea"   },
    eizoMonitor:  { name: "Eizo FlexScan EV2495 Monitor",         brand: "Eizo",     note: "24.1\" clinical display, USB-C, calibrated",            material:  4800, install:  600,  unit: "ea"   },
    dellPC:       { name: "Dell Precision 3660 Clinical PC",      brand: "Dell",     note: "Consultation workstation w/ EMR",                       material:  9500, install:  500,  unit: "ea"   },
    ipCamera:     { name: "Hikvision 4MP PoE Dome Camera",        brand: "Hikvision",note: "DS-2CD2143G2, ceiling / wall mount",                    material:   900, install:  600,  unit: "ea"   },
    nursePC:      { name: "Dell OptiPlex 3000 Nurse PC",          brand: "Dell",     note: "Treatment-room workstation",                            material:  5800, install:  500,  unit: "ea"   },
    medScanner:   { name: "Zebra DS2208 Medication Scanner",      brand: "Zebra",    note: "Barcode med dispensing check",                          material:  1800, install:  250,  unit: "ea"   },
    server:       { name: "Dell PowerEdge T360 Server",           brand: "Dell",     note: "On-prem EMR / application server",                      material: 52000, install: 4500,  unit: "ea"   },
    nas:          { name: "Synology DS1823xs+ NAS (40TB)",        brand: "Synology", note: "Encrypted local backup, 40TB usable",                   material: 18500, install: 1800,  unit: "ea"   },
    utm:          { name: "Fortinet FortiGate 60F UTM",           brand: "Fortinet", note: "Managed gateway, IPS + content filter, 1-yr bundle",    material:  9500, install: 2000,  unit: "ea"   },
    ups:          { name: "APC Smart-UPS SMT3000IC (3kVA)",       brand: "APC",      note: "Online UPS w/ network monitoring card",                 material:  8000, install:  700,  unit: "ea"   },
    wifiAP:       { name: "TP-Link EAP670 Wi-Fi 6 AP",           brand: "TP-Link",  note: "Ceiling AP, PoE+, controller-managed",                  material:  1800, install:  700,  unit: "ea"   },
    avSystem:     { name: "Logitech Rally Bar Mini AV System",    brand: "Logitech", note: "Video bar, AI framing, Teams/Zoom/Meet certified",      material: 20000, install: 2500,  unit: "set"  },
    rack:         { name: "27U Server Rack & Cable Management",   brand: "Fujifilm", note: "27U rack, PDU, dressing",                               material:  6500, install: 2000,  unit: "ea"   },
    switch:       { name: "TP-Link TL-SG3452XP PoE+ Switch",     brand: "TP-Link",  note: "48-port, L2+ managed, 500W PoE budget",                 material:  8000, install: 1200,  unit: "ea"   },
    cabling:      { name: "Structured Cabling Drop (Cat6A)",      brand: "Fujifilm", note: "Per outlet: cable, faceplate, test",                    material:   750, install:  900,  unit: "drop" },
  },

  rooms: [
    {
      id: "reception", name: "Reception / Waiting Area", zone: "Front of House",
      blurb: "Patient check-in, document capture and front-desk workstations.",
      count: 1, fixedCount: true,
      lines: [
        { item: "mfd",           qty: 1 },
        { item: "labelPrinter",  qty: 2 },
        { item: "barcodeScanner",qty: 2 },
        { item: "pcTerminal",    qty: 2 },
      ],
    },
    {
      id: "consult", name: "Consultation Room", zone: "Clinical",
      blurb: "Diagnostic display, clinical PC and in-room security for each doctor's room.",
      count: 2,
      lines: [
        { item: "eizoMonitor", qty: 1 },
        { item: "dellPC",      qty: 1 },
        { item: "ipCamera",    qty: 1 },
      ],
    },
    {
      id: "treatment", name: "Treatment Room", zone: "Clinical",
      blurb: "Nurse workstation and monitoring for procedures and minor treatment.",
      count: 1,
      lines: [
        { item: "nursePC",  qty: 1 },
        { item: "ipCamera", qty: 1 },
      ],
    },
    {
      id: "nurse", name: "Nurse Station", zone: "Clinical",
      blurb: "Shared dispensing, labelling and medication verification hub.",
      count: 1,
      lines: [
        { item: "pcTerminal",  qty: 2 },
        { item: "labelPrinter",qty: 1 },
        { item: "medScanner",  qty: 1 },
      ],
    },
    {
      id: "backup", name: "Backup / Storage Room", zone: "Infrastructure",
      blurb: "On-prem server, encrypted backup, managed gateway and power protection.",
      count: 1,
      lines: [
        { item: "server", qty: 1 },
        { item: "nas",    qty: 1 },
        { item: "utm",    qty: 1 },
        { item: "ups",    qty: 1 },
        { item: "rack",   qty: 1 },
        { item: "switch", qty: 1 },
      ],
    },
    {
      id: "network", name: "Network & Connectivity", zone: "Infrastructure",
      blurb: "Site-wide cabling, ceiling cameras and Wi-Fi coverage.",
      count: 1, fixedCount: true,
      lines: [
        { item: "ipCamera", qty: 4 },
        { item: "wifiAP",   qty: 2 },
        { item: "cabling",  qty: 24 },
      ],
    },
    {
      id: "conference", name: "Conference / AV Corner", zone: "Front of House",
      blurb: "Video collaboration and room scheduling for case reviews.",
      count: 1,
      lines: [
        { item: "avSystem", qty: 1 },
      ],
    },
  ],

  rates: {
    contingency:       0.05,
    projectManagement: 0.08,
    warranty:          0.06,
  },
};
