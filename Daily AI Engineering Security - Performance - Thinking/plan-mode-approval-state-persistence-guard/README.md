# Plan Mode Approval State Persistence Guard

## Topic
Fail-closed persistence and action-time verification of plan approval across resume/relaunch boundaries.

## Category
Security

## Problem
A planning-only agent session can become write-capable after reconnect, relaunch, failed user input, or permission-state reconstruction even though the user never accepted the plan. Runtime state saying that Plan Mode ended is not equivalent to authorization.

## Evidence
See `evidence/research.md`. The package is motivated by August 2026 Claude Code reports, including maintainer-reproduced issue #85095, plus official documentation defining Plan Mode as read-only until approval.

## Existing approach
Permission modes, plan approval prompts, model instructions, hooks, and protected-path rules.

## Existing limitations
Permission mode can drift across process/session boundaries; model-visible notices are not durable consent; stale approval can survive a changed plan; advisory instructions cannot repair an already-widened harness permission.

## Proposed improvement
Represent approval as an explicit fact bound to `session_epoch`, `plan_hash`, and `approval_id`. Restore read-only behavior after resume unless that fact exists. Invalidate approval on plan change and require an action-time gate before every mutation.

## Architecture
- `evidence/research.md` — public evidence, existing approaches, gap, root causes.
- `config/policy.json` — portable policy defaults.
- `skills/approval-state-audit.md` — reusable audit procedure.
- `rules/plan-mode-authorization.md` — enforceable invariants.
- `subagents/authorization-reviewer.md` — independent authorization analysis.
- `subagents/verification-agent.md` — independent regression verifier.
- `workflows/diagnose-and-enforce.md` — baseline-to-remediation workflow.
- `workflows/regression-verification.md` — bounded verification workflow.
- `hooks/pre-mutation-approval-gate.md` — blocking hook contract.
- `scripts/approval_gate.py` — dependency-free deterministic gate.
- `tests/test_approval_gate.py` — regression tests.

## Installation
Requires Python 3.9+ for the reference script. Copy this directory as a unit; no external Python packages are required.

## Configuration
Adapt action names and host event serialization to `config/policy.json`. Produce a stable plan digest from the exact plan presented for approval. Increment/change `session_epoch` when the authorization context is intentionally reset.

## Usage
Run tests:

```bash
python -m unittest tests/test_approval_gate.py
```

Evaluate a sanitized authorization trace:

```bash
python scripts/approval_gate.py trace.json --pretty
```

A Plan Mode mutation is acceptable only when the trace reaches it with a valid approval bound to the current plan and epoch.

## Workflow
Observe → capture baseline → diagnose state/provenance mismatch → bind approval durably → enforce pre-mutation gate → replay tests → independent verification.

## Metrics
Unauthorized mutation block rate; valid approval acceptance rate; stale approval rejection rate; resume/relaunch invariant coverage; regression pass rate.

## Verification
The reference implementation was tested with five deterministic cases: unapproved mode drop, unapproved mutation, valid bound approval, stale approval, and approval invalidation after plan change. Integrators must additionally replay host-specific resume/reconnect traces.

## Safety
Fail closed on missing/ambiguous state. Do not widen permissions to recover from an approval error. Do not put secrets or full private prompts in authorization logs. Dangerous or irreversible actions still require the host's explicit human approval and all other applicable security controls.

## Failure handling
**Detection:** gate exit code 2, missing/invalid binding, or unauthorized mode transition. **Evidence:** sanitized event trace and reason code. **Retry:** at most one state reload plus two implementation/verification retries. **Fallback:** read-only/planning mode. **Escalation:** human review or host permission repair. **Stop condition:** any ambiguity about whether the user approved the current plan.

## Implemented / Measured / Verified
- **Implemented:** reference approval-binding policy, deterministic gate, rules, workflows, hook, and tests.
- **Measured:** package tests exercise five authorization-state cases.
- **Verified:** reference tests pass; host integration remains verified only after its own resume/reconnect traces pass the same invariants.

## Definition of Done
Evidence documented; baseline captured; approval identity is durable; plan changes invalidate approval; every mutation is gated; unauthorized resume is blocked; valid approval remains functional; tests and host-specific regression traces pass; independent verification completes; no blocking authorization ambiguity or exposed secret remains.

## Customization
Hosts may add action types, stronger approval signatures, durable stores, or organization policy IDs. They MUST preserve the core invariant that runtime mode transitions are not approval evidence.
