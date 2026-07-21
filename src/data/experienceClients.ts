import type { ClientEntry } from "@/components/site/ExperienceDetailPage";

const clients = (names: string[], service: string): ClientEntry[] =>
  names.map((name) => ({ name, description: `${service}, ${name}.` }));

export const ifrsClients = clients(
  [
    "BITMAS GENERAL BUSINESS PLC",
    "DROGA Pharma PLC",
    "ANDINET EDUCATION & TRAINING PLC",
    "SAPPHIRE ADDIS HOTEL",
    "KURU ETHIOPIA COFFEE DEVELOPMENT PLC",
    "ZERUFAM Industry PLC",
    "LIYANA HEALTHCARE PLC",
    "ETUR Textile PLC",
    "DAWE EMEDE TOUR & TRAVEL AGENCY PLC",
    "AZZEMAN HOTEL",
    "ETHIO-SUDAN TEBIB HOSPITAL PLC",
    "St. GABRIEL GENERAL HOSPITAL PLC",
    "ALPHASOL MODULAR ENERGY PLC",
    "SHIMZAL PLC",
    "DIRE Industries PLC",
    "HORATA Engineering PLC",
    "ADEY TENSAE MEDIA & ENTERTAINMENT PLC",
    "Steely RMI PLC",
    "Ethio-Nippon S.C.",
    "FAMILY GUIDANCE ASSOCIATION OF ETHIOPIA",
    "CENTURY COMPACT TRANSFORMER & SWICH GEAR MANUFACTURING PLC",
    "EMERGENCY RELIEF TRANSPORT ENTERPRISE (ERTE)",
  ],
  "IFRS for SMEs consultancy services",
);

export const assetValuationClients = clients(
  [
    "BITMAS GENERAL BUSINESS PLC",
    "KURU ETHIOPIA COFFEE DEVELOPMENT PLC",
    "ETHIOPIAN CROWN CORK & CAN MANUFACTURING SHARE COMPANY",
    "CONSOLIDATED ENGINEERING SERVICE & RESEARCH PLC",
    "St. GABRIEL GENERAL HOSPITAL PLC",
    "ETHIOPIAN CATHOLIC CHURCH DEVELOPMENT ASSOCIATION - Adigrat Branch",
    "SELE ENAT CHARITABLE ORGNIZATION",
  ],
  "Asset valuation and revaluation consultancy services",
);

export const ipsasClients = clients(
  [
    "HOPE International Development Agency (HIDA)",
    "HELP FOR PERSONS WITH DISABILITIES ORGANIZATION (HPDO)",
    "PLAN INTERNATIONAL ETHIOPIA",
    "Ethiopian Center for Disability and Development (ECDD)",
    "Network of Organization of/for the Visually Impaired and the Blind (NOVIB)",
    "Federation of Ethiopian National Associations of Persons with Disabilities (FENAPD)",
    "Ethiopian National Disability Action Network (ENDAN)",
    "SELE ENAT CHARITABLE ORGNIZATION",
    "FARM AFRICA",
    "PATHFINDER INTERNATIONAL ETHIOPIA",
    "SAVE THE CHILDREN",
    "ETHIOPIAN CATHOLIC CHURCH DEVELOPMENT ASSOCIATION - Adigrat Branch",
  ],
  "IPSAS consultancy services",
);

export const generalClients = clients(
  [
    "Wegagen Bank SC",
    "Development Bank of Ethiopia (DBE) SC",
    "Addis International Bank (AIB) SC",
    "Africa Insurance SC",
    "Association of Private Insurance Companies in Ethiopia",
    "Addis Ababa Chamber of Commerce and Sectorial Associations (AACCSA)",
    "Ethiopian Electric Power",
    "Ethiopian Airports Enterprise",
    "Ethiopian Roads Authority",
    "FDRE Defense Construction Design Enterprise",
    "Metals and Engineering Corporation (METEC)",
    "Privatization and Public Enterprises Supervising Agency (PPESA)",
    "TIRET Ethiopia",
    "Ethiopian Orthodox Development Association",
    "Tigray Disabled Veterans Association",
    "Elilly International Hotel",
    "ETHIOPIAN PULSES, OIL SEEDS & SPICES PROCESSORS & EXPORTERS ASSOCIATION (EPOSPEA)",
    "Sundry Clients",
  ],
  "Consulting and training services",
);
