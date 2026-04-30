import { API_BASE_URL } from "../config/api";
import { storageService } from "./storageService";

const API_URL = `${API_BASE_URL}/problems`;

export type Requirement = {
  id: number;
  description: string;
  fulfilled: boolean;
};

export async function getRequirements(problemId: number): Promise<Requirement[]> {
  const token = await storageService.getToken();
  const response = await fetch(`${API_URL}/${problemId}/requirements`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch requirements: ${response.status}`);
  }

  return response.json();
}

export async function addRequirement(problemId: number, description: string): Promise<Requirement> {
  const token = await storageService.getToken();
  const response = await fetch(`${API_URL}/${problemId}/requirements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    throw new Error(`Could not add requirement: ${response.status}`);
  }

  return response.json();
}

export async function toggleRequirement(problemId: number, requirementId: number): Promise<Requirement> {
  const token = await storageService.getToken();
  const response = await fetch(`${API_URL}/${problemId}/requirements/${requirementId}/toggle`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Could not toggle requirement: ${response.status}`);
  }

  return response.json();
}