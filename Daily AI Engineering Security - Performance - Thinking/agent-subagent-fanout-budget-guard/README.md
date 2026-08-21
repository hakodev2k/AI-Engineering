# Agent Subagent Fan-out Budget Guard

## Topic
Runtime-enforced aggregate budgets for multi-agent delegation trees.

## Category
**Token**

## Problem
A parent agent may intentionally create only a few subagents, yet nested/general-purpose agents can retain delegation capability and recursively create additional agents. The resulting tree can grow far beyond the original plan, multiplying context loads, model calls, tool calls, latency, and cost before either a human or provider quota stops it.

This package moves fan-out control from prompt convention to a deterministic host-runtime contract.

## Evidence
Current 2026 reports document materially large amplification:
- Claude Code #68110: one delegated research task reportedly produced 48+ recursively spawned agents.
- Claude Code #69206: a workflow intended for about 10 workers reportedly spawned 218 agents and consumed roughly 700k tokens before manual intervention.
- Claude Code #72566: 5 intended agents reportedly escalated to 361+ completed agents and exhausted the usage quota.
- Claude Code #36727: one subagent reportedly made 234 tool calls and consumed more than 124k tokens.
- Claude Code #81691 requests live budget/per-task accounting for planning.
- Claude Code #83412 shows provider spend/usage limits can terminate subagents without useful partial-result handoff.

See `evidence/research.md` for source links, current approaches, observed limitations, and the separation between evidence, interpretation, and proposed solution.

## Existing approach
Common controls include prompt instructions, graph recursion limits, concurrency semaphores, per-agent output limits, manual monitoring, and provider account quotas.

## Existing limitations
Those controls operate at different scopes. A concurrency limit bounds simultaneous work but not cumulative descendants. A per-agent token cap still permits hundreds of separately capped children. A graph recursion limit does not necessarily represent aggregate model cost across an agent tree. Provider quota exhaustion is late and may discard partial work. Prompt-only constraints are not deterministic enforcement.

## Proposed improvement
Create one budget envelope per root task and enforce it at every spawn boundary. Each child gets an explicit reservation for descendants, depth, concurrency, estimated tokens, tool calls, and time. Child delegation is default-denied unless explicitly budgeted. Spawn requests are idempotent. Actual usage is reconciled, optional work is curtailed at soft thresholds, and hard violations freeze new admissions before cancellation/containment.

## Architecture

```text
User task
   |
   v
Root budget ledger <---- policy
   |
   v
Budget Planner ---- plan-check
   |
   v
Orchestrator
   |
   +--> pre-spawn guard --deny--> machine-readable reason
   |         |
   |         +--reserve atomically--> spawn child
   |                                  |
   |                                  +--> optional nested spawn -> same root guard
   |
   +<-- usage/terminal events -- reconcile reservation
   |
   +--> threshold check -> warn / freeze / containment
   |
   v
Synthesis + finalization gate
```

The JSON ledger bundled here is a local/reference implementation. Production multi-worker runtimes must preserve the same invariants using a transactional SQL/Redis/CAS store.

## Package structure

```text
agent-subagent-fanout-budget-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── budget-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── analyze_fanout_trace.py
│   └── budget_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_budget_guard.py
├── verification/
│   └── verification-report.md
└── workflows/
    └── workflows.md
```

## Installation
Requirements: Python 3.10+ and the standard library only.

Copy the package into the repository or orchestration service that owns subagent creation. No secrets or provider credentials are required by the scripts.

Run tests in the target environment:

```bash
python -m unittest discover -s tests -v
```

## Configuration
Edit `config/budget-policy.json` to define:
- `max_descendants`
- `max_depth`
- `max_concurrency`
- `max_estimated_tokens`
- `max_wall_seconds`
- `max_tool_calls`
- child allocation fractions
- reservation timeout/accounting behavior
- soft threshold
- hard-limit response

Hard limits should be derived from measured workloads and provider/business budgets. Do not increase them automatically during a runaway incident.

## Usage
Initialize a root ledger:

```bash
python scripts/budget_guard.py init \
  --policy config/budget-policy.json \
  --root task-123 \
  --ledger .budget-ledger.json
```

Reserve before spawn:

```bash
python scripts/budget_guard.py reserve \
  --policy config/budget-policy.json \
  --ledger .budget-ledger.json \
  --root task-123 \
  --parent root \
  --request-id task-123:worker:1 \
  --child worker-1 \
  --tokens 12000 \
  --tool-calls 20
```

Only invoke the real agent-spawn API if the command succeeds.

Reconcile actual usage:

```bash
python scripts/budget_guard.py reconcile \
  --ledger .budget-ledger.json \
  --reservation-id <id> \
  --tokens-used 9300 \
  --tool-calls-used 14 \
  --status completed
```

Check thresholds:

```bash
python scripts/budget_guard.py check \
  --policy config/budget-policy.json \
  --ledger .budget-ledger.json
```

Analyze an exported trace:

```bash
python scripts/analyze_fanout_trace.py trace.ndjson \
  --planned-descendants 5 \
  --planned-depth 1 \
  --planned-tokens 70000
```

See `guide-intergration.md` for spawn wrapper, nested delegation, distributed ledger, telemetry, containment, and rollout details.

## Workflow
1. **Observe:** identify independent work and historical cost.
2. **Baseline:** estimate expected descendants, depth, tokens, calls, concurrency, and synthesis reserve.
3. **Plan:** create the smallest useful delegation tree.
4. **Validate:** deterministic plan check against policy.
5. **Reserve:** atomically reserve before every spawn.
6. **Execute:** child receives only its explicit envelope.
7. **Measure:** reconcile actual token/tool/time usage.
8. **Compare:** actual fan-out and spend versus plan.
9. **Contain:** freeze new spawns when growth is anomalous or a hard limit is reached.
10. **Verify:** independent regression/fault tests and final no-active-reservation gate.

Every corrective loop is bounded. Planning gets one smaller-fan-out retry. Release verification permits at most two implementation-fix cycles.

## Skills
`skills/core-skills.md` provides executable procedures for:
- delegation budget planning;
- atomic spawn admission;
- runtime budget reconciliation;
- fan-out incident containment.

Each skill specifies triggers, inputs, tools, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` contains observable MUST/MUST NOT/SHOULD rules. The central invariant is that model intent never authorizes a spawn by itself; the runtime reservation does.

## Subagents
The package separates:
- a read-oriented **Budget Planner**;
- an **Orchestration Integrator**;
- an **Independent Verification Agent**.

The implementer is intentionally not the sole verifier.

## Hooks
`hooks/hooks.md` defines root-task initialization, pre-spawn admission, terminal reconciliation, threshold checks, and final verification gates.

## Scripts
### `budget_guard.py`
Reference enforcement utility with safe defaults and machine-readable output.

Exit codes:
- `0`: success/healthy
- `2`: invalid input where explicitly detected
- `3`: soft-threshold warning
- `4`: denied/hard violation/incomplete finalization
- `5`: I/O/configuration error

### `analyze_fanout_trace.py`
Reads NDJSON orchestration events and reports total spawns, depth, peak concurrency, token usage, high-fan-out parents, and plan violations.

## Metrics
Track at root-task level:
- planned vs actual descendants;
- planned vs actual max depth;
- peak concurrency;
- tokens per root task and per child;
- tool calls per root task and child;
- spawn admission/denial counts and reasons;
- duplicate request/replay count;
- estimate error;
- post-detection token growth;
- cancellation latency;
- orphan descendants;
- partial-result retention rate.

A successful optimization is not merely “fewer agents”; it is bounded resource consumption with equivalent or better task correctness.

## Verification
`verification/verification-report.md` distinguishes:
- **Implemented:** guard, policy, workflows, tests, trace analyzer.
- **Measured:** public incident measurements and production metrics to capture.
- **Verified:** static invariants and GitHub persistence, while target-runtime execution is explicitly not claimed until tests are run there.

Required production verification includes atomic distributed reservation tests, recursive fan-out fixtures, retry idempotency, exhaustion handling, cancellation, and partial-result preservation.

## Safety
- Fail closed if the budget ledger is unavailable or inconsistent.
- Do not log raw prompts/secrets for budget accounting.
- Do not automatically raise limits to make a task finish.
- Do not treat provider quota exhaustion as normal orchestration control.
- Require human approval before raising hard limits during an active incident.
- Preserve useful partial results before cancellation when safe.
- This package complements; it does not replace tool permissions, sandboxing, authz, or data security.

## Failure handling
### Detection
Hard-limit denial, unexpected spawn velocity, plan violation, ledger inconsistency, unresolved reservation, cancellation timeout, or orphan child.

### Evidence
Persist root ID, child IDs, reservation IDs, timestamps, budget counters, denial reasons, terminal status, and partial-result references.

### Retry policy
- planning: one smaller-fan-out retry;
- ledger transient write: one retry, then fail closed;
- cancellation: one bounded retry per child;
- release fixes: maximum two cycles.

### Fallback
Prefer sequential/root-agent execution when feasible. At budget exhaustion, synthesize only from evidence already obtained if correctness requirements are still satisfied.

### Escalation
Operator/human review is required for orphan processes, inconsistent accounting, destructive cleanup, or any hard-limit increase.

### Stop condition
No new cost-amplifying action is permitted after a hard violation until containment is complete or a human explicitly approves a revised budget.

## Definition of Done
A runtime integration is complete only when all of the following are true:
- current evidence and existing-solution limitations are documented;
- root and child budget policy is configured;
- every spawn path passes through deterministic admission;
- spawn reservation is atomic in the target deployment topology;
- recursive delegation is default-denied or explicitly budgeted;
- retry idempotency is tested;
- descendant/depth/concurrency/token/tool-call limits are tested;
- actual usage is reconciled;
- soft/hard threshold behavior is observable;
- fan-out incident containment is tested;
- partial-result behavior is defined and tested;
- independent verification is complete;
- no required check was weakened to obtain a pass;
- final root task has no unresolved reservations or untracked descendants.

## Customization
Adapt budget values by workload class rather than globally. Examples:
- code review: low depth, few workers, moderate synthesis reserve;
- broad research: larger direct fan-out but usually no child delegation;
- repository migration: bounded hierarchical delegation with strict per-branch ownership;
- expensive models: tighter token reservations and lower concurrency;
- local/cheap models: token cap may be relaxed while wall-time/tool-call limits stay strict.

When adding provider-specific telemetry, keep the generic root-budget contract stable so orchestration policies remain portable.