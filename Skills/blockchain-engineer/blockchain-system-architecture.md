# Blockchain System Architecture

## Purpose
Design end-to-end blockchain systems with explicit trust boundaries, on-chain/off-chain responsibilities, data ownership, failure modes, and operational constraints.

## When to use
Use for new decentralized applications, protocol integrations, major architecture changes, or design reviews. Do not use as a substitute for detailed smart-contract implementation.

## Inputs
Business requirements, trust assumptions, target chains, transaction volume, latency needs, asset model, custody model, compliance constraints, integration requirements.

## Preconditions
Core product goals and threat assumptions are defined well enough to compare designs.

## Context to inspect
Existing contracts, node providers, wallets, indexers, relayers, bridges, databases, key-management approach, deployment pipelines, monitoring, and incident history.

## Core knowledge
Blockchain architecture is constrained by deterministic execution, public state, gas/resource pricing, probabilistic/finalized settlement, immutable history, cryptographic identity, and adversarial environments. Senior design must separate what truly requires consensus from what belongs off-chain.

## Procedure
1. Define actors, assets, trust assumptions, and invariants.
2. Identify state that must be on-chain versus state that can remain off-chain.
3. Select chain or rollup based on security, cost, throughput, ecosystem, and finality.
4. Define contract boundaries and upgradeability policy.
5. Define wallet, custody, signing, and key-rotation flows.
6. Map external integrations, oracles, indexers, relayers, and bridges.
7. Design event schemas and off-chain projections.
8. Define idempotency, replay, reorg, and retry handling.
9. Define observability and incident boundaries.
10. Validate cost, latency, throughput, and security under representative scenarios.

## Decision points
Choose on-chain execution only when shared trustless state or settlement is required. Prefer off-chain computation when determinism, privacy, cost, or throughput would otherwise be problematic.

## Common failure patterns
Putting excessive logic on-chain, unclear asset ownership, unsafe upgrade authority, hidden custodial trust, assuming immediate finality, and treating event streams as perfectly ordered.

## Verification
Review architecture against invariants, gas estimates, chain-finality behavior, threat model, node/provider failure scenarios, and integration tests.

## Expected output
Architecture diagram, trust-boundary map, contract/off-chain responsibility matrix, failure-mode list, operational assumptions, and unresolved risks.

## Stop conditions
Escalate when custody, regulatory, upgrade authority, or irreversible asset-loss risks cannot be resolved.