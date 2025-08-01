import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, color: "#555" }}>Hello, Ethan</Text>
          <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 4 }}>
            Let’s Learning{"\n"}Together!
          </Text>
        </View>

        {/* Search */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f1f1f1",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginBottom: 24,
          }}
        >
          <TextInput
            placeholder="Search what you need"
            style={{ flex: 1, fontSize: 16 }}
          />
          <View
            style={{
              backgroundColor: "#132742",
              padding: 10,
              borderRadius: 10,
              marginLeft: 8,
            }}
          >
            <Text style={{ color: "#fff" }}>🔍</Text>
          </View>
        </View>

        {/* Continue Course */}
        <View
          style={{
            backgroundColor: "#FFD86E",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>
              To be Marketers Professional!
            </Text>
            <Text style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>
              Ready for the new challenge and new career?
            </Text>
            <Pressable
              style={{
                backgroundColor: "#132742",
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 10,
                alignSelf: "flex-start",
              }}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={{ color: "#fff", fontSize: 14 }}>🎯 Lesson 3</Text>
            </Pressable>
          </View>
          <View
            style={{
              width: 80,
              height: 80,
              marginLeft: 10,
              backgroundColor: "#eee",
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#aaa" }}>No Image</Text>
          </View>
        </View>

        {/* Top Courses */}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
          Top Courses
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          <CourseCard title="Marketing" courses="14" bgColor="#FFD3E2" />
          <CourseCard title="Design" courses="21" bgColor="#D1E3FF" />
          <CourseCard title="Programming" courses="18" bgColor="#D3FFD3" />
          <CourseCard title="Business" courses="12" bgColor="#FFF3D1" />
          <CourseCard title="Photography" courses="9" bgColor="#E2D3FF" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type CourseCardProps = {
  title: string;
  courses: string;
  bgColor: string;
};

const CourseCard = ({ title, courses, bgColor }: CourseCardProps) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={{
        width: "48%",
        backgroundColor: bgColor,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
      }}
      onPress={() => navigation.navigate("Login")}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
        {title}
      </Text>
      <Text style={{ color: "#555" }}>{courses} Course</Text>
    </Pressable>
  );
};

export default HomeScreen;
