# Task Mutation Postcondition Verifier

**Category:** Thinking

## Problem
Archive/delete/move/rename are state transitions, not just RPC calls. Recent Codex Windows reports show archive can fail after an update even while source sessions remain readable and intact. Automation that trusts invocation or a UI action can therefore report false success or chain unsafe dependent cleanup.

## Evidence
See `evidence/research.md`. Primary current signals are OpenAI Codex issues #39492 and #39270 from 2026-08-18/19.

## Existing approach
Trust RPC status, trust UI disappearance, retry the same mutation, or manually inspect storage after a failure.

## Existing limitations
RPC acknowledgement is not durable-state proof; authoritative state can span API/database/filesystem; eventual consistency requires bounded observation; repeated deterministic failures waste time without new evidence.

## Proposed improvement
Declare observable postconditions before mutation, snapshot pre-state, collect the operation result as evidence, snapshot post-state, and classify with a deterministic read-only verifier. Dependent destructive actions stay blocked unless the result is `verified-success`.

## Architecture
```text
pre-state snapshot
  -> declared postconditions
  -> caller performs mutation
  -> operation result captured
  -> post-state observation
  -> verify_postconditions.py
  -> independent mutation verifier
  -> unlock dependents only on verified-success
```

## Package tree
```text
README.md
evidence/research.md
skills/verify-mutation-postconditions.md
rules/mutation-verification-rules.md
subagents/mutation-verifier.md
workflows/verify-control-plane-mutation.md
hooks/post-mutation-verify.md
scripts/verify_postconditions.py
tests/test_verify_postconditions.py
```

## Installation
Python 3.9+ standard library only. Integrate the hook after the mutation response but before any dependent cleanup/delete step.

## Snapshot format
Snapshots are metadata JSON objects. Include a stable `resource_id` plus authoritative fields such as `status`, `archive_present`, `source_present`, or API-visible lifecycle state.

Expectation example:
```json
{
  "required": [
    {"path":"status","op":"eq","value":"archived"}
  ]
}
```
Supported operators: `eq`, `ne`, `exists`, `absent`.

## Usage
```bash
python scripts/verify_postconditions.py --pre pre.json --post post.json --expect expect.json
```
Exit codes: `0` verified success, `2` verified failure, `4` indeterminate, `3` malformed input/environment.

## Workflow
Use `workflows/verify-control-plane-mutation.md`: baseline, pre-snapshot, declare postconditions, external mutation, post-snapshot, deterministic check, at most three total observations within the consistency deadline, independent review, then gate dependents.

## Metrics
Verified success/failure/indeterminate rates, false-success incidents, verification latency, identical retry count, recovery time, and unsafe dependent actions blocked.

## Verification
Run:
```bash
python -m unittest tests/test_verify_postconditions.py
```
Then integration-test at least: successful archive, deterministic archive error with unchanged state, delayed eventual-consistency success, conflicting resource identity, and unavailable authoritative observation source.

## Safety
The package is read-only. It does not retry archive/delete or repair databases/filesystems. `indeterminate` never becomes success. Irreversible dependent actions require verified postconditions and any separately required human approval.

## Failure handling
Observation is bounded to three checks. Mutation retries are never automatic. Conflicting or unavailable evidence yields `indeterminate` and escalation with captured facts.

## Definition of Done
- evidence and existing limitations documented;
- pre-state and postconditions captured;
- deterministic tests pass;
- integration baseline and metrics collected;
- no dependent destructive action proceeds on failure/indeterminate;
- independent verifier agrees with classification;
- no blocking issue remains.

## Status
**Implemented:** complete reusable package and deterministic checker.

**Measured:** after adoption records real mutation telemetry.

**Verified:** after tests and integration scenarios demonstrate correct classification and dependent-action gating.

## Customization
Add product-specific authoritative fields and postconditions without weakening the core invariant: completion is a verified observed state, not merely an attempted command.
