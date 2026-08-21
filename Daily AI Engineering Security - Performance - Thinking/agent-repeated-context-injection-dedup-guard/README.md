# Agent Repeated Context-Injection Dedup Guard

## Topic
Prevent repeated host-generated context from consuming long-running AI-agent context windows without adding new information.

## Category
**Token**

## Problem
Agent hosts can repeatedly inject unchanged rules, system reminders, file-change attachments, hook results, task reminders, IDE events, and other side-channel context on later turns. Because these records are often appended as new events, the model repeatedly receives essentially the same payload. The result can be growing input tokens, lower usable context capacity, higher latency/cost, and earlier compaction even when the visible conversation has not grown proportionally.

## Evidence
`evidence/research.md` documents multiple public 2026 Claude Code reports:
- issue #50998 measured roughly 1,100 tokens/minute of payload growth and 661,706 tokens after 148 minutes in one session;
- issue #32057 measured about 93K tokens of repeated rules over roughly 30 tool calls;
- issue #43410 reported repeated full-file reminders and a session reaching 692K tokens;
- issues #45986 and #27599 show related reminder/reinjection patterns.

These reports support the engineering problem; they do not prove that every agent host has the same implementation.

## Existing approach
Common mitigations include auto-compaction, manual `/compact`, `/clear`, restarting sessions, prompt caching, and manually removing rules/hooks/plugins.

## Existing limitations
Those mechanisms mostly operate downstream of the producer. If a host continues appending unchanged context, the payload can regrow after compaction/reset. Prompt caching may reduce some billing or latency but does not remove context-window occupancy. Disabling useful rules/hooks trades functionality for capacity instead of fixing duplicate admission.

## Proposed improvement
Insert a deterministic admission layer between host-generated context producers and final model-context serialization.

The guard:
1. classifies the producer;
2. assigns a stable logical identity;
3. normalizes representation conservatively;
4. fingerprints source + logical key + normalized content;
5. includes the first occurrence;
6. suppresses exact unchanged duplicates only for explicitly eligible sources;
7. includes every changed version immediately;
8. always includes user/current-tool/safety/authz/recovery sources;
9. bounds ledger state;
10. measures saved tokens and verifies quality independently.

The default design intentionally avoids semantic/LLM-based deduplication because false-positive suppression is harder to verify.

## Architecture

```text
Host producers
  ├─ rules
  ├─ system reminders
  ├─ file attachments
  ├─ hooks
  ├─ task reminders
  └─ IDE events
        │
        v
Source classifier + logical key
        │
        v
Conservative normalization
        │
        v
SHA-256 fingerprint
        │
        v
Policy + bounded ledger
        │
        ├─ include first/changed/required
        ├─ suppress eligible exact duplicate
        └─ fail open for unknown/correctness-sensitive source
        │
        v
Final model context
        │
        v
Token + quality verification
```

## Package structure

```text
agent-repeated-context-injection-dedup-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── sample-events.jsonl
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── context_injection_guard.py
│   └── context_metrics.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_guard.py
├── verification/
│   └── verification.md
└── workflows/
    └── workflows.md
```

## Installation
Requirements:
- Python 3.10+;
- no third-party Python packages for the reference scripts.

Clone/copy this topic package into the repository or host project that builds model context. No network access is required by the scripts.

## Configuration
Edit `config/policy.json`.

Important fields:
- `mode`: `observe` or `enforce`;
- `freshness_turns`: unchanged state is included again after this many turns;
- `ledger_max_entries`: maximum remembered logical keys;
- `max_payload_bytes`: guardrail for optional host attachments;
- `min_suppressible_tokens`: avoids spending policy complexity on tiny items;
- `sources`: explicit deduplication eligibility and default required behavior.

Start new integrations with `mode=observe` even though the checked-in example demonstrates enforcement semantics.

## Event contract
Each host-generated event uses JSONL:

```json
{"turn":3,"source":"rules","logical_key":"rule:csharp-api","version":1,"content":"...","always_include":false}
```

`logical_key` is the durable identity of a state item. It must not be a new UUID every turn.

## Usage
From this topic directory:

```bash
python scripts/context_injection_guard.py \
  --policy config/policy.json \
  --input examples/sample-events.jsonl \
  --output /tmp/context-decisions.jsonl
```

Then compare token estimates:

```bash
python scripts/context_metrics.py \
  --events examples/sample-events.jsonl \
  --decisions /tmp/context-decisions.jsonl \
  --target-reduction 0.30
```

Run regression tests:

```bash
python tests/test_guard.py
```

For production measurement, replace/validate the character estimator with the target model provider's token-count API.

## Workflow
Use `workflows/workflows.md`:

**Observe → Baseline → Cause → Hypothesis → Implement → Measure → Better? → Verify → Complete**

Every remediation loop is bounded to two attempts. If required context is suppressed, enforcement for that source is disabled immediately and correctness takes priority over token savings.

## Skills
`skills/core-skills.md` provides executable procedures for:
- baseline context-injection profiling;
- safe context-admission design;
- token-reduction and quality verification.

Each skill includes triggers, preconditions, procedures, decisions, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` defines enforceable MUST / MUST NOT / SHOULD constraints. The central rule is that no optimization target can justify suppressing user, current tool result, safety, authorization, recovery, or changed-version context.

## Subagents
`subagents/subagents.md` separates responsibilities:
- Context Profiler Agent;
- Admission Policy Agent;
- Implementation Agent;
- Independent Verification Agent.

The implementing agent is not the sole verifier.

## Hooks
`hooks/hooks.md` defines:
- pre-context-build baseline capture;
- pre-injection admission gate;
- post-context token measurement;
- policy-change regression gate;
- final verification.

## Metrics
Measure at least:
- input tokens/task and tokens/turn;
- host-generated token contribution;
- suppressed tokens;
- duplicate event/token ratio;
- unique logical keys and versions/key;
- context growth/turn;
- context-builder p50/p95 latency;
- compaction frequency;
- required-context violation count;
- quality/golden task pass rate;
- tool-selection or recovery regressions.

Default improvement target for the representative replay: **≥30% reduction in repeated host-generated context tokens** with no blocking quality regression.

## Verification
See `verification/verification.md`.

### Implemented
The deterministic guard, policy, metrics tool, hooks, workflows, and tests exist and cover the core admission behavior.

### Measured
Run baseline and guarded builders against the same immutable event stream and record token comparison.

### Verified
Require:
- 0 required-context violations;
- 100% first-occurrence inclusion;
- 100% changed-version inclusion;
- 100% exact-duplicate suppression precision on deterministic fixtures;
- include-all behavior for unknown/current-tool/required sources;
- bounded ledger behavior;
- token target reached on the selected replay;
- no blocking quality regression.

Do not call an integration Verified merely because the reference scripts exist.

## Safety and correctness
This Token optimization is deliberately conservative.

Never automatically deduplicate:
- user messages;
- current tool results;
- safety policy;
- authorization decisions;
- active recovery errors;
- explicit `always_include` events.

Unknown sources fail open by inclusion. Changed fingerprints are included immediately. Oversized required events are included rather than dropped.

## Failure handling
**Detection:** quality regression, missing context, required-context violation, unexpected token spike, or failing fixture.

**Evidence:** policy version, logical key, fingerprint, decision reason, token totals, failing assertion. Avoid storing unnecessary full duplicate payloads.

**Retry:** maximum two policy/integration remediation attempts.

**Fallback:** set the implicated source to `deduplicate=false` and return to include-all behavior.

**Escalation:** human/release-owner review for safety/authz/user-context suppression, ambiguous source semantics, or two failed fixes.

**Stop condition:** never weaken correctness, safety, or required-context coverage to hit a token goal.

## Definition of Done
- Real problem and public evidence documented.
- Existing approaches and limitations documented.
- Representative baseline captured.
- Dominant repeat producer identified.
- Stable logical keys defined.
- Guard integrated/reference implementation complete.
- Regression tests pass.
- Before/after token metrics collected on identical input.
- Required and changed context preserved.
- Quality regression gate passes.
- Failure/rollback path documented.
- Independent verification complete.
- No blocking issue remains.

## Customization
### Source-specific budgets
Add source-specific freshness or token budgets after measurement. Keep correctness-sensitive sources include-all.

### Provider token counting
Integrate the provider's official token-count endpoint at the post-context-build hook while retaining the portable estimator for offline tests.

### Compact references
Some hosts may emit a compact marker such as `rule:dotnet-security unchanged since turn 12` instead of complete silence. Treat that marker as a separately budgeted host feature and test whether it actually helps quality.

### Semantic deduplication
Not enabled by default. If introduced, evaluate precision/recall on a labeled corpus and require independent verification because semantically similar text may contain one critical changed constraint.

### Multi-agent systems
Use separate ledgers per agent unless shared state semantics are explicitly defined. One agent's observation must not suppress another agent's required handoff.

## Research sources
See `evidence/research.md` for dates, observed measurements, interpretation boundaries, current approaches, root-cause hypotheses, and source links.
