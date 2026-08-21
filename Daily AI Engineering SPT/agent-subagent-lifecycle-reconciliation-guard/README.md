# Agent Subagent Lifecycle Reconciliation Guard

## Topic
Deterministic reconciliation of child/subagent lifecycle state before orchestration decisions.

## Category
**Thinking**

## Problem
Multi-agent coding systems can accumulate contradictory child lifecycle state: a child has already emitted terminal/result evidence while cached watched state or UI presentation still says `running`/`working`. Public Codex reports in August 2026 show stale state surviving restart/rehydration, completed children remaining active until opened, and stale active state contributing to repeated wait/status behavior.

When a parent coordinator reasons from the wrong source, it can wait forever, create replacement work unnecessarily, repeat status checks, fail to consume completed results, or block parent completion for the wrong reason.

## Evidence
The package is grounded in recent public reports documented in `evidence/research.md`, including:
- Codex #37916: stale watched status overriding completed state;
- Codex #38478 and #37729: completed children still displayed active;
- Codex #37563: terminal children rehydrated as Working after restart;
- Codex #37299: stale running children contributing to repeated wait/status turns and large usage;
- Codex #38132: coordinator status intent entering a tool-selection loop.

## Existing approach
Typical systems rely on some combination of UI status, cached watched state, list/wait polling, persisted events, result delivery, and runtime registry state. Manual workarounds include reopening child threads or restarting the app.

## Existing limitations
- Presentation/cache state can be stale.
- Restart can rehydrate stale active state instead of repairing it.
- Opening children one-by-one is manual and O(n).
- Short polling can turn uncertainty into repeated model/tool calls.
- Parent prompts often lack an explicit state-precedence contract.
- Terminal state may not be treated as monotonic for one execution identity.

## Proposed improvement
Place a **lifecycle reconciliation barrier** between raw child state and parent decisions.

The barrier:
1. preserves evidence source identity;
2. applies deterministic precedence from `config/lifecycle-policy.json`;
3. detects contradictory terminal/active evidence;
4. prevents same-execution terminal→active resurrection;
5. measures stale-active age;
6. emits a bounded orchestration decision;
7. requires reconciliation before wait/retry/replacement/finalization;
8. independently verifies parent completion against required child dependencies.

No hidden chain-of-thought is required. Decisions use observable facts, explicit policy, bounded retries, and verifiable outputs.

## Architecture

```text
Runtime events / registry / result delivery / persisted state / UI-cache state
                              |
                              v
                 Lifecycle Evidence Collector
                              |
                              v
               scripts/reconcile_lifecycle.py
                              |
                  lifecycle-policy.json
                              |
                              v
      reconciled state + conflicts + staleness + decision
                              |
              +---------------+---------------+
              |                               |
              v                               v
      Parent Coordinator             Verification Agent
              |                               |
              +-------------> final gate <----+
```

## Package structure

```text
agent-subagent-lifecycle-reconciliation-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── lifecycle-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── conflicting-lifecycle.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── reconcile_lifecycle.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_reconcile_lifecycle.py
├── verification/
│   └── verification.md
└── workflows/
    └── workflows.md
```

## Installation
Requirements:
- Python 3.10+
- no third-party Python dependencies
- read-only access to child lifecycle/event/status evidence

Copy this directory into the host repository or runtime-support project. Preserve relative paths if using the example commands.

## Configuration
Edit `config/lifecycle-policy.json` to match runtime semantics.

Important fields:
- `terminal_states`: states considered final for one execution ID;
- `active_states`: states that can legitimately continue;
- `evidence_precedence`: strongest-to-weakest evidence source order;
- `max_stale_active_seconds`: age after which active state requires refresh;
- `max_wait_attempts`: hard bound for waits;
- `initial_wait_seconds` / `max_wait_seconds`: bounded backoff envelope;
- `require_new_execution_id_for_terminal_to_active`: monotonic terminal-state guard;
- `fail_closed_on_conflict_without_authoritative_evidence`: uncertainty behavior.

Do not place UI/cache state above authoritative terminal or registry evidence without a runtime-specific reason and tests.

## Usage
Create an input snapshot and run:

```bash
python scripts/reconcile_lifecycle.py \
  --input examples/conflicting-lifecycle.json \
  --policy config/lifecycle-policy.json \
  --output lifecycle-report.json
```

Exit codes:
- `0`: no blocking conflict;
- `2`: lifecycle conflict blocks orchestration;
- `3`: invalid input/policy;
- `4`: I/O failure.

A conflict exit is intentional. The caller should refresh the strongest missing/contradictory authoritative source once and rerun reconciliation, not ask the model to guess.

## Workflow
The normal flow is:

**Observe → Normalize → Reconcile → Conflict? → One authoritative refresh → Reconcile → Decide → Verify**

For genuinely active children, the parent follows bounded wait policy. For terminal children, it verifies/consumes the result. For unresolved conflicts, it stops lifecycle-dependent actions and escalates.

See `workflows/workflows.md` for the complete pre-orchestration, stale-state incident, and parent-completion workflows.

## Skills
`skills/core-skills.md` contains three reusable procedures:
- reconcile child lifecycle before orchestration;
- diagnose stale subagent state;
- verify parent completion against child dependencies.

Each defines triggers, inputs, procedures, constraints, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` defines observable MUST / MUST NOT / SHOULD rules plus lifecycle invariants. The key invariant is monotonic terminal state for a single execution identity.

## Subagents
`subagents/subagents.md` defines non-overlapping roles:
- Lifecycle Evidence Collector — read-only fact collection;
- Lifecycle Reconciler — deterministic policy execution;
- Orchestration Verification Agent — independent final verification.

The implementing/coordinating agent is not the sole verifier for high-impact lifecycle changes.

## Hooks
`hooks/hooks.md` defines integration points for:
- pre-orchestration checks;
- child-result reconciliation;
- resume/rehydration integrity;
- bounded waits;
- final parent verification.

## Metrics
At minimum collect:
- reconciliation mismatch rate;
- stale-active age;
- status/list/wait queries per child;
- model turns attributable to status/wait orchestration;
- terminal→active resurrection attempts;
- reconciliation attempts per decision;
- unresolved required-child count at parent completion;
- token/cost attributable to status polling when available.

Do not claim performance or reliability improvement before baseline and post-integration data are collected.

## Verification
Run:

```bash
python -m unittest tests/test_reconcile_lifecycle.py -v
```

Host integration is verified only when the criteria in `verification/verification.md` pass. Important checks include:
- stale UI cannot resurrect a terminal child;
- same-execution terminal→active is blocked;
- legitimate retry with a new execution ID remains allowed;
- stale genuinely-active state triggers refresh instead of endless waiting;
- parent completion has zero genuinely unresolved required children;
- no unbounded wait/status loop remains.

## Safety
The package is intentionally read-only with respect to runtime child state. It does not spawn, cancel, kill, restart, or mutate children. A blocking conflict stops orchestration; it never weakens lifecycle or authorization controls to force progress.

Destructive child operations remain governed by the host's existing permission and human-approval boundaries.

## Failure handling
### Detection
A conflict, invalid transition, stale active state, unknown state, missing authoritative evidence, or script failure is explicit.

### Evidence
Record source-labeled lifecycle states, execution IDs, timestamps/stale age, and selected decision. Avoid unnecessary child prompt/content capture.

### Retry policy
- Evidence/reconciliation retry: maximum 2 attempts per decision point.
- Wait attempts: bounded by policy.
- No unlimited polling.

### Fallback
If trustworthy lifecycle state cannot be established, stop the lifecycle-dependent action and mark the child `unknown/conflicted`.

### Escalation
Surface the exact child, execution ID, evidence disagreement, missing authoritative source, and blocked action.

### Stop condition
Do not continue retrying after the configured budget is exhausted.

## Definition of Done
A production integration is complete only when:
1. evidence and current limitations are documented;
2. baseline lifecycle/status-query metrics are captured;
3. evidence sources are mapped with explicit precedence;
4. deterministic reconciliation runs before lifecycle-dependent decisions;
5. terminal monotonicity and retry identity rules are enforced;
6. bounded wait/reconciliation policies are active;
7. package and integration tests pass;
8. stale-state/restart scenarios are reproduced and then prevented;
9. before/after metrics are collected;
10. independent verification passes;
11. parent completion cannot ignore genuinely unresolved required children;
12. no blocking lifecycle integrity issue remains.

## Customization
- Add runtime-specific evidence sources explicitly rather than overloading existing names.
- Tune staleness/wait budgets from measured child-task duration distributions.
- Map platform-specific terminal states into the policy.
- Add event-driven completion adapters to reduce polling.
- Extend tests for remote sessions, reconnects, thread rehydration, nested subagents, cancellation, and replacement attempts.
- Integrate metrics with existing observability systems without storing unnecessary task content.

## Research date
Evidence reviewed for this package on **2026-08-21 (Vietnam time)**. See `evidence/research.md` for source links and the observed/interpretation/proposed-solution separation.
