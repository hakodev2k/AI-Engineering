# HTTP Protocol Rules

## Purpose
Preserve HTTP semantics and interoperability across proxy boundaries.

## Scope
HTTP/1.1, HTTP/2, HTTP/3 where supported, headers, methods, status codes, upgrades, and proxy normalization.

## MUST
- Proxy behavior MUST preserve application-required method, status, header, body, and streaming semantics.
- Hop-by-hop headers MUST be handled according to protocol rules.
- Forwarded client identity and scheme headers MUST have a defined trusted-proxy model.
- Protocol upgrades or translation MUST be tested against representative clients and backends.
- Header and request-size limits MUST be explicit and compatible with application requirements.

## MUST NOT
- MUST NOT trust arbitrary client-supplied forwarding headers as authoritative.
- MUST NOT silently rewrite application semantics without a documented contract.
- MUST NOT enable protocol features unsupported by the backend path without compatibility testing.

## SHOULD
- Prefer standards-based forwarding headers or a consistently governed equivalent.
- Keep normalization behavior consistent across redundant traffic tiers.

## Exceptions
Application-specific rewrites require documented ownership, tests, and compatibility expectations.

## Verification
Use protocol tests and packet/request traces to verify headers, methods, status codes, streaming, upgrades, forwarding identity, and size-limit behavior.