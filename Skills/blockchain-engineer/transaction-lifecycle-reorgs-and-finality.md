# Transaction Lifecycle, Reorgs, and Finality

## Purpose
Model transaction submission, mempool state, inclusion, replacement, confirmation, reorg, and finality so applications do not confuse broadcast with durable execution.

## When to use
Use for wallets, relayers, payment flows, automation, settlement services, and user-facing transaction status.

## Inputs
Chain type, confirmation policy, nonce model, fee strategy, replacement rules, business finality requirements.

## Preconditions
The application has defined what constitutes submitted, included, confirmed, and final.

## Context to inspect
Pending transaction tracking, receipts, block hashes, nonce state, replacement logic, fee bumping, dropped transaction handling, and reorg behavior.

## Core knowledge
A transaction may be accepted by an RPC but never included; included transactions may be reorganized; replacement may supersede prior hashes; finality varies by chain and rollup.

## Procedure
1. Define explicit transaction states.
2. Track sender, nonce, hash, submitted fee parameters, and timestamps.
3. Treat RPC submission success as broadcast acknowledgement only.
4. Poll or subscribe for receipts with block hash/number.
5. Apply chain-appropriate confirmation/finality thresholds.
6. Detect receipt disappearance or block-hash changes.
7. Handle dropped and replaced transactions using nonce-aware logic.
8. Make downstream side effects idempotent.
9. Surface pending/replaced/reverted/final states accurately to users.
10. Test provider timeouts, fee spikes, replacements, and reorgs.

## Decision points
Use aggressive replacement only for time-sensitive actions; avoid fee escalation loops when business value does not justify them.

## Common failure patterns
Marking broadcast as success, relying only on transaction hash, resubmitting with conflicting nonces, treating one confirmation as universal finality, and duplicating off-chain effects after reorgs.

## Verification
Simulation tests cover dropped, replaced, reverted, and reorganized transactions and prove consistent final business state.

## Expected output
Transaction state machine, confirmation policy, replacement rules, and tested recovery behavior.

## Stop conditions
Escalate when chain-specific finality guarantees are insufficient for the business settlement requirement.