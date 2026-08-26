# Network Transport Rules

## Purpose
Protect mobile network traffic from interception, manipulation, downgrade, and unsafe endpoint selection.

## Scope
HTTP, WebSocket, RPC, certificate validation, proxies, redirects, and transport configuration.

## MUST
- Require authenticated encrypted transport for credentials, tokens, personal data, and security-sensitive operations.
- Use platform certificate and hostname validation unless a reviewed stronger policy is required.
- Treat redirects, alternate endpoints, and protocol downgrades as security-relevant behavior.
- Define safe timeout and failure behavior for security-critical requests.

## MUST NOT
- Disable certificate or hostname verification to fix connectivity problems.
- Ship permissive trust managers or development certificate bypasses in production builds.
- Send secrets over plaintext transport.

## SHOULD
- Prefer modern protocol versions and remove obsolete compatibility when evidence shows it is unnecessary.
- Evaluate certificate pinning only with an operational rotation and recovery design.

## Exceptions
Transport exceptions require documented endpoint constraints, exposure analysis, compensating controls, expiry, and security approval.

## Verification
Intercept representative traffic, inspect transport configuration, test invalid/expired/wrong-host certificates, redirects, downgrade attempts, and production build settings.