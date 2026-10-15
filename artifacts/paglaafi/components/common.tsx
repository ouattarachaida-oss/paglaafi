import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export function BrandHeader() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: colors.border,
          paddingTop: topInset,
          minHeight: 68 + topInset,
        },
      ]}
    >
      <Pressable
        accessibilityLabel="Retourner à l’accueil PagLaafi"
        accessibilityRole="button"
        onPress={() => router.replace("/")}
        style={styles.brand}
      >
        <Image
          source={require("../assets/images/logo-paglaafi.png")}
          contentFit="contain"
          style={styles.logo}
          accessibilityLabel="Logo PagLaafi"
        />
        <View style={styles.brandCopy}>
          <Text style={[styles.brandTitle, { color: colors.foreground }]}>
            PagLaafi
          </Text>
          <Text style={[styles.brandTagline, { color: colors.mutedForeground }]}>
            S’INFORMER · S’ORIENTER
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="À propos de PagLaafi"
        onPress={() =>
          Alert.alert(
            "À propos de PagLaafi",
            "PagLaafi partage des repères et aide à s’orienter. L’application ne pose pas de diagnostic et ne remplace pas un professionnel de santé.",
          )
        }
        style={styles.infoButton}
        hitSlop={10}
      >
        <Feather name="help-circle" size={21} color={colors.mutedForeground} />
      </Pressable>
    </View>
  );
}

export function ScreenHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.heading}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

export function TrustNotice({
  title = "Information et orientation, pas un diagnostic.",
  text,
}: {
  title?: string;
  text: string;
}) {
  const colors = useColors();
  return (
    <View
      accessibilityRole="text"
      style={[
        styles.notice,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.noticeIcon, { backgroundColor: colors.secondary }]}>
        <Feather name="shield" size={17} color={colors.primary} />
      </View>
      <View style={styles.noticeCopy}>
        <Text style={[styles.noticeTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>
          {text}
        </Text>
      </View>
    </View>
  );
}

export function ActionButton({
  label,
  icon,
  onPress,
  variant = "primary",
  testID,
}: {
  label: string;
  icon?: React.ComponentProps<typeof Feather>["name"];
  onPress: () => void;
  variant?: "primary" | "secondary";
  testID?: string;
}) {
  const colors = useColors();
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.actionButton,
        {
          backgroundColor: primary ? colors.primary : colors.secondary,
          opacity: pressed ? 0.83 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.actionLabel,
          { color: primary ? colors.primaryForeground : colors.primary },
        ]}
      >
        {label}
      </Text>
      {icon ? (
        <Feather
          name={icon}
          size={17}
          color={primary ? colors.primaryForeground : colors.primary}
        />
      ) : null}
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  body: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.empty,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={23} color={colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
        {body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    paddingBottom: 34,
  },
  pagePadding: {
    paddingHorizontal: 20,
  },
  header: {
    minHeight: 68,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  logo: {
    width: 38,
    height: 38,
  },
  brandCopy: {
    gap: 1,
  },
  brandTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: -0.4,
  },
  brandTagline: {
    fontFamily: "Inter_500Medium",
    fontSize: 8,
    letterSpacing: 1.35,
  },
  infoButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
  },
  eyebrow: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 5,
    fontFamily: "serif",
    fontSize: 31,
    lineHeight: 37,
    letterSpacing: -0.7,
  },
  description: {
    marginTop: 8,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  notice: {
    flexDirection: "row",
    gap: 11,
    padding: 14,
    borderWidth: 1,
    borderRadius: 18,
  },
  noticeIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeCopy: {
    flex: 1,
    gap: 4,
  },
  noticeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    lineHeight: 17,
  },
  noticeText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 17,
  },
  actionButton: {
    minHeight: 48,
    paddingHorizontal: 17,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  actionLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  empty: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderWidth: 1,
    borderRadius: 22,
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: 14,
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    textAlign: "center",
  },
  emptyBody: {
    marginTop: 7,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
