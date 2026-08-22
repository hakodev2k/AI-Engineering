# Agent Tool-Loop Progress Guard

## Topic
Progress-aware prevention of redundant and looping tool execution in AI agents.

## Category
Performance

## Problem
Coding/research agents can repeatedly invoke identical or near-duplicate tools, continue exploration after evidence is sufficient, retry rejected strategies without adapting, or exhaust iteration caps. This wastes tool/model calls, latency, tokens, context capacity, and external-system quota.

## Evidence
The package is grounded in multiple public 2026 reports across different agent frameworks:

- Claude Code #59318: same exploratory command repeated 30+ times.
- Google ADK #6566: infinite tool-call loop in streaming multi-agent handoff.
- Hermes #73388: repeated rejected wrapper strategy rather than switching tool path.
- Hermes #49075: idempotent/read-only tool coverage gap in loop guardrail.
- ZeroClaw #7143: near-duplicate repository discovery until `max_tool_iterations` exhaustion.
- Research on verified tool calls shows retry semantics under non-atomic failures can cause duplicate actions and unnecessary executions.

See `evidence/research.md` for source links and evidence/interpretation boundaries.

## Existing approach
Common defenses are global iteration caps, exact duplicate detection, repeated-failure counters, prompt instructions, warning-first guardrails, and operator reset.

## Existing limitations
Those mechanisms often fail to detect successful-but-useless repetitions, semantic/near-duplicate calls, repeated strategy families, missing tool classifications, and ambiguous side-effect retries. A hard cap also stops work without necessarily preserving evidence or guiding recovery.

## Proposed improvement
This package introduces a deterministic host-side progress guard that combines:

1. canonical tool-call fingerprints;
2. strategy-family fingerprints;
3. output-digest novelty tracking;
4. phase/global call budgets;
5. warning → strategy-change → block escalation;
6. safe `verify-before-retry` semantics for ambiguous side-effect failures;
7. recovery packets instead of blind termination;
8. measurable before/after trace analysis.

## Architecture

```text
                    ┌──────────────────────┐
Model / Agent ─────▶│ Candidate Tool Call  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Progress Guard       │
                    │ - canonicalize       │
                    │ - fingerprint        │
                    │ - budgets            │
                    │ - repeat/novelty     │
                    └──────────┬───────────┘
          ┌────────────────────┼─────────────────────────┐
          │                    │                         │
          ▼                    ▼                         ▼
       allow/warn      require strategy change       block/
          │              or verify-before-retry      escalate
          ▼
   Execute actual tool
          │
          ▼
   Record result digest
          │
          ▼
   Metrics + agent context
```

The model can propose calls but cannot override the host-side hard policy.

## Package structure

```text
agent-tool-loop-progress-guard/
├── README.md
├── guide-intergration.md
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
├── config/
│   └── policy.json
├── scripts/
│   ├── tool_loop_guard.py
│   └── analyze_trace.py
├── tests/
│   └── test_tool_loop_guard.py
└── verification/
    └── report.md
```

## Installation
Requires Python 3.10+ and only the Python standard library for the included scripts.

```bash
python --version
python tests/test_tool_loop_guard.py
```

No API keys or secrets are required by the guard itself.

## Configuration
Edit `config/policy.json`.

Primary controls:
- exact-repeat warning/strategy/block thresholds;
- strategy-family thresholds;
- phase and global call budgets;
- tool classifications;
- volatile comparison-only keys;
- family keys per tool;
- polling policy;
- ambiguous failure statuses;
- recovery-cycle limit.

The default policy is an example. Review every production tool before enforcement.

## Usage
### Decide before execution

```bash
python scripts/tool_loop_guard.py decide \
  --policy config/policy.json \
  --state runtime/guard-state.json \
  --call candidate.json
```

Possible decisions:
- `allow`
- `warn`
- `require-strategy-change`
- `block`
- `verify-before-retry`

### Record after execution

```bash
python scripts/tool_loop_guard.py record \
  --policy config/policy.json \
  --state runtime/guard-state.json \
  --call candidate.json \
  --result result.json
```

### Analyze traces

```bash
python scripts/analyze_trace.py trace.jsonl --policy config/policy.json
```

See `guide-intergration.md` for host-runtime integration.

## Workflow

```text
Observe high tool cost/loops
       ↓
Capture baseline traces
       ↓
Canonicalize + group call families
       ↓
Identify exact/family/no-novelty patterns
       ↓
Tune guard policy
       ↓
Shadow evaluate
       ↓
Enforce read-only loops first
       ↓
Measure again
       ↓
Completion preserved?
 ├─ No → revert/tune once → verify again
 └─ Yes → independent verification → rollout
```

Every tuning/recovery loop is bounded.

## Metrics
At minimum measure:
- total tool calls/task;
- exact repeat ratio;
- strategy-family repeat ratio;
- same-output/no-novelty pairs;
- tool wall-clock time;
- model/token cost if available;
- calls warned/blocked/avoided;
- strategy-change recoveries;
- ambiguous side-effect retries prevented;
- task completion rate;
- false-positive override rate.

### Target validation criteria
For representative loop-prone workloads:
- at least 60% fewer duplicate/near-duplicate exploratory calls;
- <5% false-positive hard blocks on curated productive traces;
- no reduction in accepted task-completion quality beyond the team's defined tolerance;
- zero automatic replays of ambiguous side-effecting calls.

These are targets, not claims of already measured production improvement.

## Verification
The package separates three statuses:

### Implemented
The policy, guard scripts, analyzer, hooks, tests, workflows, rules, and documentation exist.

### Measured
Requires running baseline and guarded traces in the target environment. Metrics must be captured rather than inferred.

### Verified
Requires contract tests plus workload-specific benchmark evidence showing fewer wasted calls without unacceptable completion regression.

See `verification/report.md`.

## Safety
Although this is primarily a Performance package, retry safety crosses into security/reliability:

- side-effecting tools are never automatically replayed after ambiguous failure;
- unknown tools are not assumed idempotent;
- policy failures fail closed for risky tools;
- host policy cannot be overridden by prompt/model text;
- global/phase budgets cannot be reset merely to escape a stop condition.

## Failure handling
- Guard input/policy malformed → explicit error; risky tools fail closed.
- Guard state write failure → previous valid state preserved via atomic replacement.
- Repeated loop after one recovery cycle → stop/escalate.
- Ambiguous side-effect result → verify externally before retry.
- False-positive blocks → retain trace and override evidence, tune a new policy version, rerun benchmark.
- Performance regression → restore previous policy and preserve comparison evidence.

## Definition of Done
A production integration is done only when:

1. Public problem evidence is documented.
2. Every exposed tool is classified or treated as unknown.
3. Every invocation crosses `pre_tool_call`.
4. Every executed call records outcome metadata/digest.
5. Exact and family repetition are deterministically detectable.
6. Per-phase/global budgets are enforced.
7. Strategy-change and hard-stop behavior are bounded.
8. Ambiguous side-effect failures cannot auto-replay.
9. Contract tests pass in the target environment.
10. Baseline and guarded benchmark metrics are collected.
11. Task-completion quality is compared.
12. False-positive blocks are reviewed.
13. Recovery behavior is exercised.
14. Metrics/alerts are wired.
15. No blocking verification issue remains.

## Customization
### Repository exploration
Use family keys based on repository path/module and track evidence targets such as entrypoint, caller, tests, and configuration.

### RAG/research agents
Group searches by source/domain or query intent; do not collapse materially different evidence requests.

### Test-fix loops
Reset local repetition counters only when code/artifact state changes or a test outcome provides new evidence.

### Polling agents
Use explicit polling policy with minimum interval and maximum attempts. Do not weaken general repetition thresholds globally.

### Multi-agent systems
Assign local phase budgets and a shared coordinator/global budget to prevent aggregate call storms.

## Research sources
Full source details and dates are in `evidence/research.md`. This package intentionally does not claim that its architecture is an official recommendation from the cited projects; it is an engineering synthesis designed to address the observed recurring failure class.