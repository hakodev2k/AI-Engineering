# Resource Lifecycle Budget Guard

**Category:** Performance

## Problem
AI coding/browser sessions can progressively accumulate owned helper processes, MCP clients, browser pages, memory, CPU load, or handles. Normal completion, cancellation, retry, and cross-surface transitions do not always imply physical resource cleanup.

## Evidence
See `evidence/research.md`. Current August 2026 public reports include process/tab accumulation, extreme Node memory growth, repeated Computer History clients, and system-wide UI/input degradation.

## Existing approach
Parent-exit cleanup, shutdown hooks, process supervisors, tab-close logic, manual restart, and feature disablement.

## Existing limitations
Ownership is often distributed across app/plugin/MCP/browser runtimes; retries can create replacements before predecessors retire; cleanup actions are not always verified by postconditions; and long-running sessions need bounded growth, not just eventual cleanup.

## Proposed improvement
Attach explicit owner/lease metadata to task-scoped resources, measure a pre-task baseline, enforce soft/hard budgets, stop creating resources on hard breach, perform bounded cleanup, and verify zero expired owned resources after every terminal path.

## Architecture
- `skills/resource-lifecycle-investigation.md` — evidence-driven diagnosis procedure.
- `rules/resource-budget-rules.md` — enforceable ownership/budget/cleanup requirements.
- `subagents/resource-leak-verifier.md` — independent verification.
- `workflows/measure-diagnose-cleanup-verify.md` — bounded optimization workflow.
- `hooks/post-task-cleanup.md` — deterministic cleanup postcondition gate.
- `scripts/resource_snapshot.py` — non-destructive process inventory.
- `config/budgets.example.json` — calibratable example budgets.
- `tests/test_resource_snapshot.py` — smoke tests for the snapshotter.

## Actual package tree
```text
README.md
config/budgets.example.json
evidence/research.md
hooks/post-task-cleanup.md
rules/resource-budget-rules.md
scripts/resource_snapshot.py
skills/resource-lifecycle-investigation.md
subagents/resource-leak-verifier.md
tests/test_resource_snapshot.py
workflows/measure-diagnose-cleanup-verify.md
```

## Installation
Requires Python 3.9+. The process snapshotter uses only the standard library and OS-native process commands (`PowerShell/Get-CimInstance` on Windows or `ps` on Unix-like systems). Browser/MCP counts must be integrated through the host's own inventory APIs.

## Configuration
Copy `config/budgets.example.json`, then calibrate values from a representative workload and machine. Example budgets are not universal defaults. Security controls must not be disabled to satisfy performance thresholds.

## Usage
Capture baseline:

`python3 scripts/resource_snapshot.py --match codex --match node --match chrome > before.json`

Run the bounded workload, then capture `peak/end` snapshots. Integrate owner PID/session identifiers when available. Execute the cleanup hook on success, cancellation, timeout, and controlled failure.

## Workflow
Use `workflows/measure-diagnose-cleanup-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Implement lifecycle fix → Measure three cycles → Verify cancellation/failure cleanup → Independent review.

## Metrics
Owned process count, orphan count, RSS/private bytes, browser pages, MCP clients, CPU, handles, cleanup latency, and resource growth per completed task. A performance improvement is not claimed without comparable before/after workloads.

## Verification
Run `python3 tests/test_resource_snapshot.py`. Then execute at least three comparable task cycles plus one cancellation/timeout cycle. The independent verifier must confirm a stable resource plateau and zero expired task-scoped orphans beyond the configured SLA.

## Safety
The supplied script never terminates processes. Automated cleanup must prove ownership before force termination. Ambiguous ownership blocks destructive cleanup. Do not weaken sandboxing, auth, endpoint protection, or other security boundaries for performance.

## Failure handling
Detection: budget breach or cleanup postcondition failure. Evidence: before/peak/end snapshots and ownership ledger. Retry: maximum two lifecycle remediation cycles. Fallback: stop new work and perform only ownership-proven graceful cleanup. Escalation: operator review for ambiguous ownership or persistent hard breach. Stop when destructive cleanup would affect unknown resources.

## Implemented / Measured / Verified
**Implemented** means lifecycle instrumentation/guarding is integrated. **Measured** means comparable before/after resource data exists. **Verified** means three-cycle plateau plus terminal-path cleanup passes independent review. These states must remain distinct.

## Definition of Done
Evidence documented; baseline captured; ownership mapped; limits calibrated; lifecycle change implemented; three repeated tasks measured; cancellation/timeout cleanup measured; no expired task-scoped orphan remains; resource growth plateaus within tolerance; security boundaries preserved; independent verifier returns PASS; no blocking issue remains.

## Customization
Add browser-page and MCP-client inventory adapters, parent/job-object/cgroup ownership, handle/GPU/network counters, and platform-specific graceful-shutdown mechanisms while preserving bounded retries and postcondition verification.