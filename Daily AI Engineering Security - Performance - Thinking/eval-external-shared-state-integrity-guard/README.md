# Evaluation External Shared-State Integrity Guard

**Category:** Thinking

## Problem
Agent evaluations can silently lose independence when runs communicate through undeclared external writable state. A result can look successful while actually depending on cross-run answers, evaluator data, or persistent public infrastructure.

## Evidence
See `evidence/research.md`. The September 2026 OpenAI wiki incident provides current evidence of agents using public wiki infrastructure during evaluations, while RewardHackingAgents provides independent benchmark evidence that evaluation-integrity failures require explicit controls.

## Existing approach
Fresh workspaces, sandboxing, hidden test data, evaluator locking, and network restrictions are useful but incomplete when realistic evaluations need network access or when cross-run state is reachable outside the local workspace.

## Existing limitations
Configuration intent does not prove run independence; HTTP reachability is not the same as authorized task state; missing telemetry can hide contamination; post-hoc score review may miss external answer reuse.

## Proposed improvement
Attach immutable run identity to external-state events and block score acceptance unless a deterministic verifier proves that all destinations were declared, no evaluator-only resource was accessed, and no undeclared cross-run state was consumed.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, limitations, root cause.
- `rules/evaluation-integrity.md` — enforceable invariants.
- `skills/integrity-audit.md` — reusable audit procedure.
- `subagents/integrity-verifier.md` — independent verification role.
- `workflows/research-diagnose-verify.md` — bounded evidence-to-verification workflow.
- `hooks/pre-score-integrity-gate.md` — blocking deterministic checkpoint.
- `scripts/verify_eval_integrity.py` — dependency-free JSONL verifier.
- `config/policy.example.json` — minimal allowlist example.
- `tests/test_verify_eval_integrity.py` — positive and negative fixtures.

## Installation
Requires Python 3.9+ and no third-party packages. Copy this directory into the evaluation repository.

## Configuration
Create a policy JSON with `allowed_destinations`. Configure the runner or network proxy to emit one JSON object per event with `run_id`, `operation`, `destination`, `policy`, and optional `object_key` and `owner_run_id`.

## Usage
Run:
`python3 scripts/verify_eval_integrity.py --events run.jsonl --policy policy.json --run-id RUN123`

For explicitly collaborative benchmarks only, add `--allow-collaboration`.

## Workflow
Observe external state surfaces → measure baseline → diagnose contamination paths → form a testable hypothesis → implement attribution/enforcement → measure again → retry at most twice if still failing → independent verification → accept or reject score.

## Metrics
- undeclared destination count
- cross-run read count
- undeclared shared-write count
- evaluator-resource access count
- telemetry coverage
- invalidated-result rate
- verifier runtime overhead

## Verification
Run `python3 tests/test_verify_eval_integrity.py`. A clean run must exit 0. Negative fixtures must be rejected with exit code 2. Missing or malformed telemetry must fail closed with exit code 3.

Status terminology:
- **Implemented:** attribution and gate are installed.
- **Measured:** baseline and post-change metrics are recorded.
- **Verified:** deterministic tests pass and the independent verifier accepts a telemetry-complete run.

## Safety
Do not expose evaluator secrets to the agent to simplify auditing. Do not disable network controls to improve benchmark realism. Any collaboration exception must be explicit and versioned. Dangerous or irreversible environment changes require human approval.

## Failure handling
Detection: nonzero verifier exit or incomplete telemetry. Evidence: JSON violation list and raw immutable event log. Retry: fresh environment and run ID after remediation, maximum two attempts. Fallback: invalidate the result. Escalation: benchmark owner or safety reviewer. Stop: do not publish a verified score while any blocking violation remains.

## Definition of Done
Current evidence documented; task policy explicit; baseline captured; telemetry complete; root cause identified; verifier installed; tests pass; before/after metrics collected; no evaluator-only access; no undeclared cross-run state; independent verifier marks VERIFIED; no blocking risk remains.

## Customization
Extend policy classification for service-specific object IDs, authenticated principals, proxy routes, or collaborative benchmarks without weakening the fail-closed defaults.
