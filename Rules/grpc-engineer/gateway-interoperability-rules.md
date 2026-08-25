# Gateway and Interoperability Rules

## Purpose
Preserve semantics when gRPC crosses proxies, gateways, browsers, or heterogeneous runtimes.

## Scope
gRPC-Web, transcoding, HTTP/2/HTTP/3 intermediaries, proxies, language runtimes, and external clients.

## MUST
- Intermediaries MUST be validated for required streaming, metadata, status, message-size, and deadline behavior.
- Transcoding mappings MUST define how validation, errors, field presence, and HTTP semantics correspond.
- Public APIs MUST test every supported client/runtime combination that carries material compatibility risk.
- Proxy timeout and buffering settings MUST align with RPC behavior.

## MUST NOT
- MUST NOT assume native gRPC and gRPC-Web provide identical capabilities.
- MUST NOT expose internal-only RPCs through gateways accidentally.
- MUST NOT allow intermediaries to strip required authentication or tracing context without explicit handling.

## SHOULD
- Keep transport adaptation at boundaries rather than contaminating domain contracts.
- Prefer standards-compatible behavior over runtime-specific quirks for public APIs.

## Exceptions
Runtime-specific deviations require documented support scope and interoperability tests.

## Verification
Exercise calls through the real intermediary path, including streaming, errors, cancellation, auth, large messages, and timeout behavior.