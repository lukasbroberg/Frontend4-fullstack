import { Problem } from "../types/Problem";

// Skift denne URL til din servers IP når I tester på fysisk enhed
// Android emulator: http://10.0.2.2:8080
// iOS simulator:    http://localhost:8080
// Fysisk enhed:     http://<din-computer-ip>:8080
const BASE_URL = "http://localhost:8080";

// --- Hent alle problemer fra backend ---
export async function getProblems(): Promise<Problem[]> {
  const response = await fetch(`${BASE_URL}/problems`);
  if (!response.ok) throw new Error("Kunne ikke hente problemer");
  const data = response.json();
  console.log(data);
  return data;
}

// --- Mock data (bruges hvis backend ikke er klar) ---
// export async function getProblems(): Promise<Problem[]> {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   return mockProblems;
// }

// const mockProblems: Problem[] = [
//   { id: 1, title: "Svært at finde parkering i byen", description: "Hver dag bruger jeg 20 minutter på at finde en parkeringsplads.", createdAt: "2026-03-08T08:30:00" },
//   { id: 2, title: "Madspild i supermarkeder", description: "Supermarkeder smider enorme mængder mad ud dagligt.", createdAt: "2026-03-07T14:15:00" },
//   { id: 3, title: "Svært at holde styr på sine abonnementer", description: "Jeg har mistet overblikket over hvad jeg betaler for hver måned.", createdAt: "2026-03-06T19:00:00" },
//   { id: 4, title: "Lange ventetider hos lægen", description: "Det tager ofte 2-3 uger at få en tid hos egen læge.", createdAt: "2026-03-05T11:45:00" },
//   { id: 5, title: "Ingen cykelstier på landet", description: "I mange landsbyområder er der ingen cykelstier.", createdAt: "2026-03-04T09:00:00" },
//   { id: 6, title: "Svært at lære et nyt sprog som voksen", description: "Der er mange apps og kurser, men ingen der tilpasser sig mit niveau.", createdAt: "2026-03-03T16:30:00" },
//   { id: 7, title: "Offentlig transport kører ikke sent om aftenen", description: "Busser og tog holder op med at køre efter kl. 22.", createdAt: "2026-03-02T21:00:00" },
//   { id: 8, title: "Svært at finde frivilligt arbejde der passer til ens kompetencer", description: "Det er svært at finde en organisation der har brug for mine kompetencer.", createdAt: "2026-03-01T13:15:00" },
// ];
