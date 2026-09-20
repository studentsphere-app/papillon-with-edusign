import { router, useLocalSearchParams } from "expo-router";
import { useHeaderHeight, useTheme } from "expo-router/react-navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/ui/new/Button";
import Stack from "@/ui/components/Stack";
import { Papicons } from "@getpapillon/papicons";
import { getCourseById } from "@/database/useTimetable";
import { Course } from "@/services/shared/timetable";
import ActivityIndicator from "@/ui/components/ActivityIndicator";

export default function AttendanceMethods() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (id) {
      getCourseById(id)
        .then(result => {
          if (!cancelled) setCourse(result || null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || !course) {
    return (
      <View
        style={{
          paddingTop: headerHeight + 12,
          paddingBottom: Math.max(insets.bottom, 20),
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
        }}
      >
        <ActivityIndicator color={String(colors.primary)} />
      </View>
    );
  }

  return (
    <View
      style={{
        paddingTop: headerHeight + 12,
        paddingBottom: Math.max(insets.bottom, 20),
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      <Stack width="100%" gap={8} hAlign="center" style={{ maxWidth: 600 }}>
        <Button
          fullWidth
          color={String(colors.primary)}
          variant="primary"
          label={t("Sign_Attendance_With_QR")}
          leading={<Papicons name="QrCode" size={20} fill="#ffffff" />}
          onPress={() =>
            router.push({
              pathname: "/(modals)/attendance/sign",
              params: { id, method: "scan" },
            })
          }
        />
        <Button
          fullWidth
          color={String(colors.primary)}
          variant="secondary"
          label={t("Sign_Attendance_With_Code")}
          leading={
            <Papicons name="PenAlt" size={20} fill={String(colors.primary)} />
          }
          onPress={() =>
            router.push({
              pathname: "/(modals)/attendance/sign",
              params: { id, method: "code" },
            })
          }
        />
      </Stack>
    </View>
  );
}
