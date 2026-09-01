// Canonical plugin registration entry point. Everything (ProviderManager,
// vocabulary runtime, future integrations) must use this single path.

import { registerVocabularyPlugins } from "./vocabulary";

export function registerAllPlugins(): void {
  registerVocabularyPlugins();
  // Future: registerPracticePlugins(), registerSpeechPlugins(), ...
}
