# Safe Proof of Concept Development

## Purpose
Create minimal, reproducible proof-of-concept evidence that demonstrates a vulnerability without unnecessary weaponization, persistence, data access, or operational risk.

## When to use
Use when a finding cannot be convincingly validated through configuration, logs, or simple request evidence alone.

## Inputs
Validated hypothesis, target constraints, authorization, expected safe signal, and cleanup requirements.

## Context to inspect
Inspect target stability, side effects, data sensitivity, rate limits, available test resources, monitoring, and rollback options.

## Core knowledge
A good PoC proves the security property that fails, not the maximum harm possible. Determinism, bounded side effects, clear prerequisites, and cleanup make evidence useful to engineering teams.

## Procedure
1. Define exactly what the PoC must prove.
2. Choose the least invasive observable signal.
3. Use test data and isolated resources where possible.
4. Bound iterations, concurrency, payload size, and execution time.
5. Add explicit safety checks and target allowlisting to reusable scripts.
6. Avoid persistence and automatic propagation.
7. Capture request/input and expected vs observed result.
8. Run once, assess impact, then repeat only if needed for confidence.
9. Remove artifacts and verify rollback.
10. Provide remediation-focused reproduction instructions.

## Decision points
Prefer a single request or controlled state change over arbitrary code execution when both prove the same boundary failure. Do not publish weaponized details beyond the authorized audience.

## Common failure patterns
Building exploit frameworks instead of evidence, hardcoding credentials, unsafe default targets, unbounded loops, destructive payloads, and leaving test artifacts.

## Verification
PoC must reproduce reliably in the authorized environment, demonstrate only the claimed behavior, and leave no unintended state.

## Expected output
Minimal PoC evidence or code with prerequisites, safety constraints, expected signal, cleanup, and remediation context.

## Stop conditions
Stop if safe proof is impossible, target behavior becomes unstable, or further exploitation would exceed authorization.