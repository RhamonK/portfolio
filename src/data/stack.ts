// « Comment ça tourne » : l'architecture d'un vrai projet (Studio Nala), brique par brique,
// puis la stack couche par couche. Les outils et les preuves viennent de src/data/projects.ts.
// Les extraits de code sont SIMPLIFIÉS pour la lecture (marqués comme tels sur la page) :
// à remplacer par des extraits du vrai dépôt quand il sera public.

import type { Lang } from "@/i18n";

type T = Record<Lang, string>;

export type Brick = { layer: T; name: T; tech: string; file: string; what: T; code: string };

export const bricks: Brick[] = [
  {
    layer: { fr: "Interface", en: "Interface" },
    name: { fr: "Site de réservation", en: "Booking site" },
    tech: "React · Next.js",
    file: "app/reserver/Reservation.tsx",
    what: {
      fr: "La cliente choisit sa prestation, la date, le créneau et ajoute une photo de référence.",
      en: "The client picks a service, a date and a time slot, and adds a reference photo.",
    },
    code: `export function Reservation() {
  const [slot, setSlot] = useState<Slot | null>(null);

  async function confirm() {
    await fetch("/api/reservations", {
      method: "POST",
      body: JSON.stringify({ service, date, slot }),
    });
  }

  return <Calendar onPick={setSlot} />;
}`,
  },
  {
    layer: { fr: "API", en: "API" },
    name: { fr: "Webhook", en: "Webhook" },
    tech: "REST · JSON",
    file: "POST /api/reservations",
    what: {
      fr: "La demande part vers l'API, qui la valide et la transmet au reste du système.",
      en: "The request goes to the API, which validates it and passes it on to the rest of the system.",
    },
    code: `POST /api/reservations
{
  "service": "knotless",
  "date": "2026-12-05",
  "slot": "10:00"
}

→ 201 Created
{ "id": 482, "status": "pending" }`,
  },
  {
    layer: { fr: "Données", en: "Data" },
    name: { fr: "Base SQL", en: "SQL database" },
    tech: "Supabase · PostgreSQL",
    file: "reservations.sql",
    what: {
      fr: "La réservation est enregistrée en attente ; un créneau ne peut pas être pris deux fois.",
      en: "The booking is stored as pending; a time slot can't be taken twice.",
    },
    code: `insert into reservations
  (service, date, slot, status)
values
  ($1, $2, $3, 'pending')
returning id;

-- one slot = one booking
unique (date, slot)`,
  },
  {
    layer: { fr: "Agent IA", en: "AI agent" },
    name: { fr: "Assistante IA", en: "AI assistant" },
    tech: "LLM · tools",
    file: "agent.config",
    what: {
      fr: "Sur le site, WhatsApp, Telegram, Messenger ou Instagram, l'assistante répond et réserve avec les mêmes outils.",
      en: "On the website, WhatsApp, Telegram, Messenger or Instagram, the assistant answers and books with the same tools.",
    },
    code: `tools: [
  check_slots(date),
  create_booking(service, date, slot)
]

client: "Saturday morning, is that possible?"
agent  → check_slots("2026-12-05")
agent:  "Yes, 10 am is free. Shall I book it?"`,
  },
  {
    layer: { fr: "Automatisation", en: "Automation" },
    name: { fr: "Workflow", en: "Workflow" },
    tech: "n8n",
    file: "studio-nala.workflow",
    what: {
      fr: "La propriétaire valide d'un tap sur Telegram ; confirmation, agenda et rappels partent tout seuls.",
      en: "The owner approves with one tap on Telegram; confirmation, calendar and reminders go out on their own.",
    },
    code: `Webhook (new request)
  → Telegram: "Approve?"  [Yes] [No]
  → if yes:
      SMS + email confirmation
      add to calendar
      wait until D-1 → reminder
      wait until H-2 → reminder`,
  },
];

export type Layer = { layer: T; tools: string; proofs: string[] };

export const layers: Layer[] = [
  { layer: { fr: "Interface", en: "Interface" }, tools: "React · Next.js · React Native · Three.js", proofs: ["fraul", "studio-nala", "mamashop"] },
  { layer: { fr: "API", en: "API" }, tools: "REST · webhooks · JSON", proofs: ["studio-nala", "kelthen"] },
  { layer: { fr: "Données", en: "Data" }, tools: "SQL · PostgreSQL · Supabase", proofs: ["abo", "mamashop", "studio-nala"] },
  { layer: { fr: "Agents IA", en: "AI agents" }, tools: "WhatsApp · Telegram · Messenger · Instagram", proofs: ["studio-nala", "kelthen"] },
  { layer: { fr: "Automatisation", en: "Automation" }, tools: "n8n · Make · Zapier", proofs: ["studio-nala", "kelthen"] },
];
