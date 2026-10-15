import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "paglaafi:saved-content:v1";

type SavedContentValue = {
  savedIds: string[];
  isLoading: boolean;
  storageError: string | null;
  toggleSaved: (id: string) => Promise<boolean>;
};

const SavedContentContext = createContext<SavedContentValue | null>(null);

export function SavedContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSavedContent() {
      try {
        const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (!active || !rawValue) return;

        const parsed: unknown = JSON.parse(rawValue);
        if (
          Array.isArray(parsed) &&
          parsed.every((item): item is string => typeof item === "string")
        ) {
          setSavedIds(parsed);
        }
      } catch {
        if (active) {
          setStorageError(
            "Les ressources enregistrées n’ont pas pu être chargées.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadSavedContent();
    return () => {
      active = false;
    };
  }, []);

  const toggleSaved = useCallback(
    async (id: string) => {
      const nextIds = savedIds.includes(id)
        ? savedIds.filter((savedId) => savedId !== id)
        : [...savedIds, id];

      setSavedIds(nextIds);
      setStorageError(null);

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
        return true;
      } catch {
        setSavedIds(savedIds);
        setStorageError(
          "La modification n’a pas pu être enregistrée sur cet appareil.",
        );
        return false;
      }
    },
    [savedIds],
  );

  const value = useMemo(
    () => ({ savedIds, isLoading, storageError, toggleSaved }),
    [savedIds, isLoading, storageError, toggleSaved],
  );

  return (
    <SavedContentContext.Provider value={value}>
      {children}
    </SavedContentContext.Provider>
  );
}

export function useSavedContent() {
  const context = useContext(SavedContentContext);
  if (!context) {
    throw new Error(
      "useSavedContent doit être utilisé dans SavedContentProvider.",
    );
  }
  return context;
}
