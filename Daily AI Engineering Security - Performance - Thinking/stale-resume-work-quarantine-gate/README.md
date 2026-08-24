# Stale Resume Work Quarantine Gate

## Topic
Freshness- and provenance-aware quarantine before persisted agent work becomes active after restart/resume.

## Category
Thinking

## Problem
Persistent runtimes can mistake old pending work or maintenance-refreshed session metadata for current intent, then inject synthetic resume work that reaches model/tool execution.

## Evidence
See `evidence/research.md` for August 2026 Hermes Agent reports covering week-old pending completions, a 21-day-old session passing a recency gate after metadata repointing, and multi-framework crash/resume conformance failures.

## Existing approach
Durable checkpoints, pending-event restoration, recent-activity windows, generic `updated_at`, idempotency, and manual recovery inspection.

## Existing limitations
Persistence proves that state exists, not that the underlying work is still current. Storage timestamps can be refreshed by reconciliation, pending delivery can outlive intent, and idempotency cannot decide whether old work should execute at all.

## Proposed improvement
Create a deterministic resume envelope and classify it before any resumed model/tool action. Freshness uses semantic activity provenance; terminal and stale work is blocked; stale side-effect-capable work requires explicit re-approval; historical completions can remain reference-only.

## Architecture
```text
stale-resume-work-quarantine-gate/
├── README.md
├── evidence/research.md
├── skills/resume-freshness-analysis.md
├── rules/resume-quarantine-policy.md
├── subagents/resume-verifier.md
├── workflows/restart-resume-quarantine.md
├── hooks/pre-resume-quarantine.md
├── scripts/check_resume_freshness.py
└── tests/test_check_resume_freshness.py
```

## Installation
Requires Python 3.9+ for the reference checker. Host integration must invoke the quarantine hook before constructing an active resumed model turn.

## Configuration
Set a semantic freshness window appropriate to the product. Five minutes is a conservative example, not a universal default. Define terminal states, side-effect classification, state-drift checks, and the re-approval path.

## Usage
Prepare a JSON resume envelope with `session_id`, `task_id`, `last_real_activity_at`, `current_time`, `prior_state`, and `provenance.source`. Optional controls include `side_effect_capable`, `approval_current`, and `state_drift`.

Run:

`python scripts/check_resume_freshness.py resume-envelope.json --max-age-seconds 300 --json`

Exit codes: `0` allow; `1` quarantine/deny; `2` malformed input/runtime error.

## Workflow
Follow `workflows/restart-resume-quarantine.md`: enumerate without dispatch → baseline → diagnose → implement deterministic envelope/gate → replay fixtures → independently verify.

## Metrics
Stale auto-resume rate, valid recovery rate, provenance completeness, side-effect reapproval coverage, false quarantine rate, resurrected-task count, time-to-safe-recovery.

## Verification
Run `python -m pytest tests/test_check_resume_freshness.py`. Tests require that recent interrupted work is allowed, stale work remains stale despite a fresh storage timestamp, terminal work is denied, missing provenance is quarantined, and side-effect work requires current approval.

## Safety
The gate is LLM-free and read-only. It must execute before resumed model/tool actions. Never rewrite activity timestamps to bypass quarantine, never treat `pending` as authorization, and never weaken sandbox/permission controls to restore liveness.

## Failure handling
Detection: malformed/missing provenance or policy denial. Evidence: immutable resume envelope and reason codes. Retry: at most two reconstruction attempts for transient reads. Fallback: quarantine. Escalation: operator re-approval/recovery review. Stop: uncertainty remains, task is stale/terminal, or state drift is unresolved.

## Definition of Done
**Implemented:** quarantine gate runs before resume dispatch. **Measured:** baseline and post-change fixture matrix exists. **Verified:** stale/terminal/provenance-missing cases cannot auto-run, recent valid interruption can recover, maintenance timestamps cannot refresh semantic activity, tests pass, and permission boundaries remain intact.

## Customization
Add product-specific provenance fields and external state fingerprints, but keep the core invariant: recovery eligibility must be derived from current task intent and semantic activity evidence, not mutable storage maintenance metadata.
