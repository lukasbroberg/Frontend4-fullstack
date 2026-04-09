import { Category } from "../types/Category";
import { Problem } from "../types/Problem";
import { storageService } from "./storageService";

const API_URL = "http://localhost:8080/problems";

export type ProblemSort = "likesdesc" | "likesasc" | "datedesc" | "dateasc";

export async function getProblems(sort?: ProblemSort): Promise<Problem[]> {
  const token = await storageService.getToken();
  console.log("TOKEN sendt til backend:", token);
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const url = sort ? `${API_URL}?sort=${encodeURIComponent(sort)}` : API_URL;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Could not fetch problems: ${response.status}`);
  }

  return response.json();
}

export async function createProblem(title: string, description: string, category: Category) {
  const token = await storageService.getToken();
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      title,
      description,
      category
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
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not like problem: ${response.status}`); 
  }
}

export async function unlikeProblem(problemId: number, userId: number): Promise<void> {

  if(userId==null || problemId==null){
    return;
  }

  const response = await fetch(`${API_URL}/${problemId}/like/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not unlike problem: ${response.status}`);
  }
}

export async function deleteProblem(problemId: number): Promise<void> {
  const token = await storageService.getToken();
  if (!token) {
    throw new Error("Not logged in");
  }
  const response = await fetch(`${API_URL}/${problemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Could not delete problem: ${response.status}`);
  }
}
