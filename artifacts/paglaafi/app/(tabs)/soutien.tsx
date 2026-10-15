import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Share, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  ActionButton,
  BrandHeader,
  EmptyState,
  ScreenHeading,
  TrustNotice,
  useResponsiveLayout,
} from "@/components/common";
import { articles } from "@/data/content";
import { useSavedContent } from "@/context/saved-content";
import { useColors } from "@/hooks/useColors";

export default function SoutienScreen() {
  const colors = useColors();
  const router = useRouter();
  const { contentStyle, sidePadding } = useResponsiveLayout();
  const { savedIds, isLoading, storageError } = useSavedContent();
  const savedArticles = articles.filter((article) => savedIds.includes(article.id));

  const shareSupport = async () => {
    await Share.share({
      message:
        "Je partage PagLaafi : des repères fiables et des ressources pour s’orienter autour du cancer du sein. L’application informe et ne remplace pas un avis médical.",
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <BrandHeader />
      <ScreenHeading
        eyebrow="AVANCER ENSEMBLE"
        title="Vous n’avez pas à traverser cela seule."
        description="Des pistes pour les personnes concernées et leurs proches, à leur rythme."
      />
      <View
        style={[
          styles.content,
          contentStyle,
          { paddingHorizontal: sidePadding },
        ]}
      >
        <View
          style={[
            styles.supportCard,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <View style={[styles.supportIcon, { backgroundColor: colors.card }]}>
            <Feather name="heart" size={21} color={colors.primary} />
          </View>
          <Text style={[styles.supportTitle, { color: colors.foreground }]}>
            Un proche peut faire la différence.
          </Text>
          <Text style={[styles.supportText, { color: colors.mutedForeground }]}>
            Écouter sans juger, demander comment aider et proposer d’accompagner
            une personne à un rendez-vous sont des gestes simples. Chacune peut
            choisir le soutien qui lui convient.
          </Text>
          <ActionButton
            label="Partager PagLaafi avec un proche"
            icon="share-2"
            variant="secondary"
            onPress={() => void shareSupport()}
            testID="share-paglaafi"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Ressources enregistrées
        </Text>
        {isLoading ? (
          <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
            Chargement de vos ressources…
          </Text>
        ) : savedArticles.length > 0 ? (
          savedArticles.map((article) => (
            <Pressable
              key={article.id}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/article/[id]",
                  params: { id: article.id },
                })
              }
              style={[
                styles.savedRow,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="bookmark" size={17} color={colors.primary} />
              <Text style={[styles.savedTitle, { color: colors.foreground }]}>
                {article.title}
              </Text>
              <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
            </Pressable>
          ))
        ) : (
          <EmptyState
            icon="bookmark"
            title="Rien d’enregistré pour le moment"
            body="Enregistrez un article dans la rubrique Comprendre pour le retrouver ici."
          />
        )}
        {storageError ? (
          <Text accessibilityRole="alert" style={[styles.errorText, { color: colors.destructive }]}>
            {storageError}
          </Text>
        ) : null}

        <TrustNotice
          title="Des contacts locaux seront ajoutés après vérification."
          text="PagLaafi n’affiche pas encore de numéro d’écoute ou de relais communautaire non confirmé."
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/centres")}
          style={({ pressed }) => [
            styles.findSupport,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.84 : 1,
            },
          ]}
        >
          <View style={[styles.findIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="map-pin" size={17} color={colors.primary} />
          </View>
          <View style={styles.findCopy}>
            <Text style={[styles.findTitle, { color: colors.foreground }]}>
              Chercher un centre d’orientation
            </Text>
            <Text style={[styles.findSubtitle, { color: colors.mutedForeground }]}>
              Consulter l’annuaire en cours de vérification
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.primary} />
        </Pressable>

        <Text style={[styles.privacy, { color: colors.mutedForeground }]}>
          Vos ressources enregistrées restent sur cet appareil. Aucun compte
          n’est demandé.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 36,
  },
  supportCard: {
    padding: 17,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
  },
  supportIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  supportTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    lineHeight: 22,
  },
  supportText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 19,
  },
  sectionTitle: {
    marginTop: 5,
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  statusText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  savedRow: {
    minHeight: 51,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  savedTitle: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  errorText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  findSupport: {
    padding: 12,
    minHeight: 66,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  findIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  findCopy: {
    flex: 1,
    gap: 3,
  },
  findTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  findSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  privacy: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
