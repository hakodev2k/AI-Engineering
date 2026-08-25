# Skill: Transcript Integrity Analysis

## Purpose
Diagnose silent loss of user-facing assistant text across emission, persistence, export, resume, and presentation boundaries.

## Trigger
A user reports missing/intermittent messages; transcript audit differs from observed stream; or a long multi-tool turn completes without reliable delivery evidence.

## Inputs
Emission ledger, persisted transcript, product/version, session/run IDs, optional UI acknowledgement ledger.

## Preconditions
Capture must start before reproducing. Do not use hidden chain-of-thought as evidence.

## Required context
Event schema, lifecycle transitions, persistence path, UI hydration path, and completion semantics.

## Allowed tools
Read-only logs, JSONL parser, reference `scripts/transcript_guard.py`, test runner.

## Constraints
Do not mutate production transcripts during diagnosis. Do not log secrets unnecessarily. User-facing text may be hashed if raw retention is restricted.

## Procedure
1. Define the required delivery stages for the product.
2. Measure baseline emitted/persisted counts over a bounded representative sample.
3. Reproduce with a turn containing at least three user-facing text segments separated by tool calls.
4. Assign or extract stable event IDs at emission.
5. Reconcile with `transcript_guard.py`.
6. Classify loss boundary: capture, persistence, completion flush, hydration/rendering, or export.
7. Form one evidence-backed hypothesis.
8. Implement one boundary fix.
9. Repeat the same fixture and baseline sample.
10. Hand results to an independent verifier.

## Decision points
If emission itself lacks user-facing text, stop: this is not a delivery-loss defect. If emitted text exists but persistence does not, fix persistence before UI. If persistence is correct but UI is not, keep the durable transcript as source of truth and fix hydration/rendering.

## Expected output
Facts, assumptions, evidence IDs, failure boundary, hypothesis, before/after metrics, and verification status.

## Metrics
Missing IDs, mismatches, integrity rate, sample size, regression count.

## Verification
Every emitted required event must match one persisted event by ID and content hash; presentation checks are added when the client exposes acknowledgements.

## Failure handling
Retry one flush/read to exclude delayed persistence. If mismatch remains, preserve evidence and block verified completion.

## Stop conditions
Stop after two failed implementation hypotheses or when the failure cannot be reproduced with instrumented capture; escalate with evidence rather than continuing indefinitely.