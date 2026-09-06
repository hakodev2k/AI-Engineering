# Compatibility and Contract Testing

## Purpose
Prevent model releases from breaking downstream consumers through changed schemas, tool calls, tokenization, output conventions, limits, or behavioral contracts.

## When to use
Use for model/provider swaps, API changes, tool-calling changes, tokenizer changes, structured-output updates, or orchestration upgrades.

## Inputs
Existing contracts, consumer inventory, schemas, golden cases, SDK/runtime versions, and candidate outputs.

## Preconditions
Critical consumers and compatibility expectations are known.

## Context to inspect
Inspect request/response schemas, structured-output parsers, tool definitions, stop conditions, token limits, streaming semantics, error behavior, and client assumptions.

## Core knowledge
AI contracts include both syntactic and behavioral expectations. Schema-valid output may still break consumers if semantics, ordering, determinism, or tool-selection behavior shifts materially.

## Procedure
1. Inventory externally observable contracts.
2. Classify each as strict, tolerant, or best-effort.
3. Run schema and protocol compatibility tests.
4. Replay representative consumer workflows.
5. Compare structured outputs and tool-call behavior with baseline.
6. Test boundary conditions: limits, empty results, malformed inputs, timeouts, and streaming interruptions.
7. Identify consumers requiring coordinated migration.
8. Add compatibility shims only when ownership and retirement are explicit.
9. Record intentional breaking changes and rollout sequence.

## Decision points
Preserve backward compatibility when consumer migration cannot be atomic. Allow breaking changes only with versioning or coordinated cutover and rollback.

## Common failure patterns
Testing only happy-path JSON, undocumented parser assumptions, changed tokenizer limits, incompatible streaming events, and relying on prompt instructions as a strict schema guarantee.

## Verification
Run contract suites against candidate and baseline, then validate at least one end-to-end path for every critical consumer class.

## Expected output
A compatibility matrix, identified breaks, migration actions, and verified release status.

## Stop conditions
Stop when a critical consumer is unknown, a breaking change lacks migration, or contract behavior cannot be reproduced reliably.
