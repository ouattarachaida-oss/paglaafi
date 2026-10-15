import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BrandHeader, EmptyState, ScreenHeading } from "@/components/common";
import { healthCentres } from "@/data/content";
import { useColors } from "@/hooks/useColors";

export default function CentresScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const filteredCentres = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("fr");
    if (!search) return healthCentres;
    return healthCentres.filter((centre) =>
      `${centre.name} ${centre.city} ${centre.region}`
        .toLocaleLowerCase("fr")
        .includes(search),
    );
  }, [query]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <BrandHeader />
      <ScreenHeading
        eyebrow="TROUVER UN REPÈRE"
        title="Centres & orientation"
        description="Recherchez une structure de santé ou un service d’orientation près de vous."
      />
      <View style={styles.content}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.card, borderColor: colors.input },
          ]}
        >
          <Feather name="search" size={17} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={Keyboard.dismiss}
            placeholder="Ville ou région"
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            accessibilityLabel="Rechercher un centre par ville ou région"
            testID="centre-search"
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {query.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Effacer la recherche"
              onPress={() => setQuery("")}
              hitSlop={8}
            >
              <Feather name="x-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        {filteredCentres.length > 0 ? (
          <View style={styles.results}>
            <Text style={[styles.resultsLabel, { color: colors.mutedForeground }]}>
              {filteredCentres.length} résultat{filteredCentres.length > 1 ? "s" : ""}
            </Text>
            {filteredCentres.map((centre) => (
              <View
                key={centre.id}
                style={[
                  styles.centreCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={[styles.pin, { backgroundColor: colors.secondary }]}>
                  <Feather name="map-pin" size={19} color={colors.primary} />
                </View>
                <View style={styles.centreText}>
                  <Text style={[styles.centreName, { color: colors.foreground }]}>
                    {centre.name}
                  </Text>
                  <Text style={[styles.centrePlace, { color: colors.mutedForeground }]}>
                    {centre.city} · {centre.region}
                  </Text>
                  {centre.verified ? (
                    <Text style={[styles.verified, { color: colors.primary }]}>
                      Fiche vérifiée
                    </Text>
                  ) : (
                    <Text style={[styles.unverified, { color: colors.mutedForeground }]}>
                      Fiche à vérifier
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="map"
            title={query ? "Aucun centre trouvé" : "Les fiches vérifiées arrivent"}
            body={
              query
                ? "Essayez une autre ville ou effacez votre recherche. L’annuaire ne contient pas encore de fiche vérifiée."
                : "Aucun établissement n’est publié pour le moment. Les adresses et services seront affichés après confirmation par des partenaires locaux."
            }
          />
        )}

        <View
          style={[
            styles.dataNote,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <Feather name="info" size={16} color={colors.primary} />
          <Text style={[styles.dataNoteText, { color: colors.secondaryForeground }]}>
            Les coordonnées ne seront publiées qu’après vérification. PagLaafi ne
            fournit pas encore de carte ni de prise de rendez-vous.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 15,
  },
  searchBox: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  results: {
    gap: 10,
  },
  resultsLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  centreCard: {
    padding: 13,
    borderWidth: 1,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pin: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  centreText: {
    flex: 1,
    gap: 4,
  },
  centreName: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  centrePlace: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  verified: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
  },
  unverified: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
  },
  dataNote: {
    padding: 13,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    gap: 9,
    alignItems: "flex-start",
  },
  dataNoteText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 17,
  },
});
