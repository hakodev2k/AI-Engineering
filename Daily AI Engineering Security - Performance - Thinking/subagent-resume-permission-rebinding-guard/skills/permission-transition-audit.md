# Skill: Permission Transition Audit

## Purpose
Verify that a resumed or retargeted child agent begins its next turn with the authorization contract intended for that lifecycle transition.

## Trigger
Run before the first tool call of any resumed child turn and whenever parent mode, child role, explicit overrides, or sandbox/approval configuration changes.

## Inputs
- previous child effective policy snapshot
- current parent policy
- selected child role policy
- immutable restrictions
- explicit transition overrides
- current runtime effective policy snapshot
- `config/policy.json`

## Preconditions
All snapshots MUST come from runtime-observed state or authoritative configuration, not model claims. Policy records MUST identify the child session and transition event.

## Required context
Only normalized permission fields and provenance required to decide the transition. Do not inject unrelated conversation history.

## Allowed tools
Read-only configuration/session inspection, the deterministic checker in `scripts/permission_rebinding_guard.py`, test runner, and security logging.

## Constraints
Never broaden authority to make the transition pass. Never infer approval from a previous turn unless the configured contract explicitly says it persists. Never let the child agent self-author its expected policy.

## Procedure
1. Capture previous effective child permissions.
2. Capture current parent policy and selected role policy.
3. Apply precedence: immutable restrictions -> explicit current transition override -> selected role policy -> configured inheritance/default rule.
4. Materialize the expected normalized permission envelope.
5. Capture effective runtime permissions for the resumed turn before tools execute.
6. Run the deterministic checker.
7. Classify differences as `broadening`, `restrictive_drift`, `stale_role_policy`, `missing_provenance`, or `match`.
8. Block unapproved broadening and missing security-critical provenance.
9. Treat restrictive/stale drift as a blocking configuration defect for the affected task rather than silently continuing with altered semantics.
10. Record hashes and diff without secrets.

## Decision points
- If effective permissions exceed expected permissions, block and escalate.
- If effective permissions are narrower, stop the child before tool execution and require runtime/config repair or an explicit new contract.
- If role identity changed, stale permissions from the previous role are never accepted solely because they already existed.
- If parent policy changed, re-resolve rather than replaying a cached envelope.

## Expected output
Structured transition record with session/transition identifiers, expected/effective hashes, normalized differences, classification, decision, and evidence timestamp.

## Metrics
Mismatch rate, blocked broadening count, restrictive drift count, coverage of transitions audited, and false-positive rate.

## Verification
Use fixtures representing correct inheritance, restrictive reset, stale previous-role permissions, and unapproved broadening. The implementing component MUST NOT be the only verifier for production policy changes.

## Failure handling
Malformed/missing policy inputs fail closed. Retry collection at most twice when the runtime snapshot is temporarily unavailable. Do not retry a confirmed mismatch automatically.

## Stop conditions
Stop when the transition is a verified match, or when a mismatch/provenance failure is recorded and execution is blocked pending repair or explicit human authorization.
