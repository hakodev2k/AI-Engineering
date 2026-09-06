# Subagent Task Routing Integrity Guard

**Category:** Thinking  
**Date:** 2026-09-06 (Vietnam time, UTC+7)

## Problem
Delegated-agent events can be misrouted, silently lost, or correlated to the wrong task. When parent agents accept those events as evidence, they can reason from the wrong worker state, wait indefinitely, or report completion for work that belongs elsewhere.

## Evidence
Current evidence is documented in `evidence/research.md`. The strongest new signal is OpenAI Codex issue #42935 from 2026-09-05, with additional lifecycle/race evidence from Codex issues #13244 and #31036.

## Existing approach
Agent runtimes generally maintain thread/task IDs, spawn metadata, watcher subscriptions, and child status. These mechanisms are necessary but do not guarantee a single immutable correlation contract across dispatch, reception, lifecycle reconciliation, retries, and historical task references.

## Existing limitations
Valid-looking task IDs can still point to unrelated tasks; watcher races can lose terminal notification; interrupted children can leave parents waiting; and natural-language progress can contaminate identity reasoning.

## Proposed improvement
Require a machine-readable lineage envelope for every delegated event and validate it against canonical spawn state before the parent mutates task state. Cross-task destinations fail closed unless explicitly authorized. Terminal events are reconciled with canonical worker state through a bounded recovery path.

## Architecture
- `evidence/research.md` — current public evidence, existing approaches, limitations, and root cause.
- `skills/routing-integrity-analysis.md` — reusable analysis and verification procedure.
- `rules/task-routing-invariants.md` — enforceable lineage and lifecycle rules.
- `subagents/routing-verifier.md` — independent read-only verifier role.
- `workflows/route-and-verify.md` — bounded observe/diagnose/enforce/reconcile workflow.
- `hooks/pre-dispatch-route-check.md` — blocking deterministic dispatch hook.
- `scripts/verify_route.py` — dependency-free lineage validator.
- `tests/test_verify_route.py` — positive/negative regression tests.

## Actual package tree
```text
subagent-task-routing-integrity-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-dispatch-route-check.md
├── rules/
│   └── task-routing-invariants.md
├── scripts/
│   └── verify_route.py
├── skills/
│   └── routing-integrity-analysis.md
├── subagents/
│   └── routing-verifier.md
├── tests/
│   └── test_verify_route.py
└── workflows/
    └── route-and-verify.md
```

## Installation
Requires Python 3.10+ and no third-party packages. Copy the whole package directory into the agent-runtime repository or control-plane repository.

## Configuration
The verifier accepts two JSON files. Registry shape:
```json
{
  "run_id": "run-1",
  "workers": {
    "worker-1": {
      "parent_task_id": "task-parent",
      "allowed_destinations": ["task-parent"],
      "last_sequence": 4,
      "status": "completed"
    }
  }
}
```
Event shape:
```json
{
  "run_id": "run-1",
  "parent_task_id": "task-parent",
  "worker_task_id": "worker-1",
  "destination_task_id": "task-parent",
  "event_type": "completed",
  "sequence": 5
}
```

## Usage
From the package root:
```bash
python3 scripts/verify_route.py --registry registry.json --event event.json
python3 -m unittest discover -s tests -p 'test_*.py'
```
Exit code `0` means verified route; `2` means rejected route; `3` means invalid input.

## Workflow
Observe event → capture baseline routing metrics → verify lineage → classify mismatch/race → enforce gate → reconcile missing terminal state with at most 2 reads → measure again → independent verification → complete.

## Metrics
- Consequential-event lineage verification coverage: target 100%.
- Accepted cross-task fixtures: target 0.
- Accepted unknown-worker fixtures: target 0.
- Indefinite parent waits in regression tests: target 0.
- Terminal reconciliation attempts: maximum 2 per missing event.
- False completion caused by delegated-state mismatch: target 0 in verified test scenarios.

## Verification
**Implemented:** deterministic lineage validator, enforceable rules, blocking hook contract, bounded workflow, independent verifier role, and tests are present.  
**Measured:** adopters capture baseline mismatch/orphan/wait metrics before enforcing the gate and compare them after integration.  
**Verified:** completion requires the test suite plus runtime replay evidence showing valid events accepted and cross-task/unknown/replayed events rejected.

## Safety
The guard fails closed for consequential events when canonical lineage is missing. It never guesses a destination, rewrites task identity, or weakens approval boundaries. Mutating unrelated task state during recovery requires explicit human approval.

## Failure handling
Detection: verifier nonzero exit, orphaned terminal state, destination mismatch, sequence replay, or parent wait timeout. Evidence: preserve event envelope and canonical registry snapshot. Retry policy: canonical-state reads only, maximum 2. Fallback: quarantine event and keep parent incomplete. Escalation: runtime/operator review. Stop condition: deterministic verdict or exhausted reconciliation attempts.

## Definition of Done
- Current evidence documented.
- Existing approaches and limitations documented.
- Lineage gate integrated at dispatch/acceptance boundary.
- Positive and negative tests pass.
- Baseline and post-change metrics captured.
- Cross-task and unknown-worker events blocked.
- Missing terminal events reconcile without indefinite loops.
- Independent verification completed.
- No security/approval boundary weakened.
- No blocking issue remains.

## Customization
Extend the event envelope with tenant, workspace, capability, or approval provenance IDs when those are meaningful trust boundaries. Keep the core invariant: the destination must be derived from canonical lineage, never from model-generated prose or historical context.
