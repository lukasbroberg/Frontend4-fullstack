import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import CategoryService from "../services/categoryService";
import { deleteProblem, getProblems, likeProblem, ProblemSort, unlikeProblem } from "../services/problemService";
import { Category } from "../types/Category";
import { Problem } from "../types/Problem";
import { useAuth } from "./AuthContext";

export default function useFeed(){
    const [loading, setLoading] = useState(true);
      const [problems, setProblems] = useState<Problem[]>([]);
      const [selectedSort, setSelectedSort] = useState<ProblemSort | undefined>(undefined);
      const [categories, setCategories] = useState<Category[]>([]);
      const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
      const dropdownRef = useRef<View>(null);
    
      const { user } = useAuth();
    
      const filteredProblems = selectedCategory === null
        ? problems
        : problems.filter((p) => p.category?.name === selectedCategory.name);
    
      useEffect(() => {
        async function loadCategories() {
          try {
            const { getAllCategories } = CategoryService();
            const data = await getAllCategories();
            setCategories(data);
          } catch (error) {
            console.error("Category fetch FAILED:", error);
          }
        }
        loadCategories();
      }, []);
    
      useEffect(() => {
        async function loadProblems() {
          try {
            setLoading(true);
            const data = await getProblems(selectedSort);
            const normalizedProblem = data.map((problem) => ({
              ...problem, 
              username:
                problem.username??
                (problem.createdByCurrentUser ? user?.username ?? null : null),
            }));
    
            setProblems(normalizedProblem);
          } catch (error) {
            console.error("Failed to fetch problems:", error);
          } finally {
            setLoading(false);
          }
        }
        loadProblems();
      }, [selectedSort, user?.username]);
    
      const handleSortPress = (sortValue: ProblemSort) => {
        setSelectedSort((prev) => (prev === sortValue ? undefined : sortValue));
      };
    
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
    
      const openDropdown = () => {
        dropdownRef.current?.measureInWindow((x, y, width, height) => {
          setDropdownLayout({ x, y, width, height });
          setDropdownOpen(true);
        });
      };

      return {
        loading, problems, selectedSort, categories, selectedCategory,
        dropdownOpen, dropdownLayout, dropdownRef, filteredProblems,

        setDropdownOpen, setSelectedCategory,
        handleSortPress, handleLikeToggle, handleDelete, openDropdown
      }
}