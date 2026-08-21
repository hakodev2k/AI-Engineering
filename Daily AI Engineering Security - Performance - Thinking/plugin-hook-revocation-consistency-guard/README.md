# Plugin Hook Revocation Consistency Guard

## Topic
Deterministic verification that disabling or removing an AI-agent plugin actually revokes its runtime hooks.

## Category
Security

## Problem
Plugin configuration, visible hook inventory, and executable runtime state can diverge. Recent Claude Code and Codex reports show disabled or removed plugins continuing to execute hooks, inject context, mutate repositories, or emit repeated stale-handler failures.

## Evidence
See `evidence/research.md`. The package is grounded in current 2026 reports including Claude Code #85893 and Codex #38339, plus earlier independent reports of disabled-plugin hooks continuing to execute.

## Existing approach
Most systems persist an enabled/disabled flag, refresh capabilities at startup, or rely on uninstall/restart. These mechanisms do not by themselves prove that active process/session hook registries converged to the desired state.

## Existing limitations
A plugin can appear disabled while stale executable handlers remain cached. UI inventories can also diverge from execution registries, and missing handler files can produce repeated failures rather than bounded quarantine.

## Proposed improvement
Treat plugin revocation as a state-convergence transaction. Compare desired plugin state with effective runtime hooks and post-transition execution evidence, block false success, require restart when live unloading is unavailable, and bound repeated stale-handler failures.

## Architecture
- `evidence/research.md` — public signals, existing approaches, gap, root causes, and metrics.
- `config/policy.json` — deterministic revocation/failure policy.
- `skills/audit-plugin-hook-revocation.md` — reusable evidence-driven audit procedure.
- `rules/revocation-invariants.md` — observable MUST/MUST NOT invariants.
- `subagents/runtime-revocation-verifier.md` — independent verifier contract.
- `workflows/revoke-and-verify.md` — bounded state-convergence workflow.
- `hooks/post-plugin-state-change.md` — deterministic post-transition gate.
- `scripts/hook_revocation_guard.py` — executable desired-vs-effective registry checker.
- `tests/test_hook_revocation_guard.py` — dependency-free regression suite.

## Actual package tree
```text
plugin-hook-revocation-consistency-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-plugin-state-change.md
├── rules/
│   └── revocation-invariants.md
├── scripts/
│   └── hook_revocation_guard.py
├── skills/
│   └── audit-plugin-hook-revocation.md
├── subagents/
│   └── runtime-revocation-verifier.md
├── tests/
│   └── test_hook_revocation_guard.py
└── workflows/
    └── revoke-and-verify.md
```

## Installation
Requires Python 3.9+ for the deterministic guard/tests. No third-party Python packages are required. Integrate runtime inventory export with your agent/plugin platform and emit the snapshot schema documented in `scripts/hook_revocation_guard.py`.

## Configuration
Adjust `config/policy.json` only through reviewed policy changes. Keep terminal plugin states fail-closed. Lowering failure or security requirements to make a test pass is not permitted.

## Usage
Run the tests:

`python3 tests/test_hook_revocation_guard.py`

Run a lifecycle snapshot through the gate:

`python3 scripts/hook_revocation_guard.py snapshot.json --policy config/policy.json`

Exit codes: `0` allow, `2` invalid input, `3` block, `4` restart required, `5` quarantine.

## Workflow
Follow `workflows/revoke-and-verify.md`: Observe → baseline → diagnose → hypothesize → reconcile → measure again → bounded retry → independent verification. A restart-required state is not successful revocation.

## Metrics
Track stale active hooks, hidden active hooks, post-transition executions, stale failure count, time-to-convergence, reconciliation retries, restart-required rate, and independent verification pass rate.

## Verification
A topic implementation is only **Verified** when a fresh independent runtime snapshot shows zero executable or executed handlers owned by disabled/removed plugins and the visible inventory reconciles with the execution registry. Passing configuration/UI checks alone is insufficient.

## Safety
Never execute stale plugin code merely to probe it. Never weaken sandbox, permissions, approvals, or filesystem boundaries. Restart or destructive cleanup requires explicit human approval when it can interrupt or remove user work.

## Failure handling
Detection: registry mismatch, hidden active hook, post-transition stale execution, or repeated missing-handler failure. Evidence: preserve normalized snapshot and telemetry. Retry: one registry reconciliation plus one verification retry. Fallback: `restart_required` when live unloading is unsupported. Escalation: quarantine repeated stale handlers and hand off to a human/security owner. Stop: retry budget exhausted or runtime state unobservable.

## Definition of Done
- **Implemented:** state-change hook and deterministic guard integrated.
- **Measured:** desired/effective inventories and post-transition telemetry captured before/after remediation.
- **Verified:** regression tests pass; no terminal-state plugin hook is active or executed; inventory is authoritative; no secret is exposed; no security boundary is weakened; no blocking issue remains.

## Customization
Add platform-specific hook events, registry metadata, and restart semantics without changing the core invariant: a disabled/removed plugin cannot be reported revoked while its code can still execute.
