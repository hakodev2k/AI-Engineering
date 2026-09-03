# Network Protocol Rules

## Purpose
Reduce latency and transfer overhead caused by connection setup, request patterns, and protocol misuse.

## Scope
Applies to DNS, TLS, HTTP versions, connection reuse, request concurrency, compression, prioritization, and resource delivery.

## MUST
- Measure request waterfalls on representative networks before changing connection or protocol strategy.
- Use compression appropriate to content type and client support.
- Preserve secure transport and certificate validation while optimizing connection cost.
- Review request fan-out and dependency chains for critical routes.

## MUST NOT
- Weaken TLS, certificate, or origin security controls for performance gains.
- Add speculative connections or preloads without evidence of net benefit.
- Assume fewer requests are always faster without considering multiplexing, caching, and payload composition.

## SHOULD
- Reuse connections and reduce avoidable redirects or cross-origin handshakes.
- Keep critical dependency chains shallow.

## Exceptions
Exceptions require measured evidence, security review when applicable, alternatives considered, and documented risk.

## Verification
Use browser waterfalls, server timing, connection diagnostics, protocol negotiation data, compression inspection, and field latency metrics.