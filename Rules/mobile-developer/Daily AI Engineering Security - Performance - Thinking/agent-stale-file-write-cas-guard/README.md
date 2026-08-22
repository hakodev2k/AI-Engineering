# Agent Stale-File Write CAS Guard

## Topic
A reusable guardrail for preventing AI coding agents from writing files based on stale snapshots after humans, other agents, IDEs, generators, or background processes have changed the same paths.

## Category
**Thinking** — execution reliability, evidence freshness, conflict handling, bounded recovery, and independent verification.

## Problem
AI agents frequently read files into model/tool context and plan edits from those bytes. The real filesystem can change before the write executes. If the host treats remembered content as current truth, an old proposal can overwrite newer work, produce save conflicts, or silently discard user/agent changes.

The core failure is not merely “concurrency exists.” It is the absence of a deterministic contract tying a proposal to the exact file version that informed it.

## Evidence
Recent public reports show this remains active in 2026:
- OpenAI Codex #37226 describes concurrent chats/agents sharing a local checkout, stale file contents, and newer changes being overwritten.
- OpenAI Codex #22384 requests invalidation/refresh when file content already in context becomes stale after edits.
- OpenAI Codex #34757 reports conflicts when users keep editing while Codex later writes its result.
- Anthropic Claude Code #73364 reports concurrent sessions clobbering shared state from stale in-memory snapshots.
- Anthropic Claude Code #27941 reports stale-write detection that logs telemetry but still allows overwrite.

See `evidence/research.md` for observed evidence, interpretation, limitations, root-cause hypotheses, and source links.

## Existing approach
Common controls include worktrees, manual file ownership, model instructions to re-read before writing, editor-specific “file changed since read” checks, file locking, and Git status/diff inspection.

## Existing limitations
These controls are useful but incomplete when used alone:
- worktrees do not cover same-worktree human edits or shared external/config state;
- re-read instructions leave a race between read and write and depend on model compliance;
- editor checks may not protect shell commands, generators, MCP tools, or internal writers;
- locks only protect cooperating writers and do not invalidate a semantic plan created from old evidence;
- Git status/diff is not an exact token proving the current bytes still equal the bytes the proposal used.

## Proposed improvement
Use a **content-hash compare-and-swap (CAS) contract** at the mutation boundary:

1. Read the target from the real filesystem.
2. Capture SHA-256/existence/size/mtime for every mutation-relevant path.
3. Build the proposed change from that snapshot.
4. Immediately before writing, recompute the current hash.
5. If any hash/existence changed, cancel the pending mutation and invalidate the proposal.
6. Re-read current content, reconcile compatible newer changes, rebuild the proposal, and retry within a bounded budget.
7. Independently re-read and verify final disk state after the write.

SHA-256 equality is authoritative; mtime is diagnostic only.

## Architecture

```text
Task intent
   |
   v
Fresh filesystem read
   |
   v
Snapshot (path + exists + sha256)
   |
   v
Plan / proposal
   |
   v
Pre-write CAS -------- stale --------> Invalidate proposal
   |                                      |
 fresh                                    v
   |                                Re-read current bytes
   v                                      |
Mutation                                  v
   |                                Reconcile + re-plan
   v                                      |
Disk re-read <-----------------------------+
   |
   v
Independent diff/test verification
   |
   v
Implemented / Measured / Verified
```

## Package structure

```text
agent-stale-file-write-cas-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── file_snapshot_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_file_snapshot_guard.py
├── verification/
│   └── definition-of-done.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.9+ and no third-party Python packages.

Copy the package into the agent host repository or reference it from a shared engineering package. Ensure the host can invoke Python and can store snapshot/report artifacts outside protected source files.

## Configuration
Edit `config/policy.json` only when the host has an explicit reason. Defaults:
- SHA-256 content versioning;
- pre-write and post-write verification required;
- mtime non-authoritative;
- maximum 2 reconciliation retries;
- stale committed writes target = 0;
- unrelated-line loss target = 0.

Do not increase retry counts to hide persistent contention.

## Usage

Capture a snapshot after task-relevant reads:

```bash
python scripts/file_snapshot_guard.py snapshot \
  --root /path/to/repo \
  --output .agent-artifacts/task-17.pre.json \
  src/app.py tests/test_app.py
```

Immediately before the actual mutation:

```bash
python scripts/file_snapshot_guard.py verify \
  --root /path/to/repo \
  --snapshot .agent-artifacts/task-17.pre.json \
  --report .agent-artifacts/task-17.cas.json
```

Exit codes:
- `0` fresh/pass;
- `2` stale snapshot/policy block;
- `3` invalid input;
- `4` I/O failure.

Exit 2 must cancel the pending write. Re-read and rebuild instead of retrying the same patch.

Run deterministic tests:

```bash
python -m unittest tests/test_file_snapshot_guard.py -v
```

## Workflow
Primary workflow:

**Observe → Snapshot → Plan → CAS → Execute → Re-read → Verify → Complete**

On stale detection:

**Invalidate → Re-observe → Classify → Re-plan → New snapshot → CAS**, with maximum retries from policy.

Full triggers, checkpoints, responsible agents, outputs, failure paths, retry policy, stop conditions, and Definition of Done are in `workflows/workflows.md`.

## Skills
`skills/core-skills.md` provides four executable procedures:
1. Capture Mutation Evidence Snapshot.
2. Pre-Write CAS Verification.
3. Stale Snapshot Reconciliation.
4. Independent Post-Write Verification.

Each defines inputs, preconditions, tools, decisions, constraints, expected output, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` contains observable **MUST / MUST NOT / SHOULD** controls. The critical rule is: a failed freshness check invalidates the mutation proposal and cannot be treated as warning-only.

## Delegation
`subagents/subagents.md` separates:
- Evidence & Concurrency Analyst;
- Implementation Agent;
- Verification Agent;
- Human Approval Boundary.

For high-risk writes, the implementing agent is not the sole verifier.

## Hooks
`hooks/hooks.md` defines:
- pre-task mutation scope;
- pre-write CAS gate;
- post-write disk re-read;
- retry-budget gate;
- final verification gate.

The most important integration property is placement: CAS belongs immediately before the real mutation, not only at planning time.

## Metrics
Track at minimum:
- guarded writes / total declared protected writes;
- pre-write revalidation coverage;
- post-write verification coverage;
- stale detections;
- reconciliation retries/task;
- snapshot-to-CAS age;
- CAS-pass-to-write interval;
- unexpected diff incidents;
- unrelated-line-loss incidents;
- committed stale writes.

Targets:
- committed stale writes = **0**;
- unrelated-line loss in regression fixtures = **0**;
- guarded write revalidation = **100%**;
- required post-write verification = **100%**.

## Verification
Distinguish three states:

### Implemented
The host has wired snapshot capture, final-boundary CAS blocking, bounded reconciliation, and post-write verification into every declared protected path.

### Measured
Coverage, stale frequency, retries, timing windows, and unexpected diffs are recorded.

### Verified
Regression tests prove modified/deleted/recreated/newly-created paths are blocked when stale, unchanged bytes pass even if metadata changes, protected write paths cannot proceed after CAS failure, concurrent edits are preserved, and required final verification succeeds.

Use `verification/definition-of-done.md` as the completion gate.

## Safety
- The included Python guard never mutates protected target files.
- Path resolution rejects targets outside the declared trusted root.
- The package never recommends discarding newer content merely because it conflicts with an old snapshot.
- Semantic conflicts require human approval when requirements do not prove the correct resolution.
- Retry loops are bounded.
- Security, verification, or context requirements must not be weakened to make a write succeed.

## Failure handling
- **Stale hash/existence:** cancel write, invalidate proposal, re-read and reconcile.
- **Invalid snapshot/path:** block mutation.
- **I/O failure:** allow at most one deterministic retry for transient artifact access, then block.
- **Repeated contention:** stop after policy maximum; isolate writers/worktrees or request human coordination.
- **Unexpected post-write diff:** do not claim completion; preserve evidence and re-enter bounded reconciliation or stop.

## Residual risk
CAS still has a small race window between verification and the actual write if a non-cooperating process modifies the file during that interval. Reduce it by placing verification directly at the mutation boundary, using narrow/atomic writes, integrating file locks where all writers cooperate, or isolating writers in worktrees/staging directories. Post-write verification is required because the guard does not claim this residual race is impossible.

## Definition of Done
The package is integrated only when:
- current public evidence and existing limitations are documented;
- every declared write boundary is guarded;
- stale proposals cannot execute;
- reconciliation is bounded;
- tests pass;
- coverage/latency/retry metrics are collected;
- high-risk writes have independent verification;
- unrelated current changes are preserved in regression scenarios;
- committed stale writes remain zero;
- risks and residual race window are documented;
- no blocking verification gap remains.

## Customization
Hosts may extend snapshot records with inode/file ID, Git blob ID, proposal ID, worktree ID, session ID, or lock metadata. Keep content hash authoritative unless the storage layer provides a stronger transactional version token. Add adapters for editor, shell, MCP, and generator write paths rather than creating separate inconsistent freshness policies.

For detailed host wiring, see `guide-intergration.md`.
