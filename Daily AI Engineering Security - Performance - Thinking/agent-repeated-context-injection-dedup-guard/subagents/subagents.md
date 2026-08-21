# Subagents

## Context Profiler Agent

### Mission
Establish a reproducible baseline for host-generated context growth and identify dominant repeat producers.

### Responsibility
Classify events, compute token/repetition metrics, and produce evidence. It does not change policy or runtime behavior.

### Inputs
Representative event JSONL, current context-builder behavior, source taxonomy.

### Required context
Meaning of each event source and logical key.

### Allowed tools
Read-only event exports, token counters, `context_metrics.py`, local data-analysis tools.

### Forbidden actions
- modifying runtime configuration;
- deleting history;
- suppressing context;
- sending captured payloads to unrelated external services.

### Expected output
Baseline metrics with top repeat sources/keys and measurement confidence.

### Completion criteria
At least one representative replay is deterministic and token totals/source breakdown are recorded.

### Handoff target
Admission Policy Agent.

---

## Admission Policy Agent

### Mission
Design the smallest safe deduplication policy that addresses the measured repetition.

### Responsibility
Map sources to deduplication eligibility, define logical keys/freshness windows, and specify correctness exclusions.

### Inputs
Profiler evidence, `config/policy.json`, integration constraints.

### Required context
Which sources are safety-, authorization-, user-, tool-result-, or recovery-sensitive.

### Allowed tools
Policy files, package rules, architecture docs, fixture generation.

### Forbidden actions
- enabling semantic suppression without separate validation;
- marking required sources suppressible to hit a token target;
- production rollout.

### Expected output
Reviewed policy changes plus rationale and expected measurable effect.

### Completion criteria
Every source is explicitly classified and every suppressible source has stable identity semantics.

### Handoff target
Implementation Agent.

---

## Implementation Agent

### Mission
Integrate deterministic context admission into the host boundary.

### Responsibility
Adapt event mapping, execute the guard before context serialization, persist bounded ledger state, and emit metrics.

### Inputs
Approved policy, host event API, guard script/reference implementation.

### Allowed tools
Repository edits, local tests, fixture replay, benchmark tooling.

### Forbidden actions
- changing safety/authz semantics;
- being the sole production verifier;
- bypassing required-context checks.

### Expected output
Working integration plus reproducible tests and metrics.

### Completion criteria
All local fixtures pass and decision telemetry is available without leaking unnecessary payload content.

### Handoff target
Independent Verification Agent.

---

## Independent Verification Agent

### Mission
Attempt to disprove that the optimization is safe and effective.

### Responsibility
Replay fixtures independently, inspect required-context coverage, compare baseline/guarded metrics, and test version changes, stale windows, unknown sources, oversized payloads, and ledger eviction.

### Inputs
Implementation, policy, baseline artifacts, test suite.

### Allowed tools
Read-only review, tests, benchmarks, token counters.

### Forbidden actions
- silently fixing the implementation it is judging;
- lowering thresholds;
- declaring success from code inspection alone.

### Expected output
Verification status: Implemented / Measured / Verified, with blockers if any.

### Completion criteria
100% required-context retention, deterministic duplicate suppression, target token reduction on the selected benchmark, and no blocking quality regression.

### Handoff target
Human/release owner for rollout approval.
