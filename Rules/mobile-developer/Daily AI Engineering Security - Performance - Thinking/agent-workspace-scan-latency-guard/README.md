# Agent Workspace Scan Latency Guard

## Topic
Prevent repeated Git/filesystem/sandbox/plugin workspace scans from dominating AI coding-agent tool latency.

## Category
Performance

## Problem
Modern coding agents often perform repository and runtime preparation around each tool call. In large workspaces, especially Windows/WSL setups with large dependency trees, untracked artifacts, cross-filesystem caches, or concurrent agent tasks, this hidden metadata work can cost far more than the actual command.

Recent Codex issue reports show concrete examples:
- 30–130 second tool latency while the underlying operation completed in roughly 114–178 ms;
- `git status` exceeding 24 seconds in a repository with tens of thousands of untracked files, then falling to about 56 ms after a local exclusion;
- a WSL trace where roughly 42% of sampled file/process syscall lines touched a Windows-backed plugin cache while about 3% touched the repository.

See `evidence/research.md` for source links, dates, observed facts, and the distinction between evidence and this package's proposed engineering solution.

## Affected users
- developers using AI coding agents on large repositories;
- Windows/WSL users;
- monorepo/pnpm/node_modules-heavy workspaces;
- platform builders implementing sandbox or repository initialization;
- teams running concurrent agents against the same checkout;
- developers seeing high CPU/disk usage or long gaps around otherwise fast tool calls.

## Existing approach
Typical current responses are manual:
- add generated directories to ignore/exclude;
- move workspaces into WSL's Linux filesystem;
- turn on Git untracked cache or FSMonitor;
- close concurrent tasks;
- change agent frontend/runtime;
- diagnose with Task Manager, Process Monitor, `strace`, or shell timing.

## Existing limitations
These approaches are useful but often reactive and incomplete. They do not provide a common pre-task budget, do not distinguish Git cost from hidden sandbox/runtime cost, may be applied after users already experience severe slowdown, and can tempt unsafe workarounds such as disabling sandboxing.

## Proposed improvement
Treat workspace scanning as a first-class, measurable performance budget.

The package provides:
1. bounded read-only scan measurement;
2. Git tracked-vs-untracked timing split;
3. WSL cross-filesystem risk detection;
4. deterministic absolute/regression budget enforcement;
5. evidence-driven diagnosis workflows;
6. safe mitigation ordering;
7. independent verification;
8. a platform-level cache/single-flight design path for duplicated runtime initialization.

## Architecture

```text
                 ┌──────────────────────┐
                 │ Agent task / startup │
                 └──────────┬───────────┘
                            │
                            v
                 ┌──────────────────────┐
                 │ Bounded measurement  │
                 │ Git + walk + WSL     │
                 └──────────┬───────────┘
                            │
                            v
                 ┌──────────────────────┐
                 │ Scan budget guard    │
                 │ absolute + baseline  │
                 └───────┬──────────────┘
                    pass │ fail
               ┌─────────┘   └─────────────┐
               v                           v
      ┌─────────────────┐        ┌───────────────────┐
      │ Normal agent run │        │ Bounded diagnosis │
      └─────────────────┘        └─────────┬─────────┘
                                           │
                                           v
                                ┌────────────────────┐
                                │ One safe mitigation │
                                └─────────┬──────────┘
                                          │
                                          v
                                ┌────────────────────┐
                                │ Re-measure + guard │
                                └─────────┬──────────┘
                                          │
                                          v
                                ┌────────────────────┐
                                │ Independent verify │
                                └────────────────────┘
```

## Package structure

```text
agent-workspace-scan-latency-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── scan-budget.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── git_scan_guard.py
│   └── measure_workspace_scan.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_git_scan_guard.py
├── verification/
│   └── verification-report.md
└── workflows/
    └── workflows.md
```

## Installation
No Python package installation is required.

Requirements:
- Python 3.10+;
- Git for Git probes;
- optional OS tracing tools for deeper attribution.

Copy the package to a tooling location or invoke its scripts by absolute path.

## Configuration
Edit `config/scan-budget.json`.

Default limits:
- Git status with untracked files: 2,000 ms;
- bounded workspace walk: 3,000 ms;
- maximum baseline regression: 50%;
- maximum entries per probe: 50,000;
- subprocess timeout: 10 seconds.

These defaults are examples for enforcement mechanics, not universal SLOs. Tune them from your own baseline.

Security defaults intentionally prohibit automatic sandbox disabling and require approval for global Git changes.

## Quick usage

### 1. Measure

```bash
mkdir -p .agent-metrics
python scripts/measure_workspace_scan.py . \
  --timeout 10 \
  --max-entries 50000 \
  --output .agent-metrics/baseline.json
```

### 2. Enforce

```bash
python scripts/git_scan_guard.py .agent-metrics/baseline.json \
  --policy config/scan-budget.json
```

### 3. Re-measure after a mitigation

```bash
python scripts/measure_workspace_scan.py . --output .agent-metrics/after.json
python scripts/git_scan_guard.py .agent-metrics/after.json \
  --policy config/scan-budget.json \
  --baseline .agent-metrics/baseline.json
```

### 4. Run functional tests

```bash
python tests/test_git_scan_guard.py
```

## Measurement model
The measurement script intentionally separates:

### Git status without untracked enumeration

```text
git --no-optional-locks status --porcelain=v1 -uno
```

### Git status with normal untracked discovery

```text
git --no-optional-locks status --porcelain=v1
```

A large timing difference strongly suggests untracked/generated path enumeration deserves investigation.

### Bounded/pruned filesystem walk
The script skips common heavy directories and stops at a maximum entry count. It is a diagnostic signal, not a full indexer.

### WSL path risk
A workspace under `/mnt/*` is surfaced as a warning. It is not automatically moved.

## Workflow
Use `workflows/workflows.md` for complete bounded procedures.

Core loop:

```text
Measure
→ Diagnose
→ Form one hypothesis
→ Apply one reversible mitigation
→ Measure again
→ Guard
→ Verify correctness/security
→ Accept or rollback
```

Maximum default mitigation attempts: three before returning to diagnosis.

## Safe mitigation hierarchy
1. Correct confirmed generated/untracked ignore/exclude patterns.
2. Evaluate Git untracked cache and FSMonitor.
3. Improve WSL filesystem placement when cross-filesystem overhead is supported by evidence.
4. Implement platform-level initialization cache/single-flight with explicit invalidation.
5. Escalate upstream runtime bugs with trace evidence.

The hierarchy explicitly excludes turning off sandboxing or security controls as an optimization strategy.

## Why not simply use `git status -uno`?
Git documents this as a fast option, but it hides untracked files. Coding agents frequently create new files, so permanently removing untracked visibility can break correctness. This package uses `-uno` primarily as a diagnostic comparison unless the workflow explicitly proves that untracked visibility is unnecessary.

## Why Git caches are not the whole solution
`core.untrackedCache` and `core.fsmonitor` can materially reduce Git status cost, but recent issue evidence also includes:
- repeated sandbox ACL/setup work;
- plugin/cache traversal;
- concurrent repeated initialization;
- cross-filesystem metadata access.

Therefore the package treats Git as one measurable surface, not the only cause.

## Platform-builder pattern: single-flight expensive initialization
When traces prove that several agents or tool calls perform the same expensive setup concurrently, a runtime can deduplicate it:

```text
key = workspace_identity
    + runtime_version
    + security_mode
    + config_fingerprint
    + relevant_manifest_fingerprint

first caller  ──> performs initialization
other callers ──> await same bounded result
```

Invalidation must be explicit. Never reuse security-sensitive initialization across incompatible permission/sandbox modes or unrelated tenants.

## Metrics
Recommended operational metrics:
- `workspace_scan_git_status_ms`
- `workspace_scan_walk_ms`
- `agent_tool_end_to_end_ms`
- `agent_tool_command_ms`
- `agent_hidden_overhead_ms`
- `workspace_scan_timeout_total`
- `workspace_scan_regression_total`
- cache hit/miss/single-flight waiters for runtime implementations.

Measure p50 and p95 on stable hardware when possible.

## Verification
See `verification/verification-report.md`.

The package distinguishes:

### Implemented
Scripts, policies, docs, tests, workflows, hooks, and rules exist.

### Measured
During generation, Python syntax was validated and a representative synthetic fast-workspace guard path returned exit 0/pass.

### Verified
The package-level mechanics were checked. No claim is made that a real target workspace improved until it is integrated, baseline-measured, mitigated, and re-measured.

## Safety
- probes are read-only;
- traversal is bounded;
- timeouts are treated as failures;
- sandbox/security controls are never disabled automatically;
- global Git changes require approval;
- moving a workspace requires approval;
- ignore/exclude changes must be verified for repository correctness;
- no destructive cache deletion is part of the default workflow.

## Failure handling
### Probe timeout
Stop the probe, record timeout, and diagnose with bounded top-level evidence.

### Mitigation has no effect
Rollback and test the next ranked hypothesis.

### Three hypotheses fail
Stop the optimization loop and re-diagnose rather than retrying indefinitely.

### Security/correctness regression
Reject the optimization even if latency improves.

### No stable baseline
Collect at most two additional comparable attempts, then explicitly report measurement uncertainty.

## Definition of Done
A real integration is done when:
- current problem evidence is documented;
- baseline exists;
- root cause is supported by measurements;
- existing approaches and limitations are documented;
- one scoped improvement is implemented;
- before/after metrics are comparable;
- guard passes;
- regression threshold is not weakened during the same change;
- required new/untracked files remain discoverable;
- security posture is preserved;
- rollback is documented;
- independent verification is complete;
- no blocking issue remains.

## Customization
### Monorepos
Use repository-specific thresholds and add known generated directory names to the measurement script/policy carefully.

### Windows native
Combine the guard with Process Monitor/Task Manager evidence when antivirus/WMI/sandbox setup contributes to hidden overhead.

### WSL
Measure Linux-native repository paths separately from `/mnt/*` cache/plugin/workspace paths.

### CI
Use stable self-hosted runners for absolute timing SLOs. On noisy shared runners, rely more on deterministic functional tests and trend distributions than a single absolute measurement.

### Agent platforms
Add instrumentation around the full tool lifecycle so command time and hidden pre/post-tool time can be compared directly.

## Research sources
Full source list and evidence interpretation are in `evidence/research.md`. Key sources include three open Codex performance issues from June–July 2026, current Git status performance documentation, and Microsoft WSL filesystem guidance.