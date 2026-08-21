# Multi-Agent Worktree Write Isolation Guard

## Topic
Reliable parallel coding-agent delegation through explicit worktree identity, mutable-path ownership, pre-write assertions, bounded conflict recovery, and independent handoff verification.

## Category
**Thinking** — improves planning, delegation, execution, stop conditions, failure recovery, and verification for multi-agent coding workflows.

## Problem
Parallel coding agents often receive logically separate tasks while still operating on shared mutable repository state. If two workers share a checkout, or if a child agent drifts to a different branch/worktree than the parent intended, the resulting work can be internally plausible but produced against the wrong state. Typical consequences include stale reads, overwrites, tests against mixed state, repeated edit retries, wrong-branch changes, and expensive integration rework.

## Evidence
Recent public reports support the problem:
- Codex issue #37226 (2026-08-06) asks for automatic isolation/coordination because multiple chats/agents can concurrently mutate one checkout.
- Codex issue #31572 reports parent/subagent branch drift and requests hard blocking before writes.
- Codex issue #18969 argues that prompt-only cwd instructions are not a reliable tool-execution boundary.
- Claude Code issue #46968 reports a worker consuming roughly 101k tokens while repeatedly retrying edits after concurrent modification.
- OpenAI's current model guidance exposes multi-agent as a beta capability for parallelizable workstreams, increasing the practical importance of safe delegation boundaries.

Full research and source links are in `evidence/research.md`.

## Existing approach
Common workflows use prompt instructions, informal file ownership, shared checkouts, manually created worktrees, and post-hoc merge conflict resolution.

## Existing limitations
These approaches fail too late or rely on probabilistic model compliance. A prompt cannot prove current cwd/branch. Shared checkout conflicts can occur between read and write. Post-hoc conflict handling may discover that tests already ran against invalid state. Repeated retries can waste large token/tool budgets without resolving the orchestration fault.

## Proposed improvement
Treat mutable workspace identity as part of the delegation contract and enforce it outside model reasoning:

```text
Task decomposition
  -> exclusive mutable-path ownership
  -> dedicated worktree + branch
  -> deterministic preflight
  -> pre-write workspace/path gate
  -> bounded conflict handling
  -> structured git-backed handoff
  -> independent verification
  -> serial integration of shared state
```

The key invariant is: **a write is allowed only when the worker is in the exact workspace promised by its manifest and every target path belongs to that worker.**

## Architecture
### Control plane
- Orchestration Planner creates manifests and resolves ownership overlap.
- Workspace Provisioner creates/binds isolated worktrees.
- Active manifests serve as path leases.

### Execution plane
- Implementation Worker operates only in its assigned worktree.
- `worktree_guard.py` validates workspace identity and write targets before mutation.
- Concurrent-modification errors are bounded and escalated rather than retried indefinitely.

### Verification plane
- Worker generates a machine-checkable handoff.
- `verify_handoff.py` independently recomputes head SHA, branch, ancestry, and changed paths.
- Integration Agent accepts only verified handoffs and owns intentionally shared integration files.

## Package structure
```text
multi-agent-worktree-write-isolation-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── task-manifest.json
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
│   ├── worktree_guard.py
│   └── verify_handoff.py
├── tests/
│   └── test_guard.py
└── verification/
    └── report.md
```

## Installation
Requirements:
- Python 3.10+ recommended;
- Git available on PATH;
- repository must support git worktrees;
- orchestration layer capable of invoking pre-spawn/pre-write/pre-merge checks.

No external Python package is required.

Copy this package into the orchestration repository or call the scripts by absolute path.

## Configuration
`config/policy.json` defines the intended enforcement defaults:
- dedicated worktree/branch required for write workers;
- prompt-only cwd binding rejected as a sufficient control;
- exclusive path-prefix ownership;
- expected repo/branch/base ancestry required;
- one retry for concurrent modification;
- independent verifier required before merge.

The Python guards encode the critical fail-closed invariants directly. If your harness loads policy dynamically, preserve or strengthen these defaults.

## Usage
### 1. Plan ownership
Create one task manifest per write worker based on `examples/task-manifest.json`.

### 2. Validate active manifests
```bash
python scripts/worktree_guard.py manifest \
  --manifest manifests/api.json \
  --active-dir manifests
```

### 3. Provision and verify worktree
```bash
git worktree add ../project-wt-api -b agent/feature-api <base-sha>
python scripts/worktree_guard.py preflight --manifest manifests/api.json
```

### 4. Gate mutation
```bash
python scripts/worktree_guard.py write \
  --manifest manifests/api.json \
  --path src/Api/AuthController.cs
```

A non-zero exit blocks the mutation.

### 5. Run tests and build handoff
```bash
python scripts/verify_handoff.py build \
  --manifest manifests/api.json \
  --test-results artifacts/tests.json \
  --output handoffs/api.json
```

### 6. Independently verify
```bash
python scripts/verify_handoff.py verify \
  --manifest manifests/api.json \
  --handoff handoffs/api.json \
  --verifier verifier-1
```

Only verified handoffs proceed to integration.

## Workflow
Detailed workflows are in `workflows/workflows.md`:
1. Parallel Work Planning.
2. Guarded Implementation.
3. Handoff Verification and Integration.
4. Drift Recovery.

Every loop is bounded. Repeated workspace/conflict failures become orchestration blockers rather than infinite retry loops.

## Metrics
Establish a shared-checkout baseline before claiming improvement. Track:
- number of wrong-branch/worktree write attempts blocked;
- ownership overlaps detected before spawn;
- unowned path writes blocked;
- stale/concurrent edit retry count;
- worker token/tool calls spent on failed retries;
- merge conflicts caused by parallel workers;
- handoffs rejected as stale or cross-owned;
- wall-clock time and integration rework.

Success should preserve or improve correctness while reducing conflict/retry waste.

## Verification
`tests/test_guard.py` includes deterministic regression scenarios for:
- valid manifests;
- owned write acceptance;
- unowned write blocking;
- branch drift blocking;
- active ownership overlap blocking;
- unowned diff rejection;
- independent verifier requirement.

Run:
```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```

See `verification/report.md` for the distinction between **Implemented**, **Measured**, and **Verified**. This generated package does not claim production improvement metrics until tested in the target harness.

## Safety
- No automatic destructive git cleanup.
- Wrong workspace/branch fails closed before mutation.
- Unowned paths fail closed.
- Shared mutable state is serialized under an integrator.
- Implementation workers cannot self-verify.
- Base ancestry is checked before accepting handoffs.
- Shell/tool restrictions and OS-level sandboxing should still be used where agents are not fully trusted.

## Failure handling
### Ownership collision
Repartition work or make the contested file an integration-stage responsibility.

### Branch/worktree drift
Stop writes, capture git evidence, repair/recreate the worktree, then rerun preflight.

### Concurrent modification
Allow one re-read/retry if invariants still pass; a second occurrence stops the worker and escalates.

### Stale handoff
Reject and rebuild from the worker's current verified head.

### Unowned diff
Reject the handoff; do not broaden ownership retrospectively merely to make verification pass.

### Integration conflict
Resolve serially with an Integration Agent, rerun final tests, and preserve evidence of the chosen resolution.

## Definition of Done
An adoption is complete only when:
- active write manifests have no unintended overlap;
- every write worker runs in a dedicated branch/worktree;
- workspace identity is checked before mutation;
- path ownership is enforced outside the model;
- conflict retry is bounded;
- every worker produces a structured handoff;
- independent verification recomputes git evidence;
- synthetic drift and overlap tests are blocked;
- package tests pass in the target environment;
- integration tests pass on the final merged candidate;
- no blocking ownership or provenance issue remains.

## Customization
Path-prefix ownership is intentionally conservative. Monorepos may generate ownership from project graphs, CODEOWNERS-like metadata, build graphs, or task dependency maps. Keep the final mutation decision deterministic.

For patch-only parallel reviewers, dedicated write worktrees may be unnecessary if workers truly cannot mutate; enforce read-only permissions rather than relying on instruction text. For generated lock/snapshot files, assign a single integration owner.

## Evidence / reasoning boundary
This package does not expose or require hidden chain-of-thought. Better reasoning is achieved through explicit decomposition, ownership contracts, observable facts, bounded recovery, independent verification, and measurable outputs.