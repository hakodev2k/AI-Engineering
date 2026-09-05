# Skill: Classify Tool Risk

## Purpose
Determine whether a tool call is read-only, side-effecting, and replay-sensitive before execution.

## Inputs
Tool schema/documentation, implementation, target environment, operation arguments, existing retry behavior.

## Preconditions
Tool identity and intended operation are known.

## Allowed tools
Repository read/search, official tool documentation, tests, non-mutating inspection.

## Constraints
Do not infer safety from HTTP method or tool name alone. Evidence must identify actual side effects.

## Process
1. Locate tool implementation/adapter and call sites.
2. Identify external systems and mutable state touched.
3. Determine whether repeated identical requests are naturally idempotent.
4. Determine whether provider supports an idempotency key or operation token.
5. Classify risk: low, medium, high, or critical.
6. For every side-effecting call define a stable semantic request fingerprint.
7. Define idempotency-key scope and storage lifetime.
8. Record evidence and hand classification to Execution Planner.

## Expected output
Tool, operation, side-effecting boolean, risk, natural idempotency evidence, provider support, key strategy, fingerprint fields, unresolved risks.

## Verification
Classification must cite implementation/docs/test evidence.

## Failure handling
Unknown semantics are not treated as safe; classify conservatively and escalate.

## Stop conditions
Production-only behavior cannot be inspected safely, required permission is missing, or action semantics remain ambiguous.