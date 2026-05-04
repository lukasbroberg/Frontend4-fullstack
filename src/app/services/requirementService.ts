// Henter base URL fra config (f.eks. http://130.225.170.63:8080)
import { API_BASE_URL } from "../config/api";
// Henter storageService så vi kan få fat i JWT token
import { storageService } from "./storageService";

// Bygger URL'en til problems endpoint
const API_URL = `${API_BASE_URL}/problems`;

// Definerer hvordan et requirement objekt ser ud
export type Requirement = {
  id: number;        // Unikt ID fra databasen
  description: string; // Teksten på kravet
  fulfilled: boolean;  // Om kravet er opfyldt eller ej
};

// Henter alle requirements for et givent problem
export async function getRequirements(problemId: number): Promise<Requirement[]> {
  // Henter brugerens JWT token fra storage
  const token = await storageService.getToken();
  console.log("Requirements token:", token); // ← tilføj denne linje

  
  // Sender GET request til /problems/{problemId}/requirements
  const response = await fetch(`${API_URL}/${problemId}/requirements`, {
    headers: {
      // Tilføjer Authorization header hvis token findes
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Kaster fejl hvis serveren svarer med fejl
  if (!response.ok) {
    throw new Error(`Could not fetch requirements: ${response.status}`);
  }

  // Returnerer listen af requirements som JSON
  return response.json();
}

// Tilføjer et nyt requirement til et problem (kun ejeren kan dette)
export async function addRequirement(problemId: number, description: string): Promise<Requirement> {
  const token = await storageService.getToken();

  // Sender POST request med description i body
  const response = await fetch(`${API_URL}/${problemId}/requirements`, {
    method: "POST",
    headers: {
      // Fortæller serveren at vi sender JSON
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // Sender description som JSON i body
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    throw new Error(`Could not add requirement: ${response.status}`);
  }

  // Returnerer det nyoprettede requirement
  return response.json();
}

// Toggler fulfilled på et requirement (true -> false eller false -> true)
export async function toggleRequirement(problemId: number, requirementId: number): Promise<Requirement> {
  const token = await storageService.getToken();

  // Sender PATCH request til /problems/{problemId}/requirements/{requirementId}/toggle
  const response = await fetch(`${API_URL}/${problemId}/requirements/${requirementId}/toggle`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Could not toggle requirement: ${response.status}`);
  }

  // Returnerer det opdaterede requirement med ny fulfilled værdi
  return response.json();
}

export default { getRequirements, addRequirement, toggleRequirement };