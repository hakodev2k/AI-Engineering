# Skill: Session Convergence Analysis

## Purpose
Diagnose whether multiple client surfaces are safe to resume against one logical AI session.

## Trigger
Before device/surface handoff, warm resume, remote attach, app restart restore, or child-conversation restore.

## Inputs
Canonical and surface snapshots conforming to `schemas/session_snapshot.schema.json`.

## Preconditions
The canonical snapshot must come from the authoritative persistence layer or explicitly designated authority.

## Required context
Session ID, canonical version, last durable turn, selected child, writer identity/lease, registration epoch, capture time.

## Allowed tools
Read-only session APIs, metadata queries, local-state inspection, `scripts/convergence_check.py`.

## Constraints
MUST NOT mutate state during diagnosis. MUST NOT infer convergence from matching UI text alone.

## Procedure
1. Capture canonical baseline.
2. Capture each surface within a bounded observation window.
3. Compare identity, version, durable turn, selected child, writer, and registration epoch.
4. Classify mismatches as stale-read, stale-selection, writer-conflict, registration-drift, or unknown.
5. Form one recovery hypothesis per blocking mismatch.
6. Hand off to `workflows/resume-and-reconcile.md`.

## Decision points
Any session-ID mismatch blocks. Any stale version/turn blocks writes. Selected-child mismatch blocks unless explicitly chosen by a human. Conflicting live writer identities block. Unknown critical fields block writes.

## Expected output
Structured mismatch evidence with PASS/BLOCK recommendation.

## Metrics
Mismatch dimensions, durable-turn lag, capture skew, reconciliation attempts.

## Verification
Re-run comparison after remediation and require independent verification.

## Failure handling
If authority state cannot be read, stop write-capable continuation and preserve snapshots.

## Stop conditions
PASS or two failed reconciliation attempts.