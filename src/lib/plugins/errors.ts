// Typed provider errors. All provider calls normalize errors into these so a
// broken provider never crashes the core app.

export type ProviderErrorKind =
  | "unavailable"
  | "auth"
  | "network"
  | "schema"
  | "rate_limit"
  | "not_configured"
  | "unknown";

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly kind: ProviderErrorKind = "unknown",
    public readonly pluginId?: string,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

export class ProviderUnavailableError extends ProviderError {
  constructor(pluginId?: string) {
    super("Provider is unavailable.", "unavailable", pluginId);
    this.name = "ProviderUnavailableError";
  }
}

export class ProviderAuthError extends ProviderError {
  constructor(pluginId?: string) {
    super("Provider authentication failed.", "auth", pluginId);
    this.name = "ProviderAuthError";
  }
}

export class ProviderNetworkError extends ProviderError {
  constructor(message: string, pluginId?: string) {
    super(`Provider network error: ${message}`, "network", pluginId);
    this.name = "ProviderNetworkError";
  }
}

export class ProviderSchemaError extends ProviderError {
  constructor(message: string, pluginId?: string) {
    super(`Provider returned invalid data: ${message}`, "schema", pluginId);
    this.name = "ProviderSchemaError";
  }
}

export class ProviderRateLimitError extends ProviderError {
  constructor(pluginId?: string) {
    super("Provider rate limit reached.", "rate_limit", pluginId);
    this.name = "ProviderRateLimitError";
  }
}

export class ProviderNotConfiguredError extends ProviderError {
  constructor(pluginId?: string) {
    super("Provider is not configured.", "not_configured", pluginId);
    this.name = "ProviderNotConfiguredError";
  }
}

export function normalizeProviderError(err: unknown, pluginId?: string): ProviderError {
  if (err instanceof ProviderError) return err;
  const message = err instanceof Error ? err.message : String(err);
  return new ProviderError(message, "unknown", pluginId);
}
