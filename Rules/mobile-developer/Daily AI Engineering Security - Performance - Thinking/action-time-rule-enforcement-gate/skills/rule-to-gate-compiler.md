# Skill — Rule-to-Gate Compiler

## Purpose
Convert critical natural-language project/memory rules into compact observable action gates.

## Trigger
When a rule contains a hard precondition, prohibition, verification step, approval requirement, or costly failure consequence.

## Inputs
Rule text, action taxonomy, available deterministic evidence, freshness semantics, and failure policy.

## Preconditions
Classify the rule as hard requirement versus preference. Preserve the original rule for audit.

## Allowed tools
Repository search, configuration inspection, test/build commands, structured rule registries, deterministic checkers.

## Constraints
Do not encode subjective style preferences as blockers. Do not use hidden reasoning as evidence. Do not weaken security requirements.

## Procedure
1. Extract the governed action class: e.g. `benchmark`, `deploy`, `git-commit`, `direct-launch`, `destructive-write`.
2. Rewrite the rule as an observable invariant: “before benchmark, fresh build evidence must exist”.
3. Identify evidence key(s), producer, expected value, and freshness window/epoch.
4. Define invalidation events such as source change, config change, branch change, or launcher bypass.
5. Define block/review behavior and maximum retries.
6. Add the gate to the registry and create positive, missing, and stale evidence tests.
7. Replay a known violation if available.
8. Measure false-block rate before expanding scope.

## Decision points
- No observable evidence exists: route to `review` or human approval.
- Rule is preference-only: do not compile as a blocker.
- Evidence can be forged by the same unsafe action: require independent producer/verifier.

## Expected output
A gate definition plus tests and evidence-production guidance.

## Metrics
Coverage of governed actions, escaped violations, false blocks, stale-evidence catches, added latency.

## Verification
Independent verifier confirms the gate blocks the historical failure and allows a valid fresh-evidence case.

## Failure handling
Disable only the defective gate definition, not the underlying safety rule; use explicit human review until corrected.

## Stop conditions
Maximum 2 design/test iterations per gate. Stop if deterministic enforcement would discard required correctness context or create unsafe bypass incentives.
