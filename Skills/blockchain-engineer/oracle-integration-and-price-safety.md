# Oracle Integration and Price Safety

## Purpose
Integrate external price/data feeds with freshness, manipulation resistance, fallback behavior, and bounded trust assumptions.

## When to use
Use for lending, derivatives, swaps, collateral, liquidation, settlement, or any contract depending on off-chain/external data.

## Inputs
Required data, feed providers, update cadence, acceptable staleness, precision, fallback policy, economic exposure.

## Preconditions
The protocol has defined how incorrect or unavailable data should affect state transitions.

## Context to inspect
Feed decimals, heartbeat/deviation settings, sequencer status, round metadata, aggregation logic, TWAP windows, fallback feeds, and administrative controls.

## Core knowledge
Oracles are part of the protocol's trust boundary. A valid response can still be stale, manipulated, economically unsuitable, or inconsistent across venues/chains.

## Procedure
1. Define acceptable data quality and freshness thresholds.
2. Normalize units and decimals explicitly.
3. Validate positive/valid ranges and timestamp freshness.
4. Handle L2 sequencer downtime when relevant.
5. Compare feed design against manipulation and liquidity assumptions.
6. Define fallback or fail-closed behavior.
7. Bound price changes where protocol economics justify it.
8. Test stale, missing, extreme, and recovered-feed scenarios.
9. Monitor update lag and divergence in production.

## Decision points
Use robust external feeds for high-value settlement; use TWAPs only when underlying liquidity and manipulation costs are sufficient for the risk window.

## Common failure patterns
Ignoring decimals, accepting stale rounds, using spot DEX prices for thin markets, unsafe fallback switching, and treating oracle availability as guaranteed.

## Verification
Fork/integration tests cover stale, extreme, paused, and recovery cases; monitoring confirms freshness assumptions in production.

## Expected output
Oracle trust model, validation rules, fallback policy, tests, and monitoring thresholds.

## Stop conditions
Escalate when data manipulation cost is materially below protocol value at risk.