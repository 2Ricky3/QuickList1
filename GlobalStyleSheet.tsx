import { StyleSheet } from "react-native";

export const colors = {
  primary: "#C20200",
  dark: "#520600",
  gray: "#736F73",
  white: "#FFFFFF",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
    justifyContent: "center",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "transparent", 
  },

  scrollContent: {
    padding: 20,
  },

  headerContainer: {
    marginBottom: 12,
  },

  greetingText: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.dark,
    letterSpacing: 0.5,
  },

  dateText: {
    fontSize: 18,
    color: colors.gray,
    marginTop: 6,
    letterSpacing: 0.3,
  },

  statsCard: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#ffffffcc", 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  statsTitle: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 12,
    color: colors.dark,
    letterSpacing: 0.5,
  },

  statsText: {
    fontSize: 15,
    color: colors.gray,
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  optionsText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 20,
    letterSpacing: 0.4,
  },

  optionsContainer: {
    gap: 20,
  },

  previousBuysButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  previousBuysTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 0.6,
  },

  previousBuysSubtitle: {
    color: colors.gray,
    fontSize: 16,
    lineHeight: 22,
  },

  newListButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  newListTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 0.6,
  },

  newListSubtitle: {
    color: "#f0f0f0",
    fontSize: 16,
    lineHeight: 22,
  },

  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },

  inputField: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
    color: colors.dark,
  },

  buttonContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },

  buttonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },

  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: colors.gray,
    fontSize: 14,
  },

  footerLink: {
    color: colors.primary,
    fontWeight: "600",
  },

  formWrapper: {
    paddingHorizontal: 24,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },

  inputFieldSmall: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
    color: colors.dark,
  },

  buttonContainerSmall: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },

  buttonTextSmall: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export const createScreenStyles = StyleSheet.create({
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  deleteButton: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 48,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderColor: colors.primary,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 8,
    marginHorizontal: 4,
    marginTop: -6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "95%",
    alignSelf: "center",
    maxHeight: 140,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
export const previousListStyles = StyleSheet.create({
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    flexShrink: 0,
  },
  shareCodeContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  shareCodeInput: {
    flex: 1,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    height: 44,
    marginRight: 8,
  },
  shareCodeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  shareCodeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  tagsFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "transparent",
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonSelected: {
    backgroundColor: colors.primary,
  },
  tagButtonText: {
    color: colors.primary,
  },
  tagButtonTextSelected: {
    color: "#fff",
  },
  listsScrollView: {
    flex: 1,
  },
  listCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: colors.primary,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  listCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    flex: 1,
  },
  listCardButtons: {
    flexDirection: "row",
    gap: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tagBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagBadgeText: {
    color: "#fff",
    fontSize: 12,
  },
});
export const onboardingStyles = StyleSheet.create({
  skipContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginTop: 8,
  },
  skipText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
    opacity: 0.8,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    width: "85%",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 28,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    textAlign: "center",
    paddingHorizontal: 8,
    marginBottom: 8,
    lineHeight: 22,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    margin: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

