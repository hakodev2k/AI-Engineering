# Agent Hidden Subagent Token Attribution Gate

## Topic
Hidden subagent token amplification and missing per-agent/per-feature attribution.

## Category
**Token**

## Problem
Multi-agent coding systems can spend significant tokens in child agents created for approvals, reviews, background memory, research, or other orchestration. When usage is visible only at the parent-session level—or child usage is reported as one combined total—developers cannot reliably explain quota drain, calculate cost by role, catch regressions, or enforce a budget before a runaway child tree consumes the remaining quota.

The engineering problem is not simply “use fewer tokens.” It is that token consumption must be attached to an execution graph and token class before it can be safely optimized.

## Evidence
Current public signals are documented in `evidence/research.md`.

Key evidence:
- OpenAI Codex issue #36736 (2026-08-03) reported a guardian approval reviewer spawning 78 child sessions consuming about 7.0M total tokens over two days, plus background memory retries, with no clear UI breakdown of that feature's consumption.
- Anthropic Claude Code issue #85890 (2026-08-11, open as of 2026-08-21) reports that Agent/Workflow task notifications expose a combined `subagent_tokens` number without input/output/cache classes, preventing accurate cost attribution.
- OpenAI Codex issue #33196 (2026-07-15) provides an additional signal that parallel subagent workflows can amplify token/compaction activity dramatically in bounded tasks.

These reports do not prove identical root causes across products. They establish a recurring engineering need for observable, bounded child-agent consumption.

## Existing approach
Common approaches include session-level totals, combined child totals, manual JSONL/log inspection, and prompt instructions asking agents to remain economical.

## Existing limitations
- Session totals do not reveal which role or background feature caused consumption.
- Combined child totals hide input/output/cache composition and therefore cost precision.
- Manual diagnosis is reactive and product-specific.
- Prompt instructions are advisory and cannot enforce an orchestration budget.
- Hidden/platform-created agents may not be governed by the user's prompt.
- Aggregate quota UI can identify that usage occurred without proving which execution path caused it.

## Proposed improvement
This package introduces a provider-neutral attribution and budget layer:

1. Normalize raw JSON/JSONL usage into parent-task/agent/role records.
2. Preserve input, output, cache read, and cache write separately when available.
3. Put combined-only token totals into an explicit `unknown_tokens` bucket instead of guessing a split.
4. Measure parent-tree totals, child share, child count, role totals, unknown ratio, and tokens per completed child outcome.
5. Apply a parent-owned token envelope plus per-child and per-role ceilings.
6. Gate optional child spawns before creation when remaining budget is insufficient.
7. Stop/escalate mandatory security or approval work that cannot fit; never bypass it merely to save tokens.
8. Re-run representative workload and acceptance tests to verify savings without quality regression.

## Architecture

```text
Provider/host usage events
          |
          v
  lifecycle adapter
(task/agent/parent/role)
          |
          v
scripts/analyze_usage.py
          |
          +---- normalized agent ledger
          |
          +---- task/role metrics
          |
          v
config/budgets.json
          |
          v
 pre-spawn + post-usage gates
          |
     allow / block optional
          |  / escalate mandatory
          v
 before/after verification
```

The deterministic analyzer performs accounting and policy evaluation. LLM subagents may analyze evidence or implement host integration, but they are not trusted to calculate their own budget enforcement state.

## Package structure

```text
agent-hidden-subagent-token-attribution-gate/
├── README.md
├── guide-intergration.md
├── config/
│   └── budgets.json
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
│   └── analyze_usage.py
└── tests/
    └── test_analyzer.py
```

## Installation
Requirements: Python 3.10+; no third-party packages.

Clone/copy this package into the host repository. Make the analyzer executable on Unix if desired:

```bash
chmod +x scripts/analyze_usage.py
```

Run package tests:

```bash
python tests/test_analyzer.py
```

## Configuration
`config/budgets.json` contains example starting values for:
- maximum children per parent;
- maximum tokens per parent execution tree;
- maximum tokens per child;
- maximum unknown-token ratio;
- maximum child-token share;
- per-role overrides for guardian, reviewer, memory, and research roles.

The example numeric limits are not universal production recommendations. Establish a workload baseline first and tune them from measured normal/worst-case runs.

## Usage
Given usage telemetry:

```bash
python scripts/analyze_usage.py telemetry.jsonl \
  --policy config/budgets.json \
  --report usage-report.json
```

The analyzer accepts JSON arrays or JSONL objects. A normalized event can contain:

```json
{
  "task_id": "task-123",
  "agent_id": "review-4",
  "parent_id": "root-1",
  "role": "reviewer",
  "completed": true,
  "usage": {
    "input_tokens": 12000,
    "output_tokens": 900,
    "cache_read_input_tokens": 3000,
    "cache_creation_input_tokens": 500
  }
}
```

If only a combined child total exists, supply `subagent_tokens`; the unexplained amount is recorded as unknown rather than assigned to a guessed class.

Exit codes:
- `0` pass;
- `2` policy/budget violation;
- `3` invalid input/config;
- `4` I/O error.

## Workflow
The primary workflow in `workflows/workflows.md` is:

**Observe → Normalize → Reconcile → Diagnose → Hypothesis → Budget → Implement → Measure again → Independent verification**

Optimization loops are bounded to two failed hypotheses before escalation. A failed hypothesis must not trigger endless budget shrinking or repeated expensive runs.

The package also defines:
- a deterministic pre-spawn budget workflow;
- a hidden/background quota incident workflow;
- a CI token-regression workflow.

## Skills
`skills/core-skills.md` contains executable procedures for:
- building a subagent usage baseline;
- designing parent-owned token envelopes;
- diagnosing hidden/background amplification;
- verifying token regressions without weakening correctness/security.

Each skill includes trigger, inputs, procedure, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` defines testable MUST/MUST NOT/SHOULD constraints. Core invariants include:
- never guess missing token classes;
- always preserve unknown usage explicitly;
- enforce parent/child attribution when possible;
- never remove mandatory security/approval checks solely for savings;
- never allow unbounded recursive fan-out or retries;
- never claim verified savings without before/after measurement and quality checks.

## Subagents
`subagents/subagents.md` defines four non-overlapping roles:
- Telemetry Analyst;
- Token Budget Engineer;
- Implementation Agent;
- Independent Verification Agent.

The implementation agent cannot be the sole verifier of high-impact budget behavior.

## Hooks
`hooks/hooks.md` specifies predictable controls for:
- pre-task telemetry validation;
- pre-spawn envelope checks;
- post-child usage checkpoints;
- idle/background consumption detection;
- pre-commit regression checking;
- final Implemented/Measured/Verified classification.

## Metrics
Primary metrics:
- **Attributable token ratio:** tokens attached to known execution identity / total observed tokens.
- **Unknown-token ratio:** combined/unclassified tokens / total tokens.
- **Child token share:** child tokens / parent-tree total.
- **Child count:** unique children under the parent task.
- **Role total:** tokens consumed by each role/feature.
- **Tokens per completed child outcome:** child token total / completed useful child outputs.
- **Cache-read/cache-write ratios:** when those classes are available.
- **Budget breach count** and **prevented optional spawn count**.

Task acceptance rate, verification coverage, and rework rate must be tracked alongside token metrics to prevent false savings.

## Verification
### Implemented
- host emits stable parent-child metadata or an explicit unattributed bucket;
- analyzer runs deterministically;
- budget policy is loaded and enforcement points exist.

### Measured
- a representative baseline and candidate workload are both captured;
- totals reconcile with source telemetry;
- unknown ratio is reported rather than hidden;
- before/after parent-tree, role, and outcome metrics exist.

### Verified
- target token metrics improve or remain within agreed ceilings;
- acceptance tests pass within documented tolerance;
- mandatory security/approval/review coverage is preserved;
- breach and escalation paths pass tests;
- independent verifier signs off on equivalent workload comparison.

## Safety
This is a token-control package, not a permission bypass. A mandatory reviewer that exceeds its budget must stop/escalate or use an explicitly approved bounded alternative. It must never auto-approve, silently skip verification, or remove required context to satisfy a token ceiling.

Raw telemetry should be collected with minimum necessary data. Prompt and response text is generally not required for token attribution; counters and lifecycle IDs are preferred.

## Failure handling
| Failure | Detection | Retry policy | Fallback | Stop condition |
|---|---|---|---|---|
| Invalid telemetry/config | analyzer exit `3` | fix data/config; no blind retry | preserve raw input | valid parse or escalate |
| I/O failure | exit `4` | one retry after fixing path/storage | alternate safe output location | successful write or escalate |
| Child budget exceeded | exit/report violation | no automatic same-condition retry | block optional child | new approved budget/evidence |
| Mandatory reviewer budget exceeded | pre/post gate | no auto-bypass | stop/escalate | human-approved resolution |
| Unknown ratio too high | report metric | improve instrumentation | coarse totals only | precision adequate or claim remains unknown |
| Optimization fails | before/after comparison | max two changed hypotheses | rollback | verified improvement or escalation |
| Quality/security regression | acceptance/verification failure | one corrected implementation attempt if evidence supports it | rollback | quality restored or optimization abandoned |

## Definition of Done
The package is complete for a host integration only when:
1. current public evidence and existing limitations are documented;
2. a representative baseline is captured;
3. child usage is attributed or explicitly marked unattributed/unknown;
4. token classes are preserved without guessed splits;
5. a parent-owned and per-role budget is configured;
6. pre-spawn/post-usage enforcement exists where lifecycle hooks permit it;
7. analyzer tests and host-specific acceptance tests pass;
8. before/after metrics are collected;
9. mandatory security/approval/review behavior remains intact;
10. independent verification marks the improvement **Verified**;
11. no blocking attribution or budget issue remains.

## Customization
See `guide-intergration.md` for provider adapters and lifecycle integration. Extend schema field aliases in `scripts/analyze_usage.py` when a provider uses different names, while preserving four invariants: non-negative counters, explicit unknown bucket, stable execution IDs, and deterministic budget evaluation.

For organizations with actual pricing data, add a separate cost calculator after normalization. Do not embed provider prices into the attribution layer unless they are versioned and sourced, because pricing changes independently of execution telemetry.
