# Workflow: Resume Transition Verification

## Trigger
Before a resumed/follow-up/retargeted child-agent turn can invoke any tool.

## Goal
Prove that effective permissions match the intended transition contract and prevent unauthorized authority drift.

## Inputs
Previous effective child snapshot, current parent policy, selected role policy, immutable restrictions, explicit overrides, effective resumed-turn snapshot.

## Baseline
Record mismatch rate and transition-audit coverage from representative existing runs before enabling blocking mode.

## Context
Authorization state is security-critical lifecycle state. A reused session identifier does not imply that its old permissions remain correct.

## Stages
1. **Observe** — collect authoritative previous/current snapshots and provenance.
2. **Measure baseline** — record current transition mismatch behavior on test/replay fixtures.
3. **Diagnose** — determine whether the transition preserves stale state, resets to defaults, or loses provenance.
4. **Form hypothesis** — identify resolver/precedence/lifecycle path responsible.
5. **Implement improvement** — repair resolver or transition code without broadening policy.
6. **Measure again** — rerun fixtures and record mismatch counts.
7. **Verify** — independent Permission Verifier executes the deterministic gate.
8. **Complete** — only verified matches may execute tools.

## Responsible agent
Runtime implementer owns code changes; `subagents/permission-verifier.md` independently owns final verification.

## Tools
Runtime policy introspection, package checker, unit/integration tests, security log inspection.

## Outputs
Expected/effective policy evidence, classification, before/after metrics, final verification status.

## Checkpoints
- CP1: all authoritative inputs captured
- CP2: expected envelope derived and hashed
- CP3: effective runtime state captured before tool execution
- CP4: deterministic comparison complete
- CP5: independent verification complete

## Metrics
Transition mismatch rate, unapproved broadening blocked, restrictive/stale drift detected, transition audit coverage, false positives.

## Retry policy
Snapshot collection may retry twice for transient availability only. A confirmed mismatch receives zero automatic authorization retries. A code repair cycle may repeat at most three times with a changed hypothesis or implementation.

## Stop conditions
Stop successfully only on exact verified match or an explicitly approved/versioned intentional change. Stop unsuccessfully on unapproved broadening, missing provenance after two collection retries, or three unsuccessful repair cycles.

## Failure path
Capture evidence -> block child tools -> classify cause -> hand off to runtime/security owner -> require human approval for any authority broadening.

## Verification
Tests must demonstrate correct inheritance and rejection/detection of restrictive reset, stale-role state, broadening, and malformed inputs.

## Definition of Done
Evidence documented; baseline captured; expected envelope defined; checker integrated; tests pass; before/after comparison recorded; security boundaries unchanged or tightened; independent verifier records Verified; no blocking issue remains.
