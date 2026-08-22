# Connectivity Cost Rules
## Purpose
Respect metered, roaming, constrained, and low-bandwidth mobile connections.
## Scope
Large downloads/uploads, media, sync, prefetch, updates, and network-quality adaptation.
## MUST
- Large nonessential transfers MUST consider user intent, network constraints, and platform data-saver signals where available.
- Interrupted large transfers MUST support safe resume or restart semantics appropriate to cost.
- Media quality adaptation MUST not corrupt required fidelity or user expectations.
## MUST NOT
- Background prefetch MUST NOT consume unbounded metered data.
- Connectivity type MUST NOT be treated as a reliable proxy for actual bandwidth or latency.
## SHOULD
- Defer optional high-volume transfers to favorable conditions when product latency allows.
## Exceptions
User-initiated urgent transfers may proceed on costly networks with clear expectation.
## Verification
Test constrained/metered networks, roaming policy where simulatable, throttled bandwidth, interrupted transfers, and data-saver modes.