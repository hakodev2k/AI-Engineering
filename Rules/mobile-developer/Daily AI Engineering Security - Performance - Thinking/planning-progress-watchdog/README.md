# Planning Progress Watchdog

**Category:** Thinking

## Problem
AI coding agents can spend long-running sessions repeatedly planning, reviewing, freezing, delegating, or regenerating plans while making no measurable progress on the requested deliverable. Recent Codex issues document this behavior in layered instruction, persistent-goal, skill, and plan-generation workflows.

See `evidence/research.md` for observed evidence, interpretation, existing approaches, limitations, and sources.

## Proposed improvement
Treat progress as an observable engineering invariant instead of a prose judgment. This package separates meta-work from deliverable progress, limits repeated planning, requires evidence for reopening an approved plan, and blocks completion while acceptance gates remain unsatisfied.

## Architecture
- `skills/progress-diagnosis.md` — evidence-driven progress investigation procedure.
- `rules/planning-transition.rules.md` — enforceable phase and completion rules.
- `subagents/progress-auditor.md` — read-only independent progress classifier.
- `subagents/verification-agent.md` — independent acceptance verifier.
- `workflows/plan-to-execution.md` — bounded observe/diagnose/implement/verify loop.
- `hooks/no-progress-gate.md` — deterministic blocking hook.
- `scripts/progress_watchdog.py` — executable event/gate analyzer.
- `config/watchdog.json` — default thresholds and event classes.
- `evidence/research.md` — current public evidence.

## Installation
Requires Python 3.10+ and no third-party packages. Copy the package into the repository or agent configuration area.

## Configuration
Edit `config/watchdog.json`. Keep planning retries bounded. Do not raise thresholds merely because a task is stuck; first identify whether requirements changed or a real blocker exists.

## Usage
Create an `events.json` containing ordered task events and acceptance gates, then run:

`python3 scripts/progress_watchdog.py events.json --config config/watchdog.json --strict`

Event types configured as progress include source changes, requested artifacts, test results, and acceptance evidence. Meta events include plan, review, replan, freeze, status, and delegation.

## Workflow
Use `workflows/plan-to-execution.md`. After plan approval, the watchdog is checked before more planning/review. When the meta-action threshold is reached, the next action must create a deliverable delta, verify the product, or explicitly stop as blocked. Recovery is limited to two attempts.

## Metrics
Track consecutive meta-only actions, plan regenerations without changed requirements, deliverable deltas, time/tokens since the last delta, acceptance-gate pass rate, and false completion claims.

## Verification
A run is **Implemented** when the package is integrated and event capture is available. It is **Measured** when representative runs produce watchdog metrics. It is **Verified** only when known planning-loop fixtures are blocked, normal plan-to-implementation flows remain allowed, and completion cannot pass with failed/unknown acceptance gates.

## Safety
The watchdog does not authorize dangerous operations. Human approval and existing security boundaries remain mandatory. Pressure to produce a deliverable must never bypass sandbox, credential, production-write, package-install, or destructive-action controls.

## Failure handling
Invalid/missing evidence exits with code `2`. A strict policy violation exits with code `3`. Do not retry indefinitely: preserve evidence, allow at most two recovery attempts, then escalate or report blocked status.

## Definition of Done
- Evidence and current limitation documented.
- Goal and acceptance gates captured.
- Watchdog integrated and configured.
- Planning/review loops are bounded.
- A measurable deliverable delta is required after approved planning.
- Completion is blocked on failed/unknown gates.
- Independent verification passes.
- No safety boundary is weakened.

## Customization
Extend event types for your agent framework, but keep the distinction between process artifacts and requested product artifacts explicit. Tune thresholds using measured runs rather than intuition.
