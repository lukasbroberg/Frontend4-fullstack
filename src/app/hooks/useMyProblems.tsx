import { useEffect, useState } from "react";
import { deleteProblem, getMyProblems, likeProblem, unlikeProblem } from "../services/problemService";
import { Problem } from "../types/Problem";
import { useAuth } from "./AuthContext";

export default function useMyProblems(){

      const [problems, setProblems] = useState<Problem[]>([]);
      const [loading, setLoading] = useState(true);

      const {isAuthenticated, user} = useAuth();
    
      useEffect(() => {
        async function loadProblems() {
          try {
            setLoading(true);
            const data = await getMyProblems();
    
            const normalizedProblems = data.map((problem: Problem) => ({
              ...problem,
              username:
                problem.username ??
                (problem.createdByCurrentUser ? user?.username ?? null : null),
              createdByCurrentUser: true,
            }));
    
            setProblems(normalizedProblems);
          } catch (error) {
            console.error("ERROR LOADING MY PROBLEMS:", error);
          } finally {
            setLoading(false);
          }
        }
    
        if (isAuthenticated) {
          loadProblems();
        } else {
          setProblems([]);
          setLoading(false);
        }
      }, [isAuthenticated, user?.username]);
    
      const handleLikeToggle = async (problemId: number) => {
        const userId = user?.id;
        if (userId == null) return;
    
        const problem = problems.find((p) => p.id === problemId);
        if (!problem) return;
    
        try {
          if (problem.likedByUser) {
            await unlikeProblem(problemId);
          } else {
            await likeProblem(problemId);
          }
    
          setProblems((prev) =>
            prev.map((p) =>
              p.id === problemId
                ? {
                    ...p,
                    likedByUser: !p.likedByUser,
                    likeCount: p.likedByUser ? p.likeCount - 1 : p.likeCount + 1,
                  }
                : p
            )
          );
        } catch (error) {
          console.error("Fejl ved like/unlike:", error);
        }
      };
    
      const handleDelete = async (problemId: number) => {
        try {
          await deleteProblem(problemId);
          setProblems((prev) => prev.filter((p) => p.id !== problemId));
        } catch (error) {
          console.error("Fejl ved sletning:", error);
        }
      };

      return {
        problems, setProblems, loading, setLoading,
        handleLikeToggle, handleDelete
      }
}