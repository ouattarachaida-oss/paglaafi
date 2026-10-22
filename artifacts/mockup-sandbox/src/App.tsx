import { useEffect, useState, type ComponentType } from "react";
import PagLaafiV2 from "./components/mockups/pinkhub-v2/PagLaafiV2";

import { modules as discoveredModules } from "./.generated/mockup-components";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

function _resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const fns = Object.values(mod).filter(
    (v) => typeof v === "function",
  ) as ComponentType[];
  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    fns[fns.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
  modules,
}: {
  componentPath: string;
  modules: ModuleMap;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setComponent(null);
    setError(null);

    async function loadComponent(): Promise<void> {
      const key = `./components/mockups/${componentPath}.tsx`;
      const loader = modules[key];
      if (!loader) {
        setError(`No component found at ${componentPath}.tsx`);
        return;
      }

      try {
        const mod = await loader();
        if (cancelled) {
          return;
        }
        const name = componentPath.split("/").pop()!;
        const comp = _resolveComponent(mod, name);
        if (!comp) {
          setError(
            `No exported React component found in ${componentPath}.tsx\n\nMake sure the file has at least one exported function component.`,
          );
          return;
        }
        setComponent(() => comp);
      } catch (e) {
        if (cancelled) {
          return;
        }

        const message = e instanceof Error ? e.message : String(e);
        setError(`Failed to load preview.\n${message}`);
      }
    }

    void loadComponent();

    return () => {
      cancelled = true;
    };
  }, [componentPath, modules]);

  if (error) {
    return (
      <pre style={{ color: "red", padding: "2rem", fontFamily: "system-ui" }}>
        {error}
      </pre>
    );
  }

  if (!Component) return null;

  return <Component />;
}

function getBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

function getPreviewExamplePath(): string {
  const basePath = getBasePath();
  return `${basePath}/preview/ComponentName`;
}

function Gallery() {
  const availableKeys = Object.keys(discoveredModules).map((k) =>
    k.replace("./components/mockups/", "").replace(".tsx", "")
  );

  return (
    <div className="min-h-screen bg-[#fcf6f8] flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md bg-white p-6 rounded-2xl shadow-sm border border-[#f0dfe4]">
        <h1 className="text-2xl font-bold text-[#472738] mb-2">
          Maquettes Disponibles
        </h1>
        <p className="text-[#765b67] text-sm mb-5">
          Choisissez la maquette que vous souhaitez prévisualiser :
        </p>
        <div className="space-y-2">
          {availableKeys.map((name) => (
            <a
              key={name}
              href={`/preview/${name}`}
              className="block w-full py-3 px-4 bg-[#a74869] text-white font-semibold rounded-xl hover:bg-[#923e5c] transition"
            >
              Ouvrir {name.split("/").pop()}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function getPreviewPath(): string | null {
  const basePath = getBasePath();
  const { pathname } = window.location;
  const local =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const match = local.match(/^\/preview\/(.+)$/);
  return match ? match[1] : null;
}

function App() {
  const previewPath = getPreviewPath();

  if (previewPath) {
    return (
      <PreviewRenderer
        componentPath={previewPath}
        modules={discoveredModules}
      />
    );
  }

  // Chargement direct et immédiat de PagLaafi V2 sur la racine
  return <PagLaafiV2 />;
}

export default App;
