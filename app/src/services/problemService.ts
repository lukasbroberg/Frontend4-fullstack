import { Problem } from "../types/Problem";

// Skift denne URL til din servers IP når backend er klar
// Android emulator: http://10.0.2.2:8080
// iOS simulator:    http://localhost:8080
// Fysisk enhed:     http://<din-computer-ip>:8080
const BASE_URL = "http://localhost:8080";

// --- Mock data (bruges indtil login/auth er klar) ---
const mockProblems: Problem[] = [
  {
    id: 1,
    title: "Svært at finde parkering i byen",
    description:
      "Hver dag bruger jeg 20 minutter på at finde en parkeringsplads i nærheden af mit arbejde. Det er frustrerende og spild af tid.",
    createdAt: "2026-03-08T08:30:00",
  },
  {
    id: 2,
    title: "Madspild i supermarkeder",
    description:
      "Supermarkeder smider enorme mængder mad ud dagligt. Der burde være en bedre måde at fordele overskudsmad til dem der har brug for det.",
    createdAt: "2026-03-07T14:15:00",
  },
  {
    id: 3,
    title: "Svært at holde styr på sine abonnementer",
    description:
      "Jeg har så mange streaming- og app-abonnementer at jeg har mistet overblikket over hvad jeg betaler for hver måned.",
    createdAt: "2026-03-06T19:00:00",
  },
  {
    id: 4,
    title: "Lange ventetider hos lægen",
    description:
      "Det tager ofte 2-3 uger at få en tid hos egen læge, selvom problemet er akut men ikke akut nok til skadestuen.",
    createdAt: "2026-03-05T11:45:00",
  },
  {
    id: 5,
    title: "Ingen cykelstier på landet",
    description:
      "I mange landsbyområder er der ingen cykelstier, så det er farligt at cykle langs de store veje. Børn kan ikke cykle sikkert til skole.",
    createdAt: "2026-03-04T09:00:00",
  },
  {
    id: 6,
    title: "Svært at lære et nyt sprog som voksen",
    description:
      "Der er mange apps og kurser, men ingen der tilpasser sig mit niveau og tempo på en smart måde. Jeg giver op efter få uger.",
    createdAt: "2026-03-03T16:30:00",
  },
  {
    id: 7,
    title: "Offentlig transport kører ikke sent om aftenen",
    description:
      "Busser og tog holder op med at køre efter kl. 22 i mange områder. Det tvinger folk til at tage taxa eller bil, selvom de gerne vil bruge offentlig transport.",
    createdAt: "2026-03-02T21:00:00",
  },
  {
    id: 8,
    title: "Svært at finde frivilligt arbejde der passer til ens kompetencer",
    description:
      "Jeg vil gerne bidrage til samfundet som frivillig, men det er svært at finde en organisation der har brug for præcis de kompetencer jeg har.",
    createdAt: "2026-03-01T13:15:00",
  },
];

// --- Hent alle problemer (mock) ---
export async function getProblems(): Promise<Problem[]> {
  // Simulerer netværksforsinkelse
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProblems;
}

// --- Slet et problem (mock) ---
export const deleteProblem = async (id: number) => {
  const response = await fetch(`${BASE_URL}/problems/${id}`, {
    method: "DELETE",
  });
  console.log("Delete status:", response.status);
  console.log("Delete ok:", response.ok);
  if (!response.ok) {
    throw new Error("Kunne ikke slette problemstilling");
  }
};

// --- Rigtig API (aktivér når auth er klar) ---
// export async function getProblems(token: string): Promise<Problem[]> {
//   const response = await fetch(`${BASE_URL}/problems`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!response.ok) throw new Error("Kunne ikke hente problemer");
//   return response.json();
// }
