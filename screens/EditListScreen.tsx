import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { updateList } from "../services/listService";
import { 
  globalStyles, 
  colors, 
  createScreenStyles, 
  spacing, 
  borderRadius,
  elevation,
  typography,
  getTagColor
} from "../GlobalStyleSheet";
import { ModernLoader } from "../components/ModernLoader";
import { SwipeableInput } from "../components/SwipeableInput";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { FAB } from "../components/FAB";
import { ColorDisplay, getColorValue } from "../components/ColorDisplay";
import * as Haptics from "expo-haptics";

const EditListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { list } = route.params as { list: any };

  const [title, setTitle] = useState(list.title);
  const [items, setItems] = useState<string[]>(list.items || []);
  const [tags, setTags] = useState((list.tags || []).join(", "));
  const [allowPublicEdit, setAllowPublicEdit] = useState(
    list.allowPublicEdit ?? false
  );
  const [saving, setSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const listColor = getColorValue(list.color, colors.primary);

  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems([...items, ""]);
  };

  const handleItemChange = (text: string, index: number) => {
    const newItems = [...items];
    newItems[index] = text;
    setItems(newItems);
  };

  const handleDeleteItem = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [""]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a list title.");
      return;
    }

    const filteredItems = items.filter((item) => item.trim() !== "");
    if (filteredItems.length === 0) {
      Alert.alert("Error", "Please add at least one item.");
      return;
    }

    setSaving(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== "");

      await updateList(list.id, {
        title: title.trim(),
        items: filteredItems,
        tags: tagsArray,
        allowPublicEdit: allowPublicEdit,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "List updated successfully!");
      navigation.goBack();
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to update list.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
        >
         
          <View style={{ alignItems: "center", marginBottom: spacing.xxl }}>
            <ColorDisplay
              colorData={list.color}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                marginBottom: spacing.md,
                borderWidth: 3,
                borderColor: colors.border,
              }}
              fallbackColor={colors.primary}
            />
            <Text style={[typography.h2, { color: listColor, marginBottom: spacing.xs }]}>
              Edit List
            </Text>
            <Text style={{ color: colors.textMedium, fontSize: 14 }}>
              Make changes to your grocery list
            </Text>
          </View>

          
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="title" size={20} color={listColor} />
              <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                List Title
              </Text>
            </View>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Weekly Groceries"
              placeholderTextColor={colors.textLight}
              onFocus={() => setFocusedInput('title')}
              onBlur={() => setFocusedInput(null)}
              style={[
                globalStyles.inputField,
                focusedInput === 'title' && globalStyles.inputFieldFocused
              ]}
              returnKeyType="next"
            />
          </View>

          
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="shopping-cart" size={20} color={listColor} />
                <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                  Items ({items.filter(i => i.trim()).length})
                </Text>
              </View>
              <Pressable 
                onPress={handleAddItem}
                style={{ 
                  flexDirection: "row", 
                  alignItems: "center",
                  backgroundColor: `${listColor}15`,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.md,
                }}
              >
                <MaterialIcons name="add" size={18} color={listColor} />
                <Text style={{ color: listColor, fontWeight: "600", fontSize: 13, marginLeft: 2 }}>
                  Add
                </Text>
              </Pressable>
            </View>
            {items.map((item, index) => (
              <SwipeableInput
                key={index}
                value={item}
                onChangeText={(text) => handleItemChange(text, index)}
                onDelete={() => handleDeleteItem(index)}
                isFocused={focusedInput === `item-${index}`}
                onFocus={() => setFocusedInput(`item-${index}`)}
                onBlur={() => setFocusedInput(null)}
                placeholder={`Item ${index + 1}`}
                placeholderTextColor={colors.textLight}
                returnKeyType="done"
              />
            ))}
          </View>

          
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="label" size={20} color={listColor} />
              <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                Tags (Optional)
              </Text>
            </View>
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="e.g., groceries, weekly"
              placeholderTextColor={colors.textLight}
              onFocus={() => setFocusedInput('tags')}
              onBlur={() => setFocusedInput(null)}
              style={[
                globalStyles.inputField,
                focusedInput === 'tags' && globalStyles.inputFieldFocused
              ]}
              autoCapitalize="none"
              returnKeyType="done"
            />
            
            
            {tags.trim().length > 0 && (
              <View style={{ 
                flexDirection: "row", 
                flexWrap: "wrap", 
                gap: spacing.sm, 
                marginTop: spacing.md 
              }}>
                {tags.split(",").map((tag: string, index: number) => {
                  const trimmedTag = tag.trim();
                  if (!trimmedTag) return null;
                  const tagColor = getTagColor(trimmedTag);
                  return (
                    <View 
                      key={index}
                      style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs,
                        borderRadius: borderRadius.xl,
                        borderWidth: 1.5,
                        backgroundColor: tagColor.bg,
                        borderColor: tagColor.border,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <View style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: 4, 
                        backgroundColor: tagColor.border 
                      }} />
                      <Text style={{ 
                        fontSize: 12, 
                        fontWeight: "600", 
                        color: tagColor.text 
                      }}>
                        {trimmedTag}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

        
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="settings" size={20} color={listColor} />
              <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                Settings
              </Text>
            </View>
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "space-between",
              paddingVertical: spacing.sm,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: "600", 
                  color: colors.textDark,
                  marginBottom: 2,
                }}>
                  Allow Public Edit
                </Text>
                <Text style={{ fontSize: 13, color: colors.textMedium }}>
                  Anyone with the share code can edit
                </Text>
              </View>
              <Switch
                value={allowPublicEdit}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAllowPublicEdit(value);
                }}
                thumbColor={allowPublicEdit ? listColor : "#f4f3f4"}
                trackColor={{ false: "#767577", true: `${listColor}80` }}
              />
            </View>
          </View>

         
          {list.shareId && (
            <View style={{
              backgroundColor: `${listColor}10`,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              borderWidth: 1.5,
              borderColor: `${listColor}30`,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
                <MaterialIcons name="info-outline" size={18} color={listColor} />
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: "600", 
                  color: listColor,
                  marginLeft: spacing.xs,
                }}>
                  Share Code
                </Text>
              </View>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: "700", 
                color: listColor,
                letterSpacing: 1,
              }}>
                {list.shareId}
              </Text>
            </View>
          )}

          
          <Pressable
            style={{ paddingVertical: spacing.lg, alignItems: "center", marginTop: spacing.md }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: colors.textMedium, fontSize: 15, fontWeight: "500" }}>
              Cancel
            </Text>
          </Pressable>
        </ScrollView>
        
       
        <FAB 
          onPress={handleSave}
          icon="check"
          disabled={saving}
          loading={saving}
        />

        
        <View style={createScreenStyles.bottomBar}>
          <AnimatedPressable
            style={[
              globalStyles.buttonContainer, 
              globalStyles.buttonContainerSecondary,
              createScreenStyles.bottomButton,
              { flex: 1 }
            ]}
            onPress={handleAddItem}
          >
            <MaterialIcons name="add" size={20} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[globalStyles.buttonTextSecondary, { fontSize: 15, fontWeight: "600" }]}>
              Add Item
            </Text>
          </AnimatedPressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default EditListScreen;
