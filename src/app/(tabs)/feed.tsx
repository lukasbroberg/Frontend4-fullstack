import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ProblemCard from "../components/ProblemCard";
import { useAuth } from "../contexts/AuthContext";
import CategoryService from "../services/categoryService";
import {
  deleteProblem,
  getProblems,
  likeProblem,
  ProblemSort,
  unlikeProblem,
} from "../services/problemService";
import { Category } from "../types/Category";
import { Problem } from "../types/Problem";

const SORT_OPTIONS: { label: string; value: ProblemSort }[] = [
  { label: "Flest likes", value: "likesdesc" },
  { label: "Faerrest likes", value: "likesasc" },
  { label: "Nyeste", value: "datedesc" },
  { label: "Aeldste", value: "dateasc" },
];

export default function Feed() {
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
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, [selectedSort]);

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        style={styles.container}
        data={filteredProblems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProblemCard problem={item} onLikeToggle={handleLikeToggle} onDelete={handleDelete} />
        )}
        nestedScrollEnabled={true}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View ref={dropdownRef} collapsable={false} style={styles.dropdownWrapper}>
              <TouchableOpacity style={styles.dropdownButton} onPress={openDropdown}>
                <Text style={styles.dropdownButtonText} numberOfLines={1}>
                  {selectedCategory ? selectedCategory.name : "Alle kategorier"}
                </Text>
                <Text style={styles.dropdownArrow}>{dropdownOpen ? "▲" : "▼"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sortContainer}>
              {SORT_OPTIONS.map((option) => {
                const isSelected = selectedSort === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.sortButton, isSelected && styles.sortButtonSelected]}
                    onPress={() => handleSortPress(option.value)}
                  >
                    <Text style={[styles.sortButtonText, isSelected && styles.sortButtonTextSelected]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Ingen problemer endnu.</Text>
          </View>
        }
        contentContainerStyle={
          problems.length === 0 ? styles.fullHeight : styles.listContent
        }
      />

      <Modal visible={dropdownOpen} transparent animationType="none" onRequestClose={() => setDropdownOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setDropdownOpen(false)}>
          <View style={StyleSheet.absoluteFillObject}>
            <View
              style={[
                styles.dropdownList,
                {
                  top: dropdownLayout.y + dropdownLayout.height + 4,
                  left: dropdownLayout.x,
                  width: dropdownLayout.width,
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.dropdownItem, selectedCategory === null && styles.dropdownItemActive]}
                onPress={() => { setSelectedCategory(null); setDropdownOpen(false); }}
              >
                <Text style={[styles.dropdownItemText, selectedCategory === null && styles.dropdownItemTextActive]}>
                  Alle kategorier
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  style={[styles.dropdownItem, selectedCategory?.name === cat.name && styles.dropdownItemActive]}
                  onPress={() => { setSelectedCategory(cat); setDropdownOpen(false); }}
                >
                  <Text style={[styles.dropdownItemText, selectedCategory?.name === cat.name && styles.dropdownItemTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  listContent: {
    padding: 16,
  },
  fullHeight: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    padding: 12,
    gap: 10,
    alignItems: "center",
  },
  dropdownWrapper: {
    width: 180,
    alignSelf: "flex-start",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownButtonText: {
    fontSize: 13,
    color: "#1f2937",
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
    color: "#6b7280",
    marginLeft: 6,
  },
  dropdownList: {
    position: "absolute",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownItemActive: {
    backgroundColor: "#ede9fe",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#1f2937",
  },
  dropdownItemTextActive: {
    color: "#4f46e5",
    fontWeight: "600",
  },
  sortContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignSelf: "flex-start",
  },
  sortButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  sortButtonSelected: {
    backgroundColor: "#4f46e5",
  },
  sortButtonText: {
    color: "#1f2937",
    fontSize: 12,
    fontWeight: "600",
  },
  sortButtonTextSelected: {
    color: "#ffffff",
  },
  uploadButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});
