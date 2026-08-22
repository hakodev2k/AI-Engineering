# Skill: Guardrail Session Integrity Analysis

## Purpose
Verify that terminal agent state is structurally coherent, guardrail-consistent, replay-valid, and safe to resume.

## Trigger
Run after output guardrail tripwires/exceptions, max-turn handlers, cancellation, resumed approval turns, streaming terminal events, or before replaying persisted state.

## Inputs
Normalized session JSON, active integrity policy, terminal reason, optional equivalent streaming/non-streaming history.

## Preconditions
- Every tool invocation has a stable call ID.
- Side-effecting tools are labeled.
- The host can identify blocked/rejected terminal output.

## Required context
Runtime version, session strategy, guardrail behavior, terminal path, and whether tool execution already occurred.

## Allowed tools
Read-only session/trace inspection, deterministic scripts, test fixtures, framework documentation, version changelogs.

## Constraints
- MUST NOT replay a side-effecting tool to repair missing history.
- MUST preserve accepted prior turns.
- MUST distinguish rejected final output from completed tool effects.
- MUST NOT treat repair-on-read as proof that durable storage is valid.

## Procedure
1. Snapshot durable session state before any repair.
2. Normalize items into `user`, `function_call`, `function_call_output`, `assistant`, and terminal metadata.
3. Run `scripts/session_integrity.py` against the policy.
4. Confirm every tool call/output is paired by call ID.
5. Confirm terminal reason and guardrail verdict are explicit.
6. If a blocked terminal tool output is retained, confirm payload policy/redaction marker.
7. For side-effecting executed tools, require durable commit evidence; never auto-replay.
8. When comparison histories exist, normalize and compare streaming/non-streaming semantics.
9. Classify recovery: safe retain, safe discard current suffix, or manual review.
10. Have an independent verifier rerun the deterministic checks.

## Decision points
- Orphan call/output: invalid; block resume until repaired without side-effect replay.
- Side effect executed but commit evidence uncertain: manual review.
- Rejected payload retained contrary to policy: invalid and security-sensitive.
- Streaming parity mismatch: invalid for equivalence claims.

## Expected output
Integrity verdict, violations, affected call IDs, replay risk, recovery class, and verification status.

## Metrics
Orphan count, terminal-reason coverage, blocked-payload leakage count, parity mismatch count, manual-review count.

## Verification
All deterministic tests pass and the verifier independently inspects at least one failure fixture.

## Failure handling
Fail closed for replay. Preserve raw state, do not mutate evidence, and require manual resolution where side effects may already exist.

## Stop conditions
Stop automatic recovery when a side effect cannot be proven committed/uncommitted, when history provenance is ambiguous, or after one failed deterministic repair attempt.
