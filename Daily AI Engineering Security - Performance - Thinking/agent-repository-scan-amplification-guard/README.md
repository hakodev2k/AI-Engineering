# Agent Repository Scan Amplification Guard

## Topic
Preventing runaway repository, Git, ripgrep, and sandbox filesystem scans from dominating AI coding-agent performance.

## Category
**Performance**

## Problem
AI coding-agent hosts can repeatedly rescan repositories, untracked files, dependency trees, sandbox writable roots, or even saved-but-inactive projects. These scans may happen before or around normal tool calls and can consume CPU, disk I/O, process slots, and wall time even when the model did not explicitly request a full repository search.

The practical problem is not merely that large repositories are slow. It is **scan amplification**: equivalent or over-broad discovery work is repeated without a clear budget, identity, invalidation policy, or attribution layer.

## Evidence
Current public signals are documented in [`evidence/research.md`](evidence/research.md). Key examples include:
- OpenAI Codex issue #38105 (2026-08-12): thousands of repeated `rg --files` scans after worktree creation, causing severe machine-wide slowdown;
- Codex issue #35008 (2026-07-23): repeated Git scans of large untracked directories causing sustained high CPU;
- Codex issue #32113 (2026-07-10): inactive saved repositories still receiving expensive untracked-file scans;
- Codex issues #33737 and #34529 (2026-07): sandbox setup repeatedly traversing large writable roots and adding tens of seconds to minutes before tool execution.

## Existing approach
Teams commonly rely on `.gitignore`, ripgrep ignore rules, sparse checkout, smaller worktrees, manual closing of inactive projects, host indexing caches, and sandbox configuration.

## Existing limitations
Those controls are incomplete because not every host or sandbox traversal honors Git/search ignore rules, dependency trees may still be writable roots, inactive projects can remain scheduled for bookkeeping, and repeated scans often lack explicit telemetry. Tool-latency dashboards can also hide pre-tool scan overhead by combining it with the visible command duration.

## Proposed improvement
Add an explicit repository-scan control plane:

```text
Scan request
  -> identify repo/worktree/scope/reason/scanner
  -> check duplicate window
  -> check scan rate + concurrency
  -> check full-root justification + path policy
  -> execute or suppress/block
  -> record elapsed/files/paths
  -> update bounded cache/invalidation state
  -> verify against performance + correctness baselines
```

The package does not require model chain-of-thought and does not solve the problem with prompt instructions. Deterministic host-side policy decides whether maintenance scans are allowed.

## Architecture
### Scan event model
Every filesystem-discovery operation is represented as a JSONL event with timestamp, repository, worktree, scope, reason, scanner, elapsed time, concurrency, and optional file/path information.

### Scan identity
Equivalent scans are keyed by repository, worktree, scope, reason and scanner. Integrations may extend this with ignore-policy or filesystem-generation versions.

### Budget gate
[`scripts/scan_guard.py`](scripts/scan_guard.py) detects duplicate-equivalent scans, scans/minute above policy, excessive concurrency, blocking durations, unapproved full-root reasons, and denied path traversal.

### Bounded invalidation
Caching/deduplication is valid only until repository state changes in a way that can affect discovery. File create/delete/rename, checkout, worktree lifecycle, sparse-checkout and ignore-policy changes are recommended invalidators.

### Independent verification
Performance optimization and correctness verification are separate roles. The implementing agent is not the sole verifier.

## Package structure

```text
agent-repository-scan-amplification-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── scan-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── scan-events.jsonl
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── scan_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_scan_guard.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.10+ and only the Python standard library. Copy this package into the repository or host integration project. No secrets are required.

## Configuration
Edit [`config/scan-policy.json`](config/scan-policy.json). Defaults include a 30-second duplicate window, one equivalent scan per window, 12 scans/minute per repository, two concurrent scans, 2-second slow warning, 15-second blocking duration, explicit reasons for full-repository scans, and example denied generated/dependency fragments.

The denied-path list is intentionally conservative and must be adapted to the target workspace. Do not exclude a directory if the task requires discovery there.

## Usage

```bash
python scripts/scan_guard.py \
  --events examples/scan-events.jsonl \
  --policy config/scan-policy.json \
  --report scan-report.json
```

Exit codes: `0` pass, `2` policy violation, `3` invalid input/policy, `4` I/O failure.

Run tests:

```bash
python -m unittest tests/test_scan_guard.py
```

Follow [`guide-intergration.md`](guide-intergration.md) for host instrumentation and pre/post-scan hooks.

## Workflow
Primary workflow: **Observe → Baseline → Attribute → Hypothesize → Optimize → Replay → Compare → Independent Verify**. Diagnosis retries are limited to two and optimization retries to three. See [`workflows/workflows.md`](workflows/workflows.md).

## Skills
[`skills/core-skills.md`](skills/core-skills.md) provides scan baseline/attribution, scope/deduplication optimization, and release regression-gating procedures.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) defines MUST/MUST NOT/SHOULD invariants including measurement before optimization, correctness-preserving discovery, bounded caching, preserved sandbox boundaries, and no automatic threshold relaxation.

## Subagents
[`subagents/subagents.md`](subagents/subagents.md) defines Performance Investigator, Host Optimization Agent, Independent Verification Agent, and Orchestrator.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) covers baseline capture, pre-scan budget enforcement, post-scan telemetry, filesystem invalidation, inactive-project handling, regression checks, and final verification.

## Metrics
Track scans/task, duplicate-equivalent ratio, total scan time/task, p50/p95 pre-tool scan latency, total tool latency, maximum concurrent scanners, scans/minute/repository, files/paths walked when observable, inactive-project scan count, and repository-discovery fixture pass rate.

Do not claim improvement until baseline and candidate measurements exist for the same workload.

## Verification
[`verification/report.md`](verification/report.md) separates **Implemented**, **Measured**, and **Verified**. Production verification must test file creation, deletion, rename, checkout, and ignore-policy changes after caching or deduplication is introduced.

## Safety
The analyzer is read-only over trace files and requires no secrets. It does not run Git or mutate repositories. Sandbox protections must not be weakened merely to remove traversal overhead. User-requested search cannot be silently suppressed without a correctness-preserving result. Policy exceptions require explicit review.

## Failure handling
If optimization misses files or changes discovery semantics: stop rollout, preserve baseline/candidate traces, revert the latest optimization, identify the missing invalidation signal or over-aggressive scope rule, retry only within the three-iteration limit, and escalate if the correct fix requires upstream host changes.

If scan attribution remains ambiguous after two diagnostic retries, improve instrumentation rather than changing performance policy.

## Definition of Done
A target integration is complete only when evidence/baseline are documented; scan events identify repo/worktree/scope/reason/scanner; deterministic policy is enforced; duplicate/rate/concurrency thresholds are configured; full-root scans require explicit reasons; invalidation covers material repository changes; before/after metrics exist; independent verification confirms improvement; add/delete/rename/checkout/ignore-change fixtures pass; inactive repositories do not create unapproved scan amplification; security/sandbox controls remain intact; and no blocking regression remains.

## Customization
Extend events with CPU time, bytes read/written, PID, cache hit/miss, filesystem generation, model/tool request ID, or lifecycle phase. Preserve three principles: **attribute before optimizing; bound scans without hiding required state; verify total latency and correctness, not just one faster command.**