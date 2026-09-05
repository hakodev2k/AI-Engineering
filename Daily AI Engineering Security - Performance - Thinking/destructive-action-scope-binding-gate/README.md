# Destructive Action Scope Binding Gate

**Category:** Security  
**Run date:** 2026-09-06 (UTC+7)

## Problem
Coding agents can perform destructive filesystem or task-lifecycle actions without a confirmation that is bound to the exact action, exact targets, and current state. Recent Codex reports show deletion scope expansion and configured approval controls not firing for destructive actions.

## Evidence
See `evidence/research.md`.

## Existing approach
Sandbox writable roots, approval policies, command rules, human confirmation, and agent telemetry are established controls. OpenAI documents sandboxing and approvals as complementary controls for high-risk actions.

## Existing limitations
A writable root only defines where an operation may occur, not whether a particular destructive mutation was intended. Session-level or action-class approval can be over-broad. Model-derived intent can expand a narrow user request into a broader deletion set. Approval can also be bypassed when a command is classified as already authorized.

## Proposed improvement
Require a deterministic authorization envelope before any destructive operation. The envelope binds actor, operation type, normalized targets, target-state fingerprints, user-intent evidence, approval mode, expiry, and a nonce. Execution is rejected if the planned mutation is not an exact subset of the approved envelope or if target state changed after approval.

## Architecture
- `evidence/research.md`
- `skills/destructive-action-assessment.md`
- `rules/destructive-action-policy.md`
- `subagents/security-verifier.md`
- `workflows/authorize-execute-verify.md`
- `hooks/pre-destructive-action.md`
- `scripts/scope_gate.py`
- `config/policy.example.json`
- `examples/approval-envelope.example.json`
- `tests/test_scope_gate.py`

## Installation
Python 3.10+, standard library only.

## Configuration
Define destructive operation classes and protected roots in `config/policy.example.json`. Integrate the hook immediately before filesystem deletion, overwrite, repository reset/clean, cloud/resource deletion, or task archival/destruction.

## Usage
`python scripts/scope_gate.py config/policy.example.json examples/approval-envelope.example.json planned-action.json`

Exit 0 permits the exact planned action. Exit 2 blocks authorization mismatch. Exit 1 indicates invalid inputs and also blocks execution.

## Workflow
Observe intent -> classify mutation -> collect exact targets -> fingerprint current state -> request/resolve approval -> run scope gate -> execute once -> verify postconditions and audit log.

## Metrics
Unauthorized destructive attempts blocked; approval-to-action target mismatch rate; stale approval blocks; destructive actions with exact target coverage; recovery incidents; false-positive review rate.

## Verification
**Implemented:** deterministic gate, policy, hook, workflow, and tests.  
**Measured:** authorization and target mismatch metrics are emitted from real planned-action fixtures.  
**Verified:** negative tests block broadened targets and stale state; allowed test permits only exact approved mutations; independent reviewer verifies audit evidence.

## Safety
The gate never grants new permissions. It only narrows existing execution authority. Unknown target state, ambiguous intent, missing approval, or invalid envelope is blocking. Dangerous or irreversible actions require explicit human approval when policy marks them `human_required`.

## Failure handling
Detection: nonzero gate result or missing evidence. Retry at most once after rebuilding the envelope from current state. Fallback: no destructive action. Escalation: human/security owner. Stop after the second failed authorization attempt.

## Definition of Done
Evidence documented; destructive classes configured; exact target and state binding active; broadened-target tests blocked; stale approval blocked; authorized fixture passes; audit fields complete; independent verifier passes; no secrets stored.

## Customization
Add operation classes or organization-specific protected roots without weakening exact-subset, state-binding, or human-approval invariants.