# Skill: Investigate Replay Safety

## Purpose
Determine whether retrying an operation can duplicate durable side effects such as rows, payments, messages, emails, jobs, or external API mutations.

## When to use
Use for retry-enabled HTTP handlers, queue consumers, background jobs, webhook handlers, agent tool calls, and incident reports involving duplicates.

## Inputs and preconditions
Provide the operation/entry point, expected business effect, retry source, repository access, relevant tests, and—when available—logs or traces. Work from a clean or understood Git state.

## Allowed tools
Repository search/read, static scan, test runner, build tools, local database/test containers, and read-only logs. Production mutation is not allowed.

## Process
1. Identify the entry point and every caller capable of retrying it.
2. Trace the operation until each durable or externally visible side effect is located.
3. Run `python scripts/scan-replay-risk.py <repo> --output replay-risk.json` and treat results as leads, not proof.
4. Record transaction boundaries, unique constraints, deduplication keys, outbox/inbox behavior, and external idempotency support.
5. Determine the replay identity: which stable key represents one logical request across retries.
6. Build a timeline for first attempt, timeout/crash point, and retry. Include the case where the first attempt committed but its acknowledgement was lost.
7. Classify each side effect as naturally idempotent, protected, compensatable, or duplicate-prone.
8. Validate hypotheses with existing tests or a local/integration replay test using the same key.
9. Produce the investigation contract defined by `schemas/investigation-result.schema.json`.

## Expected output
Evidence-backed findings with file/line or test/log references, confidence, risk, recommended action, and verification state.

## Verification
A safe conclusion requires a replay test plus evidence that each side effect is protected. Absence of observed duplicates is not sufficient by itself.

## Failure handling and stop conditions
Retry transient test/tool failures at most twice, preserving output. Stop on missing permissions, unknown production effects, unavailable required infrastructure, or any action requiring approval. Mark unproven claims as hypotheses.
