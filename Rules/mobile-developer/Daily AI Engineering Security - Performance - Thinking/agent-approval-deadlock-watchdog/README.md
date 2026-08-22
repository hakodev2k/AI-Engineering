# Agent Approval Deadlock Watchdog

## Topic
Deterministic liveness, correlation, and fail-closed recovery for human/tool approval gates in AI agent runtimes.

## Category
**Thinking**

This package improves agent decision/execution reliability through explicit state, evidence, bounded waiting, checkpoints, and verification. It does not expose or require hidden chain-of-thought.

## Problem
Permission-gated agent actions can become stuck when the approval request exists in the runtime but is not surfaced to a decision-capable UI, is lost across app-server or subagent boundaries, is mislabeled as denied, or waits without a deadline. The visible symptom is often only “Waiting…” or an idle child agent.

## Evidence
Recent Codex and Claude Code reports document:
- app-server turns blocked by approval requests not emitted to the client;
- hidden Bash approval prompts waiting indefinitely;
- subagents blocked because permission gates do not propagate to parent UI;
- unattended sessions waiting for hours;
- pending permission represented as denial.

See `evidence/research.md` for dated signals, observed facts, interpretations, limitations, and source links.

## Existing approach
Typical systems rely on interactive approval UI, notification hooks, broad permission modes, or manual interruption/restart.

## Existing limitations
An interactive prompt only works when routing/rendering succeeds. Notification does not equal decision. Broad bypass weakens security. Manual restart is slow and loses continuity. Most importantly, UI text alone does not provide a durable state machine proving whether a request is requested, surfaced, decided, expired, or orphaned.

## Proposed improvement
Treat approval as a correlated lifecycle with separate surface and decision deadlines:

`requested → surfaced → acknowledged? → approved | denied | expired | cancelled`

A deterministic watchdog validates lifecycle integrity and flags liveness defects. Recovery retries only **delivery of the approval request**, never the gated side effect, and ultimately fails closed according to policy.

## Architecture
1. **Tool/transition runner** allocates `request_id` and emits `requested` before waiting.
2. **Approval transport/UI** emits `surfaced` only after a decision-capable consumer receives it.
3. **Controller** owns deadlines, parent/subagent routing, and bounded delivery retries.
4. **Decision channel** emits exactly one terminal state.
5. **Watchdog** validates correlation and liveness at checkpoints.
6. **Independent verifier** proves recovery does not weaken permission boundaries or duplicate side effects.

## Package structure
```text
agent-approval-deadlock-watchdog/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── approval_watchdog.py
├── tests/
│   ├── fixtures.jsonl
│   └── test_watchdog.py
└── verification/
    └── verification.md
```

## Installation
Requires Python 3.10+ and no third-party packages.

```bash
python scripts/approval_watchdog.py --help
python tests/test_watchdog.py
```

## Configuration
Edit `config/policy.json`:
- `surface_timeout_seconds`: maximum time for the request to reach a decision-capable surface;
- `decision_timeout_seconds`: maximum operator-decision window;
- `grace_seconds`: small scheduling/transport grace;
- `max_surface_retries`: bounded delivery retries;
- `terminal_fallback`: safe fallback (`deny_and_escalate` by default);
- `require_parent_route_for_subagents`: enforce parent routing metadata;
- `allow_implicit_approval`: must remain false for safe integration.

Thresholds should be based on measured host behavior. A complex human decision may need a longer decision timeout, while a missing approval surface should be detected quickly.

## Usage
Validate an event stream:
```bash
python scripts/approval_watchdog.py runtime-approvals.jsonl \
  --policy config/policy.json \
  --output approval-report.json
```

For deterministic incident reconstruction, supply an explicit current time:
```bash
python scripts/approval_watchdog.py runtime-approvals.jsonl \
  --policy config/policy.json \
  --now 2026-08-21T09:10:00+07:00
```

Exit codes:
- `0`: pass;
- `2`: liveness/policy violation;
- `3`: invalid input/config;
- `4`: I/O failure.

## Workflow
Use the evidence-driven flow in `workflows/workflows.md`:

**Observe → Correlate → Locate boundary → Hypothesis → Recover → Resume → Independent verify**

Retries are bounded. The workflow stops rather than weakening controls when request correlation or side-effect status cannot be proven.

## Metrics
Track at minimum:
- approval request count;
- surfaced and terminal ratios;
- p50/p95 request-to-surface latency;
- p50/p95 request-to-decision latency;
- surface and decision timeout counts;
- orphan/duplicate event counts;
- approval-related stalled minutes;
- delivery retry count;
- duplicate gated-side-effect count.

Do not put sensitive command arguments or payloads in metric labels.

## Verification
`verification/verification.md` explicitly separates **Implemented**, **Measured**, and **Verified**.

The package provides deterministic state-machine behavior and tests. A production integration must not claim measured latency improvement until real host before/after telemetry is captured.

Required safety verification includes hidden-surface detection, fail-closed decision expiry, subagent-route enforcement, orphan/duplicate rejection, bounded retries, exactly-once side-effect verification, and independent review.

## Safety
- Silence is never approval.
- Timeout is never approval.
- Missing UI is never approval.
- Delivery retry is not action retry.
- The package never recommends disabling sandbox/approval controls as a recovery mechanism.
- Approval diagnostics should carry IDs, timings, route metadata, and violation codes—not secret-bearing payloads.
- Dangerous or irreversible operations still require the existing explicit human approval boundary.

## Failure handling
Detection is deterministic via violation codes such as `SURFACE_TIMEOUT`, `DECISION_TIMEOUT`, `MISSING_PARENT_ROUTE`, `ORPHAN_EVENT`, and `UNSURFACED_APPROVAL`.

Retry approval-surface delivery only up to the configured maximum. If resolution still fails, deny/cancel and escalate. If execution status cannot be proven, stop the affected workflow rather than replaying the side effect.

## Definition of Done
A host integration is complete only when:
1. evidence and current limitations are documented;
2. every gated action has a stable request ID;
3. request/surface/terminal states are instrumented;
4. child routes are explicit where required;
5. deadlines and safe fallback are configured;
6. regression fixtures pass;
7. host baseline and after metrics are collected;
8. no unresolved request exceeds deadline + grace;
9. no implicit approval or broad bypass path exists;
10. duplicate side effects are ruled out;
11. independent verification passes;
12. no blocking approval-liveness defect remains.

## Customization
Adapters may map native runtime events to the package schema without changing the core invariants. For attended IDE use, decision timeouts can be longer. For unattended automation, avoid dispatching approval-gated work unless a real decision channel is available. For agent teams, centralize or explicitly proxy child approvals through a controller.

See `guide-intergration.md` for the concrete integration sequence and observability guidance.
