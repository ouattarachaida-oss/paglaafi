import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BrandHeader, EmptyState } from "@/components/common";
import { healthCentres } from "@/data/content";
import { useColors } from "@/hooks/useColors";

export default function CentreDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const centre = healthCentres.find((item) => item.id === id);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <BrandHeader />
      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={17} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Centres</Text>
        </Pressable>
        {centre ? (
          <>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              {centre.verified ? "FICHE VÉRIFIÉE" : "FICHE À VÉRIFIER"}
            </Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {centre.name}
            </Text>
            <Text style={[styles.location, { color: colors.mutedForeground }]}>
              {centre.city} · {centre.region}
            </Text>
            <View
              style={[
                styles.notice,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              <Feather name="info" size={17} color={colors.primary} />
              <Text style={[styles.noticeText, { color: colors.secondaryForeground }]}>
                {centre.description}
              </Text>
            </View>
            <EmptyState
              icon="phone"
              title="Contact non disponible"
              body="Aucun numéro ni horaire n’est publié tant que ces informations n’ont pas été confirmées."
            />
          </>
        ) : (
          <EmptyState
            icon="map-pin"
            title="Cette fiche n’est pas disponible"
            body="L’annuaire ne contient pas encore de centres vérifiés. Les coordonnées seront ajoutées après validation locale."
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
    gap: 15,
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
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.2,
  },
  title: {
    marginTop: -9,
    fontFamily: "serif",
    fontSize: 30,
  },
  location: {
    marginTop: -9,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  notice: {
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  noticeText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 17,
  },
});
