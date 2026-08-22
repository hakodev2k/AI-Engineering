# Agent Subagent Lifecycle Join Barrier

## Topic

Preventing parent/coordinator agents from completing while required delegated subagents, nested agents, or background tasks are still active, orphaned, failed without handoff, or marked successful without independent verification.

## Category

**Thinking** — engineering reliable decomposition, delegation, execution, handoff, stop conditions, and verification without exposing hidden chain-of-thought.

## Problem

Modern coding-agent runtimes can spawn asynchronous and nested work. A parent may incorrectly treat “spawned,” “notification expected,” or even its own successful process exit as proof that delegated work is complete. Recent public reports show headless parent sessions exiting success before subagent output exists, child failures with no structured partial handoff, wrong wait-tool routing, stale running children driving expensive polling, and missing parent linkage that misroutes completed findings.

The core engineering problem is not simply final-answer accuracy. It is a distributed lifecycle invariant:

> A parent must not report success until every required descendant has a terminal successful state, a valid handoff, and independent verification.

## Evidence

Research and source links are documented in `evidence/research.md`. Important current signals include:

- Claude Code #85066 (2026-08-08): headless session returned success shortly after dispatching subagents while required review work was not produced.
- Claude Code #83412 (2026-08-02): subagents terminating on usage/spend limits without partial-result handoff or structured recovery.
- OpenAI Codex #37113 (2026-08-05): coordinator sometimes routed a required subagent wait to an unrelated wait primitive.
- OpenAI Codex #37299 (2026-08-06): stale `running` subagents drove repeated wait/status orchestration and very high token usage.
- Claude Code #84102 (2026-08-05): background sessions lacked durable parent linkage, causing result routing ambiguity.
- Claude Code #76681 and #75043 (July 2026): background/nested completion delivery and ownership paths could leave work orphaned or undelivered.

These reports do not imply that every runtime always fails. They demonstrate that prompt-level “wait for agents” conventions are insufficient as the sole correctness boundary.

## Existing approach

Common approaches are:

1. ask the model to wait for all agents;
2. trust task-completion notifications;
3. poll child status repeatedly;
4. trust the parent/headless process exit code;
5. run a generic final completion review.

## Existing limitations

- A model can select the wrong wait primitive or stop polling early.
- Notification delivery can fail independently of actual child lifecycle state.
- Parent success can occur before a required result exists.
- Stale `running` states can make model-driven polling expensive and effectively unbounded.
- Resource-limit termination can discard partial work or surface an ambiguous reason.
- Nested descendants can escape a parent-only check without transitive parent-child linkage.
- A generic final verifier may inspect available output without noticing that required delegated computation never joined.

## Proposed improvement

This package introduces a provider-neutral lifecycle join protocol:

```text
Plan
  ↓
Persist logical task contract
  ↓
Validate parent linkage + expected outputs
  ↓
Dispatch provider attempt
  ↓
Observe events / deterministic status
  ↓
Terminal state
  ↓
Structured handoff
  ↓
Independent verification
  ↓
Deterministic descendant join barrier
  ↓
PASS → parent may complete
BLOCKED → recover/replan/fail
```

The LLM may plan and interpret work, but it does not decide whether the lifecycle invariant is satisfied. `scripts/join_guard.py` makes the final join decision from persisted state.

## Architecture

### Logical task identity

Each delegated unit gets a stable `task_id` independent of provider attempt/session IDs. Retries append attempts rather than replacing history.

### Durable lifecycle ledger

The ledger lives outside volatile model context. It records parent linkage, required/optional status, expected outputs, lifecycle state, attempts, heartbeat, terminal reason, handoff reference, and verification reference.

### Explicit state model

Active states:

- `planned`
- `dispatched`
- `running`

Terminal states:

- `succeeded`
- `failed`
- `cancelled`
- `timed_out`
- `resource_exhausted`
- `orphaned`

Only `succeeded` can satisfy a required dependency, and only with a valid handoff plus independent verification.

### Bounded join

The parent checks the transitive descendant closure. Required active/failed/unverified descendants block completion. Waits are finite and stale children require authoritative status reconciliation.

### Handoff boundary

A terminal child and a delivered usable result are separate facts. Successful children require a persisted handoff with artifacts/evidence/checks/risks. Failed/resource-exhausted children may preserve partial handoffs, but partial work is never silently reclassified as success.

### Independent verification

Required successful work is verified by a different agent identity or deterministic verifier. The implementing owner cannot be the sole verifier when independence is required.

## Package structure

```text
agent-subagent-lifecycle-join-barrier/
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
│   └── join_guard.py
├── tests/
│   └── test_join_guard.py
└── verification/
    └── verification-report.md
```

## Installation

Copy the package into the agent-orchestration repository or reference it from the harness. Python 3.10+ is sufficient for the provided checker and tests; it uses only the Python standard library.

Create the runtime store:

```bash
mkdir -p .agent-lifecycle/handoffs .agent-lifecycle/verifications
```

Initialize a ledger:

```json
{
  "version": 1,
  "tasks": []
}
```

## Configuration

Edit `config/policy.json`:

- `stale_timeout_seconds`: age before an active child requires authoritative reconciliation;
- `poll_interval_seconds`: deterministic status interval when event-driven completion is unavailable;
- `max_join_wait_seconds`: hard wall-clock join deadline;
- `max_wait_retries`: additional finite retry ceiling;
- `require_parent_linkage`: child must belong to a known parent;
- `require_handoff_for_success`: success requires result delivery;
- `require_independent_verification`: successful required work requires independent verification;
- `fail_parent_on_required_child_failure`: blocking dependency semantics.

Increase timeouts for legitimately long workloads, but keep them finite.

## Usage

### Validate before dispatch

```bash
python scripts/join_guard.py validate-ledger \
  --ledger .agent-lifecycle/ledger.json
```

### Detect stale required children

```bash
python scripts/join_guard.py stale \
  --ledger .agent-lifecycle/ledger.json \
  --policy config/policy.json
```

### Validate one child

```bash
python scripts/join_guard.py check-task \
  --ledger .agent-lifecycle/ledger.json \
  --task-id review-security
```

### Gate parent completion

```bash
python scripts/join_guard.py check \
  --ledger .agent-lifecycle/ledger.json \
  --parent-id root-task \
  --policy config/policy.json
```

Exit codes:

- `0`: pass;
- `2`: invalid structure/input;
- `3`: stale required task needs reconciliation (`stale` command);
- `4`: join blocked.

In headless CI, propagate the exit code directly. Do not mask non-zero status with `|| true`.

## Workflow

The primary workflow is defined in `workflows/workflows.md`:

1. contract every delegated logical task;
2. validate the ledger before spawn;
3. record provider attempts separately from logical task identity;
4. observe event-driven runtime state or deterministic status;
5. detect stale work within bounded deadlines;
6. terminalize failures truthfully;
7. produce structured handoffs;
8. independently verify required success;
9. run the transitive descendant join barrier;
10. only then permit parent completion.

Recovery workflows cover stale/orphaned work, resource exhaustion with partial artifacts, and headless CI completion gating.

## Skills

`skills/core-skills.md` contains executable procedures for:

- delegation lifecycle contract construction;
- bounded join execution;
- structured handoff plus independent verification;
- safe recovery from stale/resource-limited children.

Each skill defines triggers, inputs, preconditions, tools, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules

`rules/engineering-rules.md` defines enforceable MUST / MUST NOT / SHOULD rules. Key invariants include:

```text
parent_success
  => required_unjoined_descendants == 0

required_child_success
  => verified_handoff_exists == true

wait_elapsed
  <= max_join_wait_seconds
```

No rule permits weakening permissions, approvals, sandboxing, or verification to make a join pass.

## Subagents

`subagents/subagents.md` separates responsibilities among:

- Lifecycle Planner;
- Execution Coordinator;
- Handoff Verifier;
- Recovery Coordinator;
- Join Barrier Agent.

This prevents implementing children from being their only verifier and keeps the final lifecycle decision read-only and reproducible.

## Hooks

`hooks/hooks.md` defines integration points for:

- pre-dispatch contract validation;
- post-spawn attempt registration;
- heartbeat/stale checks;
- terminal handoff checks;
- independent verification;
- pre-parent-completion barrier;
- global wait deadline;
- shutdown cleanup.

All waits and retries are bounded.

## Metrics

Minimum production telemetry:

| Metric | Desired value |
|---|---:|
| `required_unjoined_at_parent_success` | 0 |
| `required_invalid_handoffs_at_parent_success` | 0 |
| `silent_required_orphans` | 0 |
| `independent_verifier_coverage_required_success` | 100% |
| `unbounded_wait_loops` | 0 |
| stale detection latency | <= stale timeout + poll interval |
| model calls used only for status | 0 when deterministic status exists |
| retry attempts/logical task | <= configured maximum |

Also measure join latency, partial-work reuse rate, repeated-work ratio, notification/status discrepancies, and optional-child cleanup failures.

## Verification

### Package verification

`verification/verification-report.md` distinguishes implementation, measurement, and verification. The generation run performed static verification of package logic and attempted to execute the regression suite by fetching the saved files into a local runtime. That local environment could not resolve `raw.githubusercontent.com`, so runtime test execution was not falsely reported as passed.

### Runtime tests

In a normal checkout run:

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```

The suite covers active required children, failed/resource-exhausted children, missing verification, self-verification, nested grandchildren, invalid parent linkage, cycles, optional failure behavior, and fully verified success.

### Integration verification

A provider integration is verified only after fault injection demonstrates that parent success is impossible with required active/failed/unverified descendants, stale detection is bounded, and deterministic status checks avoid idle LLM polling when available.

## Safety

- Do not broaden tool permissions to recover stuck children.
- Do not retry destructive/non-idempotent work without idempotency or human approval.
- Preserve prior attempts and partial artifacts.
- Treat unknown required lifecycle state as blocking.
- Do not cancel required work merely to produce a clean parent exit.
- Use provider status APIs read-only where possible.
- The included checker performs only local JSON reads and emits decisions; it does not mutate repositories, processes, cloud resources, or credentials.

## Failure handling

### Detection

Failures are detected through explicit terminal events, missing/invalid handoff, failed verification, stale heartbeat, missing parent linkage, invalid state graph, global deadline, or provider-status ambiguity.

### Evidence

Persist ledger state, attempt IDs, terminal reason, provider status response, partial artifacts, verification results, and timestamps.

### Retry policy

Default maximum recovery attempts: two per logical task. Transient provider status reads may use a small bounded retry count, but they do not reset the global join deadline.

### Fallback

Preserve partial work and replan the remaining requirement. If safe retry is impossible, fail the required dependency explicitly.

### Escalation

Escalate when lifecycle identity cannot be made authoritative, resource budget cannot complete required work, unsafe side effects would need repetition, or verification repeatedly fails.

### Stop condition

Stop waiting when the child is terminal, stale/unknown beyond policy, or global join deadline expires. Never use unlimited waits.

## Definition of Done

For package deployment into an agent runtime:

- problem and evidence are documented with current public signals;
- provider adapter persists stable logical parent-child linkage;
- every required delegated task has observable expected outputs;
- ledger structural validation passes;
- runtime unit tests pass in the consuming checkout;
- active/failed/resource-exhausted/orphaned required children block parent success under fault injection;
- successful required children need valid independent verification;
- nested required descendants are included transitively;
- stale/global wait thresholds are measured and bounded;
- status-only model calls are eliminated where deterministic status exists;
- partial work is preserved without being misclassified as success;
- retry history is append-only and bounded;
- safety boundaries are not weakened;
- `required_unjoined_at_parent_success == 0` in verification runs;
- no blocking lifecycle defect remains.

## Customization

### Different providers

Keep the logical state model stable and add an adapter that maps provider-specific session/task events into the ledger. Provider IDs belong inside `attempts`, not as the logical task ID.

### Databases instead of JSON

Use a transactional store if multiple workers update lifecycle state concurrently. Expose a read model equivalent to the JSON contract for the join checker or implement the same invariants in database queries/constraints.

### Long-running tasks

Increase deadlines deliberately, prefer event subscriptions, and checkpoint partial work. Avoid shrinking polling intervals to compensate for weak events because this can create token/cost pressure.

### Optional speculative agents

Mark them `required: false`. Their failures can be non-blocking, but cleanup and terminalization remain observable.

### Project-specific verification

Add schema validators, tests, benchmarks, security checks, or artifact signatures before writing `verdict: pass`. Strengthen the verifier contract rather than weakening the join barrier.
