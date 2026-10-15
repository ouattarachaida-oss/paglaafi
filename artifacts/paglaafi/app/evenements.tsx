import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  BrandHeader,
  EmptyState,
  useResponsiveLayout,
} from "@/components/common";
import { useColors } from "@/hooks/useColors";

export default function EventsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { contentStyle, sidePadding } = useResponsiveLayout();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <BrandHeader />
      <View
        style={[
          styles.content,
          contentStyle,
          { paddingHorizontal: sidePadding, maxWidth: 800 },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={17} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Accueil</Text>
        </Pressable>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          CAMPAGNES & RENCONTRES
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Ensemble, on en parle.
        </Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          Les dates et lieux seront affichés ici après confirmation auprès des
          organisateurs locaux.
        </Text>
        <EmptyState
          icon="calendar"
          title="Aucune date confirmée pour le moment"
          body="Nous n’affichons que les événements dont les informations ont été vérifiées. Revenez bientôt pour les nouvelles campagnes."
        />
        <View
          style={[
            styles.note,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <Feather name="shield" size={16} color={colors.primary} />
          <Text style={[styles.noteText, { color: colors.secondaryForeground }]}>
            Vérifiez toujours les détails auprès de l’organisateur avant de vous
            déplacer.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 17,
    paddingBottom: 36,
    gap: 14,
  },
  backButton: {
    minHeight: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  backText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  eyebrow: {
    marginTop: 7,
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.25,
  },
  title: {
    marginTop: -9,
    fontFamily: "serif",
    fontSize: 31,
    lineHeight: 38,
  },
  description: {
    marginTop: -6,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 21,
  },
  note: {
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  noteText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 17,
  },
});
