import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Switch,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { updateList, ListItem } from "../services/listService";
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
import { SwipeableInput } from "../components/SwipeableInput";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { PrimaryButton } from "../components/PrimaryButton";
import { FAB } from "../components/FAB";
import { ColorDisplay, getColorValue } from "../components/ColorDisplay";
import { haptic } from "../utils/haptics";
import { useEntranceAnimation } from "../hooks/useEntranceAnimation";
import { useShake } from "../hooks/useShake";
import { logFirestoreError } from "../services/errorLogger";
import { validateListName, validateItemsArray, validateTagsArray, sanitizeString } from "../utils/validation";
const EditListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { list } = route.params as { list: any };
  const [title, setTitle] = useState(list.title);
  const [items, setItems] = useState<(string | ListItem)[]>(list.items || []);
  const [tags, setTags] = useState((list.tags || []).join(", "));
  const [allowPublicEdit, setAllowPublicEdit] = useState(
    list.allowPublicEdit ?? false
  );
  const [saving, setSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const listColor = getColorValue(list.color, colors.primary);
  const [headerStyle, titleStyle, itemsStyle, tagsStyle, settingsStyle] =
    useEntranceAnimation({ count: 5 });
  const { shake, shakeStyle } = useShake();

  // Helper function to get item display name
  const getItemDisplay = (item: any): string => {
    if (typeof item === 'string') return item;
    const { name, quantity, unit } = item;
    if (!quantity || quantity === 1) {
      return unit ? `${name} ${unit}` : name;
    }
    return unit ? `${name} x${quantity} ${unit}` : `${name} x${quantity}`;
  };

  // Helper function to get item name for editing
  const getItemName = (item: any): string => {
    return typeof item === 'string' ? item : (item.name || '');
  };
  const handleAddItem = () => {
    setItems([...items, ""]);
  };
  const handleItemChange = (text: string, index: number) => {
    const newItems = [...items];
    newItems[index] = text;
    setItems(newItems);
  };
  const handleDeleteItem = async (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [""]);
  };
  const handleSave = async () => {
    const sanitizedTitle = sanitizeString(title.trim());
    const filteredItems = items.filter((item) => {
      const name = getItemName(item);
      return name.trim() !== "";
    });
    const sanitizedItems = filteredItems.map(item => {
      const name = getItemName(item);
      return sanitizeString(name);
    });
    const tagsArray = tags
      .split(",")
      .map((tag: string) => sanitizeString(tag.trim()))
      .filter((tag: string) => tag !== "");
    const titleValidation = validateListName(sanitizedTitle);
    if (!titleValidation.isValid) {
      shake();
      Alert.alert("Invalid List Name", titleValidation.error);
      return;
    }
    const itemsValidation = validateItemsArray(sanitizedItems);
    if (!itemsValidation.isValid) {
      shake();
      Alert.alert("Invalid Items", itemsValidation.error);
      return;
    }
    if (tagsArray.length > 0) {
      const tagsValidation = validateTagsArray(tagsArray);
      if (!tagsValidation.isValid) {
        shake();
        Alert.alert("Invalid Tags", tagsValidation.error);
        return;
      }
    }
    setSaving(true);
    haptic.press();
    try {
      await updateList(list.id, {
        title: sanitizedTitle,
        items: sanitizedItems,
        tags: tagsArray,
        allowPublicEdit: allowPublicEdit,
      });
      haptic.success();
      Alert.alert("Success", "List updated successfully!");
      navigation.goBack();
    } catch (error) {
      logFirestoreError(error, 'Update list', 'lists');
      haptic.error();
      Alert.alert("Error", "Failed to update list.");
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
        <Animated.View style={[{ flex: 1 }, shakeStyle]}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[{
            alignItems: "center",
            marginBottom: spacing.xxl,
          }, headerStyle]}>
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
              {list.title}
            </Text>
            <Text style={{ color: colors.textMedium, fontSize: 14 }}>
              {list.items?.length || 0} item{list.items?.length !== 1 ? 's' : ''}
            </Text>
          </Animated.View>
          <Animated.View style={[{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }, titleStyle]}>
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
          </Animated.View>
          <Animated.View style={[{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }, itemsStyle]}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="shopping-cart" size={20} color={listColor} />
                <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                  Items ({items.filter(i => getItemName(i).trim()).length})
                </Text>
              </View>
              <AnimatedPressable
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
              </AnimatedPressable>
            </View>
            {items.map((item, index) => (
              <SwipeableInput
                key={index}
                value={getItemDisplay(item)}
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
          </Animated.View>
          <Animated.View style={[{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }, tagsStyle]}>
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
          </Animated.View>
          <Animated.View style={[{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }, settingsStyle]}>
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
                  haptic.selection();
                  setAllowPublicEdit(value);
                }}
                thumbColor={allowPublicEdit ? listColor : "#f4f3f4"}
                trackColor={{ false: "#767577", true: `${listColor}80` }}
              />
            </View>
          </Animated.View>
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
                fontSize: 16,
                fontWeight: "700",
                color: listColor,
                letterSpacing: 1,
              }}>
                Share Code
              </Text>
              </View>
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center",
                backgroundColor: colors.white,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: `${listColor}40`,
              }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: listColor,
                  letterSpacing: 4,
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                }}>
                  {list.shareId}
                </Text>
              </View>
            </View>
          )}
          <PrimaryButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={{ marginTop: spacing.md }}
          />
        </ScrollView>
        </Animated.View>
        <FAB
          onPress={handleSave}
          icon="check"
          disabled={saving}
          loading={saving}
        />
        <View style={createScreenStyles.bottomBar}>
          <PrimaryButton
            title="Add Item"
            icon="add"
            onPress={handleAddItem}
            variant="outline"
            fullWidth={false}
            style={{ flex: 1 }}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default EditListScreen;
