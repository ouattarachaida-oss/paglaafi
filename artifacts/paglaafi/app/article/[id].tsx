import { Feather } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BrandHeader, TrustNotice } from "@/components/common";
import { useSavedContent } from "@/context/saved-content";
import { articles } from "@/data/content";
import { useColors } from "@/hooks/useColors";

export default function ArticleDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = articles.find((item) => item.id === id);
  const { savedIds, toggleSaved, storageError } = useSavedContent();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const saved = article ? savedIds.includes(article.id) : false;

  useEffect(
    () => () => {
      void Speech.stop();
    },
    [],
  );

  if (!article) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <BrandHeader />
        <View style={styles.notFoundBody}>
          <Feather name="file-text" size={30} color={colors.primary} />
          <Text style={[styles.notFoundTitle, { color: colors.foreground }]}>
            Cette ressource n’est pas disponible.
          </Text>
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Text style={[styles.backText, { color: colors.primary }]}>Retour</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const toggleAudio = () => {
    if (isSpeaking) {
      void Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const spokenText = `${article.title}. ${article.paragraphs.join(" ")}`;
    Speech.speak(spokenText, {
      language: "fr-FR",
      rate: 0.92,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert(
          "Lecture audio indisponible",
          "La voix française n’est pas disponible sur cet appareil. Vous pouvez lire le texte à l’écran.",
        );
      },
    });
  };

  const saveArticle = async () => {
    const success = await toggleSaved(article.id);
    if (!success) {
      Alert.alert(
        "Enregistrement impossible",
        "La ressource n’a pas pu être enregistrée sur cet appareil.",
      );
    }
  };

  const openSource = async () => {
    try {
      await Linking.openURL(article.sourceUrl);
    } catch {
      Alert.alert(
        "Source indisponible",
        "Impossible d’ouvrir la page de l’Organisation mondiale de la Santé.",
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <BrandHeader />
      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={17} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Comprendre</Text>
        </Pressable>
        <Text style={[styles.category, { color: colors.primary }]}>
          {article.category.toUpperCase()}
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {article.title}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>
          {article.readingTime} de lecture · Source vérifiable
        </Text>

        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSpeaking ? "Arrêter la lecture" : "Écouter cet article"}
            testID="article-audio"
            onPress={toggleAudio}
            style={[
              styles.controlButton,
              { backgroundColor: colors.secondary, borderColor: colors.border },
            ]}
          >
            <Feather
              name={isSpeaking ? "square" : "volume-2"}
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.controlText, { color: colors.primary }]}>
              {isSpeaking ? "Arrêter l’écoute" : "Écouter"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={saved ? "Retirer des ressources enregistrées" : "Enregistrer cet article"}
            testID="article-save"
            onPress={() => void saveArticle()}
            style={[
              styles.controlButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather
              name={saved ? "bookmark" : "bookmark"}
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.controlText, { color: colors.primary }]}>
              {saved ? "Enregistré" : "Enregistrer"}
            </Text>
          </Pressable>
        </View>

        {storageError ? (
          <Text accessibilityRole="alert" style={[styles.error, { color: colors.destructive }]}>
            {storageError}
          </Text>
        ) : null}

        {article.paragraphs.map((paragraph, index) => (
          <Text
            key={`${article.id}-${index}`}
            style={[styles.paragraph, { color: colors.foreground }]}
          >
            {paragraph}
          </Text>
        ))}

        <Pressable
          accessibilityRole="link"
          testID="article-source"
          onPress={() => void openSource()}
          style={[
            styles.sourceCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.sourceIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="external-link" size={17} color={colors.primary} />
          </View>
          <View style={styles.sourceCopy}>
            <Text style={[styles.sourceLabel, { color: colors.mutedForeground }]}>
              SOURCE
            </Text>
            <Text style={[styles.sourceTitle, { color: colors.foreground }]}>
              {article.sourceName}
            </Text>
            <Text style={[styles.sourceDate, { color: colors.mutedForeground }]}>
              {article.sourceDate}
            </Text>
          </View>
          <Feather name="arrow-up-right" size={17} color={colors.primary} />
        </Pressable>

        <TrustNotice
          title="Des repères, pas un diagnostic."
          text="Ces informations générales ne permettent pas d’évaluer une situation personnelle. Les recommandations de dépistage doivent être confirmées localement."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 21,
    paddingTop: 15,
    paddingBottom: 38,
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
  category: {
    marginTop: 7,
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.2,
  },
  title: {
    marginTop: -8,
    fontFamily: "serif",
    fontSize: 31,
    lineHeight: 38,
  },
  meta: {
    marginTop: -9,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  controls: {
    flexDirection: "row",
    gap: 9,
  },
  controlButton: {
    minHeight: 43,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  controlText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  error: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 23,
  },
  sourceCard: {
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  sourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceCopy: {
    flex: 1,
    gap: 3,
  },
  sourceLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    letterSpacing: 1.1,
  },
  sourceTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  sourceDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  notFound: {
    flex: 1,
  },
  notFoundBody: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  notFoundTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    textAlign: "center",
  },
});
