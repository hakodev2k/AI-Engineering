# WebView Rules

## Purpose
Constrain the high-risk boundary between native application privileges and web content.

## Scope
Embedded browsers, JavaScript bridges, navigation, file access, cookies, downloads, and web-to-native messaging.

## MUST
- Treat remotely controlled web content as untrusted and isolate it from privileged native capabilities.
- Allowlist trusted navigation origins for security-sensitive embedded experiences.
- Validate origin and message structure before honoring web-to-native requests.
- Disable unnecessary web view capabilities and file/content access.

## MUST NOT
- Expose privileged native interfaces to arbitrary web origins.
- Ignore TLS errors in embedded browser flows.
- Enable debugging in production when it exposes sensitive application state.
- Load attacker-controlled markup with unnecessary native privileges.

## SHOULD
- Prefer the system browser or secure authentication session for identity flows when protocol guidance recommends it.
- Keep bridge APIs narrow and capability-oriented.

## Exceptions
Privileged web integrations require threat modeling, origin controls, API minimization, and dedicated security testing.

## Verification
Test hostile navigation, redirects, injected scripts, bridge calls, file URLs, TLS failures, debugging state, and origin confusion.