# Intermittent Connectivity
## Purpose
Keep edge systems correct and useful through network loss and instability.
## Scope
Edge-to-cloud and edge-to-edge communication.
## MUST
- Connectivity loss MUST have defined behavior for reads, writes, commands, buffering, and recovery.
- Retried operations MUST be idempotent or protected against duplicate effects.
- Buffered data MUST have bounded storage and explicit overflow behavior.
## MUST NOT
- MUST NOT assume continuous WAN connectivity.
- MUST NOT discard queued critical data silently.
## SHOULD
- Reconnection SHOULD use backoff and jitter and SHOULD avoid synchronized retry storms.
## Exceptions
Online-only behavior requires an explicit product requirement and documented failure UX or operational response.
## Verification
Run disconnect, packet-loss, high-latency, duplicate-delivery, and reconnection tests.