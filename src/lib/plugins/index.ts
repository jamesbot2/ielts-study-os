// Plugin architecture public entry point.

export * from "./types";
export * from "./errors";
export * from "./registry";
export * from "./manager";
export * from "./vocabulary/types";
export * from "./practice/types";
export * from "./speaking/types";

import { registerPlugin } from "./registry";
import { builtinVocabularyProvider } from "./vocabulary/builtin-provider";
import type { IeltsPlugin } from "./types";

// Built-in providers registered at app startup.
export function registerBuiltinPlugins(): void {
  registerPlugin(builtinVocabularyProvider as unknown as IeltsPlugin);
}

export { builtinVocabularyProvider };
