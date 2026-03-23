import { Problem } from "../types/Problem";

const API_URL = "http://localhost:8080/problems";

export async function getProblems(): Promise<Problem[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Could not fetch problems: ${response.status}`);
  }

  return response.json();
}

export async function createProblem(title: string, description: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error(`Could not create problem: ${response.status}`);
  }

  return response.json();
}

export async function likeProblem (problemId: number, userId: number): Promise<void> {
  const response = await fetch (`${API_URL}/${problemId}/like/${userId}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Could not like problem: ${response.status}`); 
  }
}

export async function unlikeProblem(problemId: number, userId: number): Promise<void> {
  const response = await fetch(`${API_URL}/${problemId}/like/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Could not unlike problem: ${response.status}`);
  }
}
