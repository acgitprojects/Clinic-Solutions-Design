// Clinic Solutions — FUJIFILM Business Innovation
// Price catalog. All figures in HKD. Pricing assumptions are indicative list
// estimates for materials (hardware/licence) and installation (labour + config).
// Categories map to the clinic floor-plan zones.

window.CATALOG = {
  currency: "HKD",
  // Master item catalogue. material = hardware/licence unit price.
  // install = labour + configuration per unit. brand for the chip badge.
  items: {
    mfd: { name: "Apeos Multifunction Copier / Scanner", brand: "Fujifilm", note: "A3 colour MFD, scan-to-EMR, secure release", material: 38000, install: 2800, unit: "ea" },
    labelPrinter: { name: "Thermal Label Printer", brand: "Fujifilm", note: "Patient / specimen labelling", material: 2800, install: 400, unit: "ea" },
    barcodeScanner: { name: "2D Barcode Scanner", brand: "Fujifilm", note: "Check-in & document capture", material: 1500, install: 200, unit: "ea" },
    pcTerminal: { name: "Dell OptiPlex PC Terminal", brand: "Dell", note: "Reception / front-desk workstation", material: 8500, install: 600, unit: "ea" },
    eizoMonitor: { name: "Eizo RadiForce Medical Monitor", brand: "Eizo", note: "Diagnostic-grade clinical display", material: 28000, install: 1200, unit: "ea" },
    dellPC: { name: "Dell Precision Clinical PC", brand: "Dell", note: "Consultation workstation w/ EMR", material: 12000, install: 600, unit: "ea" },
    ipCamera: { name: "IP Dome Camera", brand: "Fujifilm", note: "PoE, ceiling / wall mount", material: 3500, install: 800, unit: "ea" },
    nursePC: { name: "Dell OptiPlex Nurse PC", brand: "Dell", note: "Treatment-room workstation", material: 9000, install: 600, unit: "ea" },
    medScanner: { name: "Medication Verification Scanner", brand: "Fujifilm", note: "Barcode med dispensing check", material: 2200, install: 300, unit: "ea" },
    server: { name: "Dell PowerEdge T360 Server", brand: "Dell", note: "On-prem EMR / application server", material: 65000, install: 5000, unit: "ea" },
    nas: { name: "NAS Backup Appliance", brand: "Dell", note: "Encrypted local backup, 40TB", material: 18000, install: 2000, unit: "ea" },
    utm: { name: "Network Box UTM Firewall", brand: "Fujifilm", note: "Managed gateway, IPS + content filter", material: 22000, install: 3500, unit: "ea" },
    ups: { name: "Online UPS 3kVA", brand: "Fujifilm", note: "Rack UPS w/ monitoring", material: 6500, install: 800, unit: "ea" },
    wifiAP: { name: "Wi-Fi 6 Access Point", brand: "Fujifilm", note: "Ceiling AP, PoE, controller-managed", material: 3800, install: 900, unit: "ea" },
    avSystem: { name: "Conference Video AV System", brand: "Fujifilm", note: "Video bar, touch panel, room scheduling", material: 85000, install: 12000, unit: "set" },
    rack: { name: "Server Rack & Cable Management", brand: "Fujifilm", note: "27U rack, PDU, dressing", material: 7800, install: 2500, unit: "ea" },
    switch: { name: "48-Port PoE+ Managed Switch", brand: "Fujifilm", note: "Core network switch", material: 14000, install: 1500, unit: "ea" },
    cabling: { name: "Structured Cabling Drop (Cat6A)", brand: "Fujifilm", note: "Per outlet: cable, faceplate, test", material: 650, install: 550, unit: "drop" }
  },

  // Facilities (standard packages). `count` = number of identical facilities.
  // Each facility is a fixed bundle — line `qty` is part of the standard package
  // and is NOT user-editable. Package unit price = sum of its lines.
  rooms: [
    {
      id: "reception", name: "Reception / Waiting Area", zone: "Front of House",
      blurb: "Patient check-in, document capture and front-desk workstations.",
      count: 1, fixedCount: true,
      lines: [
        { item: "mfd", qty: 1 },
        { item: "labelPrinter", qty: 2 },
        { item: "barcodeScanner", qty: 2 },
        { item: "pcTerminal", qty: 2 }
      ]
    },
    {
      id: "consult", name: "Consultation Room", zone: "Clinical",
      blurb: "Diagnostic display, clinical PC and in-room security for each doctor's room.",
      count: 2,
      lines: [
        { item: "eizoMonitor", qty: 1 },
        { item: "dellPC", qty: 1 },
        { item: "ipCamera", qty: 1 }
      ]
    },
    {
      id: "treatment", name: "Treatment Room", zone: "Clinical",
      blurb: "Nurse workstation and monitoring for procedures and minor treatment.",
      count: 1,
      lines: [
        { item: "nursePC", qty: 1 },
        { item: "ipCamera", qty: 1 }
      ]
    },
    {
      id: "nurse", name: "Nurse Station", zone: "Clinical",
      blurb: "Shared dispensing, labelling and medication verification hub.",
      count: 1,
      lines: [
        { item: "pcTerminal", qty: 2 },
        { item: "labelPrinter", qty: 1 },
        { item: "medScanner", qty: 1 }
      ]
    },
    {
      id: "backup", name: "Backup / Storage Room", zone: "Infrastructure",
      blurb: "On-prem server, encrypted backup, managed gateway and power protection.",
      count: 1,
      lines: [
        { item: "server", qty: 1 },
        { item: "nas", qty: 1 },
        { item: "utm", qty: 1 },
        { item: "ups", qty: 1 },
        { item: "rack", qty: 1 },
        { item: "switch", qty: 1 }
      ]
    },
    {
      id: "network", name: "Network & Connectivity", zone: "Infrastructure",
      blurb: "Site-wide cabling, ceiling cameras and Wi-Fi coverage.",
      count: 1, fixedCount: true,
      lines: [
        { item: "ipCamera", qty: 4 },
        { item: "wifiAP", qty: 2 },
        { item: "cabling", qty: 24 }
      ]
    },
    {
      id: "conference", name: "Conference / AV Corner", zone: "Front of House",
      blurb: "Video collaboration and room scheduling for case reviews.",
      count: 1,
      lines: [
        { item: "avSystem", qty: 1 }
      ]
    }
  ],

  // Project-level percentages applied to the equipment + install subtotal.
  rates: {
    contingency: 0.05,        // 5% contingency
    projectManagement: 0.08,  // 8% PM & commissioning
    warranty: 0.06            // 6% 1-yr support & warranty
  }
};
