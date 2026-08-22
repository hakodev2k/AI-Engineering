# Agent Prompt Cache Invalidation Sentinel

## Topic
Detecting repeated prompt-cache collapse in long-running AI coding sessions before it silently burns large token budgets and adds latency.

## Category
**Token**

## Problem
Long sessions can move from healthy prompt-cache reuse to repeated large cache rewrites while still producing apparently normal agent responses. Without request-level monitoring, teams may notice only after a usage window, latency budget, or API spend is already exhausted.

## Evidence
Recent public reports in August 2026 show multiple concrete forms of this problem:
- Claude Code #83542: repeated cache drops and roughly 10.4M redundant cache-write tokens in one reported session;
- Claude Code #85326: a ~950k-token context repeatedly re-written after cache reads collapsed;
- Claude Code #83913: controlled report tying cache invalidation to changing hook `additionalContext` during history rebuild;
- Claude Code #84253: reported one-hour TTL regression causing rewrites after five-minute gaps;
- Claude Code #86244: reported background-update boundary invalidating resumed-session caches;
- OpenAI Codex #27008: long-running task proposal highlighting repeated long-context reprocessing after pauses.

Detailed evidence, limitations, hypotheses, and source links are in `evidence/research.md`.

## Existing approach
Today developers typically rely on provider prompt caching, aggregate usage dashboards, manual transcript inspection, or restarting/shortening sessions after abnormal consumption is noticed.

## Existing limitations
- Prompt caching is often treated as an opaque optimization rather than an observable invariant.
- Aggregate billing does not identify the first cache-collapse request.
- Manual transcript analysis is slow and easy to mis-group when one request has multiple stored blocks.
- A single miss can be legitimate; the operationally dangerous case is repeated large rewrites.
- Restarting sessions may discard useful context and does not diagnose the underlying transition.

## Proposed improvement
This package adds a deterministic **cache invalidation sentinel** at the request-accounting boundary. It consumes token-usage metadata only, identifies a previously warm session, detects abrupt cache-read collapse combined with large cache creation, and escalates only when the pattern repeats inside a bounded request window.

It intentionally separates detection from root-cause attribution. Version changes, hooks, TTL, resumes, and updates are recorded as evidence/correlation when available; counters alone never prove a provider bug.

## Architecture

```text
model/client request
      |
      v
usage metadata collector
      |
      v
JSONL normalized events
      |
      v
scripts/cache_sentinel.py
      |
      +--> metrics: read ratio / writes / collapse count
      |
      +--> incidents: repeated warm->collapse transitions
      |
      v
triage workflow -> bounded hypothesis test -> mitigation
      |
      v
independent before/after verification
```

The detector does not need prompt text, tool output, source code, or secrets.

## Package structure

```text
agent-prompt-cache-invalidation-sentinel/
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
│   └── cache_sentinel.py
├── examples/
│   ├── healthy-events.jsonl
│   └── pathological-events.jsonl
├── tests/
│   └── test_cache_sentinel.py
└── verification/
    └── verification.md
```

## Installation
Python 3.10+ is sufficient; no third-party dependencies are required.

```bash
python scripts/cache_sentinel.py --help
python -m unittest tests/test_cache_sentinel.py
```

## Configuration
`config/policy.json` defines:
- minimum read tokens/read ratio for a clearly warm predecessor;
- maximum read ratio for a collapse;
- absolute large-rewrite threshold;
- rewrite threshold relative to the previous warm cache read;
- repeated-collapse request window;
- minimum collapses per incident;
- maximum incidents per session;
- whether incidents cause exit code 2.

Deploy in observe-only mode first. Tune thresholds from measured healthy sessions, not from a pathological incident.

## Usage

```bash
python scripts/cache_sentinel.py session-usage.jsonl \
  --policy config/policy.json \
  --output cache-report.json
```

The report contains:
- total cache-read, cache-creation, and uncached input tokens;
- overall cache-read ratio;
- detected collapse events;
- estimated rewrite tokens on detected collapse events;
- repeated-thrash incidents;
- request/timestamp/version/model/miss-reason metadata when present.

`estimated_rewrite_tokens` is a diagnostic estimate, not a billing claim.

## Workflow
Use `workflows/workflows.md`:
1. Observe and normalize request-level usage.
2. Establish/compare against a healthy baseline.
3. Identify the first warm→collapse transition.
4. Build a facts/correlation table around that request.
5. Test at most three hypotheses, with at most two expensive large-context reproductions.
6. Implement one reversible mitigation.
7. Measure the same representative workflow again.
8. Independent verifier checks cache metrics plus task correctness.
9. Adopt only when evidence meets the verification contract.

## Skills
`skills/core-skills.md` contains reusable procedures for:
- cache-health baselining;
- cache-collapse diagnosis;
- cache-safe change verification.

Each skill defines triggers, inputs, preconditions, tools, decisions, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` enforces the important invariants: baseline before optimization, no unsupported root-cause claims, no unlimited expensive reproductions, no correctness/safety context removal, and no claimed token savings without before/after counters.

## Subagents
`subagents/subagents.md` defines non-overlapping roles:
- **Cache Evidence Analyst** — finds and documents measurable collapse boundaries;
- **Cache Mitigation Engineer** — implements the smallest reversible fix;
- **Independent Verification Agent** — validates token metrics and correctness without changing the candidate.

## Hooks
`hooks/hooks.md` defines predictable gates for baseline validation, post-session health analysis, release regression tests, and incident escalation.

## Metrics
Primary metrics:
- `cache_read_ratio`;
- cache-creation/write tokens per request and session;
- collapse-event count;
- repeated incident count;
- estimated rewrite tokens;
- rewrite reduction % after mitigation;
- latency delta when available;
- task correctness/eval status.

A good optimization restores expected cache reuse while preserving or improving task correctness. Lower tokens caused by silently deleting required context do not qualify.

## Verification
`verification/verification.md` separates:
- **Implemented** — package capabilities exist;
- **Measured** — deployment-specific counters were collected;
- **Verified** — candidate has no repeated-collapse incident, improves/restores measured cache behavior, and passes correctness/safety verification.

The included fixtures verify detector behavior only; they do not claim production savings.

## Safety
- The sentinel requires metadata, not prompt/source/tool content.
- Do not remove safety, authorization, repository, or task instructions to improve cache hit rate.
- Do not repeatedly rebuild huge contexts to prove an incident.
- Treat cache-miss reasons and version transitions as evidence, not automatic root cause.
- Run blocking mode only between safe model-request checkpoints.

## Failure handling
- malformed JSON or policy: exit 3 and fix input;
- I/O/runtime error: exit 4 and preserve metadata;
- repeated incident in blocking mode: exit 2;
- unknown cause after bounded tests: remain observe-only or checkpoint into a fresh session when safe, then escalate with minimal evidence;
- candidate worsens cache or correctness: roll back.

## Definition of Done
For the package itself:
- current public evidence exists;
- existing approaches and limitations are documented;
- deterministic analyzer, policy, fixtures, tests, skills, rules, subagents, workflows, hooks, guide, and verification contract exist;
- retries and expensive reproductions are bounded;
- no prompt/tool/source content is required.

For a production mitigation:
- baseline captured;
- first collapse identified;
- controllable cause supported by evidence or explicitly marked unknown;
- candidate implemented and measured;
- repeated-collapse incident removed or healthy baseline restored;
- task quality/safety tests pass;
- independent verification completed;
- no blocking issue remains.

## Customization
Adapt the JSON normalizer if your provider uses different cache counters. Keep the normalized semantics stable. Add client-specific metadata fields at collection time if useful for correlation, but avoid feeding volatile diagnostic content into the cache-critical prompt prefix itself.

For teams with multiple models, clients, or workflows, maintain separate policy/baseline profiles rather than forcing one threshold across all workloads.
