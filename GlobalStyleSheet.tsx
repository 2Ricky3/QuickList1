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
    backgroundColor: colors.white,
  },

  scrollContent: {
    padding: 20,
  },

  headerContainer: {
    marginBottom: 12,
  },

  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },

  dateText: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },

  statsCard: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  statsTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 8,
  },

  statsText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },

  optionsText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
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
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },

  previousBuysSubtitle: {
    color: "#555",
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },

  newListSubtitle: {
    color: "#f3f3f3",
    fontSize: 16,
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
