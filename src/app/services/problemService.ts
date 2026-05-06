import { API_BASE_URL } from "../config/api";
import { Category } from "../types/Category";
import { Problem } from "../types/Problem";
import { storageService } from "./storageService";

const API_URL = `${API_BASE_URL}/problems`;

export type ProblemSort = "likesdesc" | "likesasc" | "datedesc" | "dateasc";

/**
 * Fetches all problems, optionally sorted.
 * @param sort - Optional sort order.
 * @returns List of problems.
 */
export async function getProblems(sort?: ProblemSort): Promise<Problem[]> {
  const token = await storageService.getToken();
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

/**
 * Creates a new problem with an optional image.
 * @param title - Problem title.
 * @param description - Problem description.
 * @param category - Selected category.
 * @param image - Optional image file.
 */
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
    JSON.stringify({
      title,
      description,
      category,
    })
  );

  if (image) {
    if (image.file) {
      formData.append("image", image.file);
    } else {
      const imageUri = image.uri;
      const fileName = image.fileName ?? imageUri.split("/").pop() ?? "problem.jpg";
      const fileType = image.mimeType ?? "image/jpeg";

      formData.append("image", {
        uri: imageUri,
        name: fileName,
        type: fileType,
      } as any);
    }
  }

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

/**
 * Likes a problem on behalf of the current user.
 * @param problemId - ID of the problem to like.
 */
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

/**
 * Removes the current user's like from a problem.
 * @param problemId - ID of the problem to unlike.
 */
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


/**
 * Deletes a problem. Requires authentication.
 * @param problemId - ID of the problem to delete.
 */
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
    const errorText = await response.text();
    throw new Error(`Could not delete problem: ${response.status} - ${errorText}`);
  }
}

/**
 * Updates a problem's title, description, and category.
 * @param id - ID of the problem to update.
 * @param title - New title.
 * @param description - New description.
 * @param category - New category.
 */
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
/**
 * Fetches all problems created by the current user.
 * @returns List of the user's own problems.
 */
export async function getMyProblems() {
  const token = await storageService.getToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  const response = await fetch(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch my problems: ${response.status}`);
  }

  return response.json();
}
