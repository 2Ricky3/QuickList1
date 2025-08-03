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
    padding: 24,
    backgroundColor: colors.white,
    justifyContent: "center",
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
    borderWidth: 1,
    borderColor: colors.gray,
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

});
