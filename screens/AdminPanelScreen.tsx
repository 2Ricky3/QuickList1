import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getAllUsers, deleteAllUsersFromFirestore, deleteIndividualUser } from "../services/adminService";
import { Toast } from "../components/Toast";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, typography, spacing, borderRadius, elevation } from "../GlobalStyleSheet";
import { PrimaryButton } from "../components/PrimaryButton";

type Props = NativeStackScreenProps<any, "AdminPanel">;

interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: any;
}

/**
 * TEST ONLY - Admin Panel Screen
 * Remove before production
 */
const AdminPanelScreen: React.FC<Props> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info" | "warning">("success");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      showToast("Error loading users", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleDeleteAllUsers = () => {
    Alert.alert(
      "Delete All Users",
      `This will permanently delete all ${users.length} users from the database. This action cannot be undone.`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete All",
          onPress: confirmDeleteAll,
          style: "destructive",
        },
      ]
    );
  };

  const confirmDeleteAll = async () => {
    try {
      setDeleting(true);
      const count = await deleteAllUsersFromFirestore();
      showToast(`Deleted ${count} users`, "success");
      loadUsers();
    } catch (error) {
      showToast("Error deleting users", "error");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteUser = (userId: string, userEmail: string) => {
    Alert.alert(
      "Delete User",
      `Delete user: ${userEmail}?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteIndividualUser(userId);
              showToast("User deleted", "success");
              loadUsers();
            } catch (error) {
              showToast("Error deleting user", "error");
              console.error(error);
            } finally {
              setDeleting(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={[typography.bodyBold, { color: colors.textDark, marginBottom: spacing.sm }]}>
          {item.displayName}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textMedium, marginBottom: spacing.sm }]}>
          {item.email}
        </Text>
        <Text style={[typography.caption, { color: colors.textLight }]}>
          ID: {item.id.substring(0, 12)}...
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item.id, item.email)}
        disabled={deleting}
      >
        <Text style={[typography.caption, { color: colors.white, fontWeight: "600" }]}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScreenHeader
        title="Admin Panel"
        subtitle="TEST ONLY - Remove before production"
        showBackButton={false}
        centered={true}
      />

      <View style={{ flex: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.xl }}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={[typography.h2, { color: colors.primary, marginBottom: spacing.sm }]}>
              {users.length}
            </Text>
            <Text style={[typography.bodySmall, { color: colors.textMedium }]}>
              Total Users
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: spacing.lg, marginBottom: spacing.xl }}>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              title={deleting ? "Deleting..." : `Delete All (${users.length})`}
              onPress={handleDeleteAllUsers}
              disabled={deleting || users.length === 0}
              variant="danger"
              size="medium"
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              title="Refresh"
              onPress={loadUsers}
              disabled={deleting}
              variant="secondary"
              size="medium"
            />
          </View>
        </View>

        {/* Users List */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : users.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={[typography.body, { color: colors.textMedium }]}>
              No users in database
            </Text>
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: spacing.md }}
            scrollEnabled={true}
          />
        )}
      </View>

      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        duration={3000}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...elevation.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.sm,
  },
  userInfo: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.lg,
  },
});

export default AdminPanelScreen;
