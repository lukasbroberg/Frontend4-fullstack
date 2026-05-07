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
import useFeed from "../hooks/useFeed";
import {
  ProblemSort
} from "../services/problemService";

const SORT_OPTIONS: { label: string; value: ProblemSort }[] = [
  { label: "Flest likes", value: "likesdesc" },
  { label: "Færrest likes", value: "likesasc" },
  { label: "Nyeste", value: "datedesc" },
  { label: "Ældste", value: "dateasc" },
];

export default function Feed() {
  const {
    loading, problems, selectedSort, categories, selectedCategory,
    dropdownOpen, dropdownLayout, dropdownRef, filteredProblems, 
    setDropdownOpen, setSelectedCategory,
    handleSortPress, handleLikeToggle, handleDelete, openDropdown
  } = useFeed();
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /** Actual feed page
   * 
   */
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
