// Generates React components from the "Emma" mascot SVGs using SVGR.
//
//   node scripts/generate-emma.mjs [sourceDir]
//
// Re-run whenever the source SVGs change. Output: components/emma/*.tsx + index.
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { transform } from "@svgr/core";

const SOURCE_DIR = process.argv[2] ?? "C:/Users/liong/Downloads/emma";
const OUT_DIR = join(process.cwd(), "src", "shared", "components", "brand", "emma");

/** "Emma raise hand.svg" -> "EmmaRaiseHand" */
function toPascalCase(fileName) {
  return basename(fileName, ".svg")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function svgrOptions(componentName) {
  return {
    typescript: true,
    ref: true,
    dimensions: false, // size via className (e.g. className="w-28") instead
    expandProps: "end",
    jsxRuntime: "automatic",
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    svgoConfig: {
      plugins: [
        {
          name: "preset-default",
          params: { overrides: { removeViewBox: false } },
        },
        // Namespace internal ids so multiple mascots can render on one page.
        { name: "prefixIds", params: { prefix: componentName } },
      ],
    },
  };
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SOURCE_DIR)).filter((f) => f.endsWith(".svg"));
  if (files.length === 0) throw new Error(`No SVGs found in ${SOURCE_DIR}`);

  const components = [];
  for (const file of files) {
    const componentName = toPascalCase(file);
    const svg = await readFile(join(SOURCE_DIR, file), "utf8");
    const code = await transform(svg, svgrOptions(componentName), {
      componentName,
    });
    await writeFile(join(OUT_DIR, `${componentName}.tsx`), code, "utf8");
    components.push(componentName);
    console.log(`✓ ${file} -> ${componentName}.tsx`);
  }

  components.sort();
  const index =
    components.map((n) => `export { default as ${n} } from "./${n}";`).join("\n") +
    "\n";
  await writeFile(join(OUT_DIR, "index.ts"), index, "utf8");
  console.log(`✓ wrote index.ts (${components.length} components)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
