# Consensus and Finality

## Purpose
Align application behavior with the actual confirmation and reorganization properties of the chain.

## Scope
Block confirmations, finality, forks, reorganizations, chain halts, and consensus-dependent workflows.

## MUST
- Define the required confirmation/finality threshold by operation risk.
- Model chain reorganizations for workflows that react before deterministic finality.
- Keep pending, confirmed, and finalized states distinct when the chain semantics require it.
- Define recovery behavior for orphaned transactions and reverted observations.
- Reconcile off-chain state after detected reorganizations.

## MUST NOT
- Treat a transaction appearing in one block as universally final.
- Build irreversible off-chain effects on weak confirmation without explicit risk acceptance.
- Assume all supported networks share the same finality model.

## SHOULD
- Increase confirmation thresholds with economic value and reorg exposure.

## Exceptions
Low-latency pre-finality actions require bounded exposure, compensating controls, and documented acceptance.

## Verification
Simulate reorgs where practical, inspect confirmation logic, test state reconciliation, and review network-specific finality assumptions.