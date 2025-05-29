import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

let config = [...compat.extends("next/core-web-vitals")];

// ensure entry.files is array of strings before endsWith
config = config.filter((entry) => {
  if (!entry.files) return true;
  const files = Array.isArray(entry.files)
    ? entry.files
    : typeof entry.files === "string"
    ? [entry.files]
    : [];
  return !files.some(
    (f) => typeof f === "string" && (f.endsWith(".ts") || f.endsWith(".tsx"))
  );
});
// export final array, appending our global rules override
export default [
  ...config,
  {
    // disable no-unescaped-entities everywhere
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];

