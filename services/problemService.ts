import { API_BASE_URL } from "./config/api";
import { Category } from "../types/Category";
import { Problem } from "../types/Problem";
import { storageService } from "./storageService";

const API_URL = `${API_BASE_URL}/problems`;

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

export async function createProblem(
  title: string,
  description: string,
  category: Category,
  image?: any
) {
  const token = await storageService.getToken();

  const formData = new FormData();

  formData.append(
    "problem",
    new Blob(
      [
        JSON.stringify({
          title,
          description,
          category,
        }),
      ],
      { type: "application/json" }
    )
  );

  if (image) {
    if (image.file) {
      formData.append("image", image.file);
    } else {
      formData.append("image", {
        uri: image.uri,
        name: image.fileName ?? "problem.jpg",
        type: image.mimeType ?? "image/jpeg",
      } as any);
    }
  }
  console.log("token in createProblem:", token);
  console.log("API_URL:", API_URL);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Could not create problem: ${response.status}`);
  }

  return response.json();
}

export async function likeProblem (problemId: number): Promise<void> {
  const token = await storageService.getToken();
  const response = await fetch (`${API_URL}/${problemId}/like`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}), //
    },
  });

  if (!response.ok) {
    throw new Error(`Could not like problem: ${response.status}`); 
  }
}

export async function unlikeProblem(problemId: number): Promise<void> {
  const token = await storageService.getToken();
  const response = await fetch(`${API_URL}/${problemId}/like`,{
    method: "DELETE", 
    headers: {
      ...(token ? { Authorization: `Bearer ${token}`} : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Could not unlike problem: ${response.status}`);
  }
}


export async function deleteProblem(problemId: number): Promise<void> {
  const token = await storageService.getToken();
  console.log("token in deleteProblem:", token);

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
    const errorText = await response.text();
    console.log("deleteProblem status:", response.status);
    console.log("deleteProblem body:", errorText);
    throw new Error(`Could not delete problem: ${response.status} - ${errorText}`);
  }
}

export async function updateProblem(id: number, title: string, description: string, category: Category) {
  const token = await storageService.getToken();
  if (!token){
    throw new Error ("Not logged in");
  }

  const response = await fetch(`${API_URL}/${id}`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({title, description, category}),
  });

  if (!response.ok) {
    throw new Error(`Could not update problem: ${response.status}`);
  }
}
/* create function get Http://localhost:8080/problems/my*/
export async function getMyProblems() {
  const token = await storageService.getToken();
  console.log("TOKEN in getMyProblems:", token);

  if (!token) {
    throw new Error("Not logged in");
  }

  const response = await fetch(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("STATUS /my:", response.status);

  if (!response.ok) {
    throw new Error(`Could not fetch my problems: ${response.status}`);
  }

  return response.json();
}
