import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  BrandHeader,
  ScreenHeading,
  useResponsiveLayout,
} from "@/components/common";
import { articles } from "@/data/content";
import { useColors } from "@/hooks/useColors";

export default function ComprendreScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isTablet, contentStyle, sidePadding } = useResponsiveLayout();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <BrandHeader />
      <ScreenHeading
        eyebrow="APPRENDRE À SON RYTHME"
        title="Comprendre, pas à pas."
        description="Des repères généraux en français simple, avec leurs sources."
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
            styles.sourceBanner,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <Feather name="check-circle" size={17} color={colors.primary} />
          <Text style={[styles.sourceText, { color: colors.secondaryForeground }]}>
            Les articles ci-dessous s’appuient sur l’OMS. Ils ne remplacent pas
            les recommandations locales ni un avis médical.
          </Text>
        </View>

        <View style={[styles.articleGrid, isTablet && styles.articleGridWide]}>
          {articles.map((article, index) => (
            <Pressable
              key={article.id}
              accessibilityRole="button"
              testID={`article-${article.id}`}
              onPress={() =>
                router.push({
                  pathname: "/article/[id]",
                  params: { id: article.id },
                })
              }
              style={({ pressed }) => [
                styles.articleCard,
                isTablet && styles.articleCardWide,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.84 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.articleIcon,
                  { backgroundColor: index === 1 ? colors.accent : colors.secondary },
                ]}
              >
                <Feather
                  name={index === 1 ? "heart" : index === 2 ? "message-circle" : "book-open"}
                  size={19}
                  color={index === 1 ? colors.accentForeground : colors.primary}
                />
              </View>
              <View style={styles.articleCopy}>
                <Text style={[styles.category, { color: colors.primary }]}>
                  {article.category.toUpperCase()}
                </Text>
                <Text style={[styles.articleTitle, { color: colors.foreground }]}>
                  {article.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.summary, { color: colors.mutedForeground }]}
                >
                  {article.summary}
                </Text>
                <Text style={[styles.readTime, { color: colors.mutedForeground }]}>
                  {article.readingTime} de lecture · Source OMS
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.primary} />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Feather name="wifi-off" size={15} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Les textes restent disponibles sans créer de compte.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 36,
  },
  articleGrid: {
    gap: 12,
  },
  articleGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sourceBanner: {
    padding: 13,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  sourceText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 17,
  },
  articleCard: {
    width: "100%",
    padding: 13,
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },
  articleCardWide: {
    width: "48.5%",
    minHeight: 156,
  },
  articleIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  articleCopy: {
    flex: 1,
  },
  category: {
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    letterSpacing: 1.1,
  },
  articleTitle: {
    marginTop: 4,
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    lineHeight: 18,
  },
  summary: {
    marginTop: 4,
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    lineHeight: 15,
  },
  readTime: {
    marginTop: 7,
    fontFamily: "Inter_500Medium",
    fontSize: 9,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingTop: 5,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
});
