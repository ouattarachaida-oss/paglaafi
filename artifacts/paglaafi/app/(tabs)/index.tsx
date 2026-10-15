import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BrandHeader, TrustNotice } from "@/components/common";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <BrandHeader />
      <View
        style={[
          styles.hero,
          { backgroundColor: colors.secondary, borderColor: colors.border },
        ]}
      >
        <View style={styles.heroAccent} />
        <View style={styles.heroBadge}>
          <View style={[styles.heroDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.heroBadgeText, { color: colors.primary }]}>
            UN REPÈRE, À VOTRE RYTHME
          </Text>
        </View>
        <Text style={[styles.heroTitle, { color: colors.foreground }]}>
          Une question ?{"\n"}
          <Text style={{ color: colors.primary }}>Vous n’êtes pas seule.</Text>
        </Text>
        <Text style={[styles.heroBody, { color: colors.mutedForeground }]}>
          Des informations claires et des pistes pour trouver le bon
          accompagnement, au Burkina Faso.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Commencer par comprendre"
          testID="home-start-learning"
          onPress={() => router.push("/comprendre")}
          style={({ pressed }) => [
            styles.heroButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.heroButtonText,
              { color: colors.primaryForeground },
            ]}
          >
            Commencer par comprendre
          </Text>
          <Feather
            name="arrow-right"
            size={17}
            color={colors.primaryForeground}
          />
        </Pressable>
        <View style={styles.heroSafety}>
          <Feather name="shield" size={15} color={colors.primary} />
          <Text
            style={[styles.heroSafetyText, { color: colors.mutedForeground }]}
          >
            Information et orientation, pas un diagnostic.
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeading}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              VOTRE PROCHAIN PAS
            </Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Par où commencer ?
            </Text>
          </View>
          <Text
            style={[styles.sectionAside, { color: colors.mutedForeground }]}
          >
            À votre rythme
          </Text>
        </View>

        <QuickAction
          icon="map-pin"
          title="Trouver un centre d’orientation"
          description="Consulter les fiches vérifiées disponibles"
          onPress={() => router.push("/centres")}
        />
        <QuickAction
          icon="book-open"
          title="Comprendre le cancer du sein"
          description="Lire des repères issus de sources fiables"
          onPress={() => router.push("/comprendre")}
        />
        <QuickAction
          icon="heart"
          title="Trouver du soutien"
          description="Des ressources pour vous et vos proches"
          onPress={() => router.push("/soutien")}
        />

        <Pressable
          accessibilityRole="button"
          testID="home-campaigns"
          onPress={() => router.push("/evenements")}
          style={({ pressed }) => [
            styles.campaign,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <View style={styles.campaignTop}>
            <View style={styles.campaignBadge}>
              <Feather
                name="calendar"
                size={12}
                color={colors.primaryForeground}
              />
              <Text
                style={[
                  styles.campaignBadgeText,
                  { color: colors.primaryForeground },
                ]}
              >
                CAMPAGNES & RENCONTRES
              </Text>
            </View>
            <Feather
              name="arrow-up-right"
              size={18}
              color={colors.primaryForeground}
            />
          </View>
          <Text
            style={[
              styles.campaignTitle,
              { color: colors.primaryForeground },
            ]}
          >
            Ensemble, on en parle.
          </Text>
          <Text
            style={[
              styles.campaignText,
              { color: colors.primaryForeground },
            ]}
          >
            Retrouvez les prochaines actions partagées par les partenaires
            locaux.
          </Text>
        </Pressable>

        <TrustNotice
          title="Un espace de confiance."
          text="Les contenus PagLaafi informent et orientent. Ils ne remplacent pas l’avis d’un professionnel de santé."
        />
      </View>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  title,
  description,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  description: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
    >
      <View style={[styles.quickIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={19} color={colors.primary} />
      </View>
      <View style={styles.quickCopy}>
        <Text style={[styles.quickTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        <Text
          style={[
            styles.quickDescription,
            { color: colors.mutedForeground },
          ]}
        >
          {description}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingTop: 23,
    paddingBottom: 22,
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  heroAccent: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 100,
    borderWidth: 19,
    borderColor: "rgba(255,255,255,0.32)",
    right: -52,
    top: -47,
  },
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.78)",
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
  },
  heroBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.1,
  },
  heroTitle: {
    marginTop: 18,
    fontFamily: "serif",
    fontSize: 36,
    lineHeight: 39,
    letterSpacing: -1,
  },
  heroBody: {
    marginTop: 12,
    maxWidth: 330,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
  },
  heroButton: {
    alignSelf: "flex-start",
    marginTop: 17,
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heroButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  heroSafety: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  heroSafetyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 34,
    gap: 10,
  },
  sectionHeading: {
    marginBottom: 3,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.3,
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: "serif",
    fontSize: 24,
  },
  sectionAside: {
    marginBottom: 4,
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  quickAction: {
    minHeight: 70,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quickCopy: {
    flex: 1,
    gap: 3,
  },
  quickTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  quickDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  campaign: {
    marginTop: 8,
    padding: 17,
    borderRadius: 22,
  },
  campaignTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  campaignBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.17)",
  },
  campaignBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    letterSpacing: 0.7,
  },
  campaignTitle: {
    marginTop: 13,
    fontFamily: "serif",
    fontSize: 25,
  },
  campaignText: {
    marginTop: 6,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 17,
    opacity: 0.84,
  },
});
