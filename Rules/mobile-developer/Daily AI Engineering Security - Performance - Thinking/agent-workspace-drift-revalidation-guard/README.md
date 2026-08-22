# Agent Workspace Drift Revalidation Guard

## Topic

A reusable guard for coding agents that prevents stale plans, stale file snapshots, stale branch/HEAD assumptions, and stale verification evidence from being reused after the workspace changes.

## Category

**Thinking** — engineering reasoning/execution reliability through explicit state capture, invalidation, revalidation, bounded recovery, and evidence freshness checks.

## Problem

Long-running, paused, resumable, or externally-modified agent sessions can continue from an earlier workspace state. The model may still hold old file content, branch identity, assumptions, or test results even though the repository has changed. That can produce failed patches, lost edits, wrong-branch work, incorrect conclusions, and completion claims backed by outdated verification.

## Evidence

Current public signals are documented in `evidence/research.md`. The package is grounded in 2026 reports from OpenAI Codex and Anthropic Claude Code covering stale workspace plans/context, overwriting newer file state, and stale-write behavior. The strongest recent signal is OpenAI Codex issue #36717, opened in August 2026, requesting explicit workspace-drift detection before continuing a stale plan.

## Existing approach

Common safeguards include Git worktrees, file-level modified-since-read checks, manual rereads, Git status inspection, and full repository rescans.

## Existing limitations

These approaches are useful but incomplete. Worktrees do not prove that a paused plan is still current; single-file edit guards do not cover cross-file assumptions or test evidence; Git status is not a version proof; full rescans add latency/tool/token overhead; and stale warnings may be advisory rather than enforced.

## Proposed improvement

The package introduces a **Trusted Workspace State (TWS)** protocol:

1. Capture a versioned snapshot at plan/checkpoint time.
2. Bind assumptions and verification evidence to files/state they depend on.
3. Check drift before resume, protected mutation, evidence reuse, and completion.
4. Classify drift as `none`, `non-impacting`, `revalidation-required`, or `hard-stop`.
5. Revalidate only affected dependencies.
6. Capture a new snapshot after successful repair.
7. Keep automatic recovery bounded and require escalation on unstable/semantic conflicts.

## Architecture

```text
Plan / observed workspace
        |
        v
Trusted Workspace Snapshot
(branch + HEAD + status digest + selected file hashes)
        |
        v
Pre-resume / pre-write / pre-evidence / final hooks
        |
        v
workspace_guard.py check
        |
  +-----+-------------------+
  |                         |
none/non-impacting   revalidation-required / hard-stop
  |                         |
execute                  invalidate dependencies
                            |
                            v
                     reread + repair plan
                     rerun stale evidence
                            |
                            v
                       new snapshot
```

## Package structure

```text
agent-workspace-drift-revalidation-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── assumption-registry.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── drift_benchmark.py
│   └── workspace_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_workspace_guard.py
├── verification/
│   └── verification.md
└── workflows/
    └── workflows.md
```

## Installation

Requires Python 3.9+ and Git when Git identity checks are desired. No third-party Python package is required.

Copy this package into the agent repository/harness or call the scripts from their retained path. Ensure the orchestrator can persist the configured `.agent-state` snapshot directory.

## Configuration

Edit `config/policy.json` to tune branch/HEAD behavior, file hashing limits, retry limits, and evidence TTL.

Safe defaults include:

- branch change → hard-stop;
- HEAD change → scoped revalidation;
- missing tracked file → hard-stop;
- tracked file hash change → revalidation;
- maximum automatic revalidation attempts → 2.

## Usage

Capture a plan snapshot:

```bash
python scripts/workspace_guard.py capture \
  --root . \
  --snapshot .agent-state/plan.json \
  --files src/Auth/AuthHandler.cs src/Auth/AuthOptions.cs src/App/App.csproj
```

Check it before mutation/resume/completion:

```bash
python scripts/workspace_guard.py check \
  --root . \
  --snapshot .agent-state/plan.json \
  --policy config/policy.json
```

Exit codes:

- `0`: safe according to current policy;
- `10`: scoped revalidation required;
- `20`: hard-stop;
- `30`: guard/configuration failure.

Full integration details are in `guide-intergration.md`.

## Workflow

The normal execution path is:

**Observe → Plan → Capture snapshot → Check → Execute → Check on resume/write → Detect drift → Invalidate affected assumptions → Reread affected context → Repair plan → Rerun invalidated verification → Capture fresh snapshot → Final freshness gate.**

All repair loops are bounded. The default maximum is two automatic revalidation attempts.

## Skills

`skills/core-skills.md` provides reusable procedures for:

- trusted-state capture;
- drift classification;
- scoped plan/evidence repair;
- freshness-gated completion.

Each skill includes trigger, inputs, procedure, constraints, metrics, verification, failure handling, and stop conditions.

## Rules

`rules/engineering-rules.md` defines enforceable **MUST / MUST NOT / SHOULD** requirements. Core invariants are that model memory is never treated as freshness proof, critical files use content hashes, stale evidence is not reused, and protected work fails closed when freshness cannot be established.

## Subagents

`subagents/subagents.md` separates four responsibilities:

- Workspace State Analyst;
- Planning/Revalidation Agent;
- Implementation Agent;
- Independent Verification Agent.

The implementing agent is not the sole verifier for high-impact drift repair.

## Hooks

`hooks/hooks.md` defines hooks for:

- pre-plan snapshot;
- pre-resume drift check;
- pre-write drift check;
- pre-evidence reuse;
- post-revalidation snapshot;
- final freshness gate.

Integrations should cover every mutation mechanism, including patches and shell-based writes, not only named editor tools.

## Scripts

### `scripts/workspace_guard.py`

A deterministic, read-only source-state guard. It captures/compares repository identity, branch, HEAD, status digest, and selected SHA-256 file hashes. It emits JSON and meaningful exit codes suitable for hooks and CI.

### `scripts/drift_benchmark.py`

Creates a temporary Git repository and exercises clean state, tracked-file drift, and branch drift. It returns nonzero if expected classifications are not observed.

## Tests

Run:

```bash
python -m unittest tests/test_workspace_guard.py -v
python scripts/drift_benchmark.py
```

Fixtures cover clean state, changed tracked content, branch drift, deleted critical files, and an attempted outside-root tracked path.

## Metrics

Recommended production metrics:

- drift checks by classification;
- stale writes blocked;
- resume drift detected;
- revalidation attempts and latency;
- changed files re-read / total tracked files;
- stale verification reuse blocked;
- drift-check latency;
- post-completion drift incidents.

Success targets include 100% detection of configured branch/HEAD and explicitly tracked-file drift, zero protected writes after `hard-stop`, and zero reuse of evidence whose declared dependencies changed.

## Verification

`verification/verification.md` distinguishes what is **Implemented**, what was **Static-verified**, and what requires runtime execution in an integration environment. The saved guard script was fetched back from GitHub and reviewed after write. Runtime tests are included; the automation shell could not clone GitHub because DNS resolution was unavailable, so the report does not falsely mark those runtime tests as executed.

## Safety

- The guard does not modify source files.
- Snapshots store hashes/metadata rather than source contents.
- Tracked paths resolving outside the workspace are rejected.
- No destructive Git command is used.
- Failure to prove freshness returns a blocking result rather than silently continuing.
- This package complements, rather than replaces, sandboxing, source control, permissions, worktree isolation, and human review.

## Failure handling

**Detection:** nonzero exit code and machine-readable drift/error output.  
**Evidence:** old snapshot, current drift report, changed paths, branch/HEAD state.  
**Retry policy:** at most two automatic scoped revalidation attempts.  
**Fallback:** stop protected writes and preserve evidence.  
**Escalation:** human/parent-agent decision on semantic conflict or unstable workspace.  
**Stop condition:** freshness established or bounded retries exhausted.

## Definition of Done

An integration is complete when:

- current public evidence and existing limitations are documented;
- plan dependencies are captured in trusted snapshots;
- all protected mutation paths execute the drift gate;
- branch/file drift tests produce required classifications;
- assumptions/evidence are invalidated by changed dependencies;
- revalidation loops are bounded;
- final freshness check runs after the last source mutation;
- required verification evidence is current;
- no blocking drift remains;
- the completion status accurately distinguishes Implemented, Measured, and Verified.

## Customization

Extend the assumption registry to model repository-specific dependencies such as database migrations, API schemas, generated clients, deployment manifests, feature flags, or test fixtures. Add policy rules for protected branches or stricter HEAD behavior. For very large repositories, select high-value dependencies during planning rather than weakening correctness with silent tracking truncation.
