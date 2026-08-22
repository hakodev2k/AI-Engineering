# Agent Worktree Context Integrity Guard

## Topic

Prevent AI coding agents from mutating the wrong Git repository, worktree, branch, or patch destination when UI/session state drifts from actual Git state.

## Category

**Security** — repository write protection and agent execution-context integrity.

## Problem

Managed worktrees are increasingly used to isolate parallel AI coding tasks. The isolation boundary can fail operationally when an agent session, desktop UI, resumed thread, or fork workflow remembers a branch/worktree context that differs from the actual cwd and Git state. A coding agent can then write files, commit, transplant a patch, or push from a context the user did not intend.

This package treats repository context as a security contract rather than an informational UI label.

## Evidence

[`evidence/research.md`](evidence/research.md) documents current public signals. The strongest recent evidence includes:

- OpenAI Codex issue #37591 (2026-08-08): task terminal and app branch controls can resolve different worktree contexts after resume/reconnect;
- Anthropic Claude Code issue #85114 (2026-08-08): desktop branch/worktree presentation can remain stale after mid-session context changes, with Git evidence of worktree/branch divergence;
- OpenAI Codex issue #33808 (2026-07-17): a fork/new-worktree flow can choose a stale destination base and attempt to transplant a source diff onto an incompatible tree;
- official Git documentation provides stable script-oriented worktree and status porcelain interfaces suitable for authoritative checks.

The evidence file separates observed reports, interpretation, and this package's proposed mitigation.

## Existing approach

Current workflows commonly rely on managed worktrees, UI branch indicators, task/session metadata, `pwd`, `git branch --show-current`, manual restarts, or Git's built-in worktree refusal rules. These help but do not create a fresh, machine-enforced binding between the specific agent task and the repository context immediately before mutation.

## Existing limitations

- UI/session state may be stale after resume, reconnect, branch switching, or worktree transitions.
- Branch names are not repository identities.
- Worktree directory names are not reliable branch identities.
- Detached HEAD requires an OID-based expectation.
- Pre-commit checks are too late to protect earlier file writes or patch application.
- Applying a patch first and using conflict handling as discovery can partially mutate an incompatible destination.
- Prompt-only instructions depend on model compliance and remembered context.

## Proposed improvement

Create a host-visible **worktree context contract** from Git itself and require a deterministic PASS before each mutation boundary.

The binding contains:

```text
canonical repo top
+ canonical worktree path
+ canonical Git common directory
+ HEAD OID
+ branch or detached state
+ optional upstream/base
+ operation class
+ capture timestamp / policy version
```

The contract is never silently updated to match unexpected state. Resume/reconnect invalidates cached trust until revalidation. Patch/fork flows additionally bind destination HEAD to the expected patch base before bytes are applied.

## Architecture

```text
Task intent
  -> Context Inspector
       -> Git authoritative state
       -> context contract
  -> pre-mutation gate
       -> repo identity match?
       -> worktree match?
       -> branch/detached match?
       -> operation-specific checks?
          -> PASS -> mutation
          -> BLOCK -> bounded recovery
  -> independent verification for high risk
```

### Authoritative probe

[`scripts/worktree_context_guard.py`](scripts/worktree_context_guard.py) uses read-only Git commands to resolve actual state. It does not modify repositories.

### Policy

[`config/context-policy.json`](config/context-policy.json) controls allowed operations, matching requirements, patch safeguards, approval classes, TTL, and recovery retry count.

### Recovery boundary

A mismatch freezes writes. Recovery inventories actual worktrees, classifies the drift, performs at most one authorized non-destructive correction, then recaptures and rechecks. It never uses destructive reset/clean merely to make the gate pass.

### Patch provenance boundary

Patch application requires an explicit destination context. With the default policy, destination HEAD must equal the contract's expected base and the destination must be clean before application.

## Package structure

```text
agent-worktree-context-integrity-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── context-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── context-contract.example.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── worktree_context_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_worktree_context_guard.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation

Requirements:

- Python 3.10+
- Git available on `PATH`

Copy the package into the repository or, preferably, the orchestration layer that controls agent file/tool actions. The guard uses only Python's standard library.

## Configuration

Default policy highlights:

- exact worktree-path match required;
- Git common-directory match required;
- exact branch match when declared;
- detached HEAD allowed only when the contract expects it unless policy is tightened;
- patch application requires matching HEAD OID and a clean destination;
- `push` and `branch-mutate` are marked for external human approval;
- one context recovery/revalidation retry maximum;
- 30-second host-side validation TTL.

Edit [`config/context-policy.json`](config/context-policy.json) to fit local branch/upstream policy. Do not disable repository/worktree identity checks simply to reduce friction.

## Usage

### Capture the intended context

```bash
python scripts/worktree_context_guard.py capture \
  --cwd . \
  --operation write \
  --out .agent-context.json
```

If a branch is explicitly intended:

```bash
python scripts/worktree_context_guard.py capture \
  --cwd . \
  --operation write \
  --expected-branch feature/payment-timeout \
  --out .agent-context.json
```

### Gate a write

```bash
python scripts/worktree_context_guard.py check \
  --cwd . \
  --contract .agent-context.json \
  --policy config/context-policy.json \
  --operation write
```

Exit codes:

- `0` — context passes;
- `2` — policy/context mismatch; mutation must be blocked;
- `3` — invalid input;
- `4` — Git/I/O failure; fail closed.

### Gate patch application

```bash
python scripts/worktree_context_guard.py check \
  --cwd . \
  --contract .agent-context.json \
  --policy config/context-policy.json \
  --operation patch-apply
```

The default policy blocks changed destination HEAD and dirty destination state.

## Workflow

Primary flow from [`workflows/workflows.md`](workflows/workflows.md):

**Intent → Capture Git facts → Bind contract → Pre-mutation check → Execute → Revalidate after context change → Independent verify**

Failure flow:

**Mismatch → Freeze writes → Inventory worktrees → Classify → One safe recovery attempt or human selection → Recapture → Verify**

Patch flow:

**Record source base → Select explicit strategy → Capture destination → Prove compatibility → Apply once → Verify diff/context**

Every recovery loop is bounded.

## Skills

[`skills/core-skills.md`](skills/core-skills.md) provides complete procedures for:

- repository-context contract capture;
- pre-mutation gating;
- resume/handoff rebinding;
- patch/base provenance verification.

Each includes trigger, inputs, preconditions, decisions, constraints, outputs, metrics, verification, failure handling, and stop conditions.

## Rules

[`rules/engineering-rules.md`](rules/engineering-rules.md) defines enforceable **MUST / MUST NOT / SHOULD** controls. Core invariants are:

- Git is authoritative; UI/model memory is not;
- context must be checked before mutation, not merely before commit;
- unexpected state never silently rewrites the contract;
- unknown patch-base compatibility blocks before application;
- destructive recovery is not an automatic fallback;
- model prose cannot override a gate or substitute for required human approval.

## Subagents

[`subagents/subagents.md`](subagents/subagents.md) separates duties among:

- Context Inspector;
- Implementation Agent;
- Patch Provenance Reviewer;
- Independent Context Verifier;
- Recovery Coordinator.

High-risk context verification is not delegated solely to the implementing agent.

## Hooks

[`hooks/hooks.md`](hooks/hooks.md) defines integration points for:

- task start/resume;
- pre-file-write;
- pre-patch-apply;
- pre-commit;
- pre-push/branch mutation;
- post-context-changing Git commands;
- final verification.

Only a successful deterministic gate should unlock the associated mutation.

## Metrics

Track at minimum:

- context checks per mutation;
- mutations without fresh gate — target `0`;
- context blocks by reason;
- resume/reconnect context mismatch rate;
- wrong-context mutation incidents — target `0`;
- patch-base mismatch blocks;
- partial patch incidents — target `0`;
- silent auto-rebinds — target `0`;
- false-block investigation rate.

Do not claim production improvement until these metrics are baselined and measured after integration.

## Verification

Run:

```bash
python -m unittest tests/test_worktree_context_guard.py
```

The included suite covers:

- capture/check in a real temporary Git repository;
- wrong worktree path;
- wrong branch;
- wrong Git common directory/repository identity;
- stale patch destination HEAD;
- dirty patch destination.

See [`verification/report.md`](verification/report.md) for Implemented / Measured / Verified distinctions and rollout checks.

## Safety

- The guard is read-only and executes no repository mutation.
- It records identifiers/OIDs rather than repository file contents.
- It requires host enforcement; it does not grant permissions itself.
- Push and branch mutation can require external human approval.
- Failed checks do not trigger reset, clean, force checkout, worktree deletion, or repeated patch application.
- Dirty source checkouts are preserved during recovery.
- Git/I/O errors fail closed.

Remote URLs are intentionally not required in contracts to avoid accidental credential exposure.

## Failure handling

For any context failure:

1. block mutation;
2. preserve current worktree/index;
3. log deterministic actual/expected identifiers;
4. enumerate Git worktrees read-only;
5. classify the mismatch;
6. perform at most one authorized non-destructive correction if unambiguous;
7. otherwise require explicit human selection;
8. recapture and verify;
9. stop rather than weakening the gate.

For partial patch application, do not repeat fallback attempts. Quarantine the destination and recreate a clean destination only through an explicit recovery decision.

## Definition of Done

The integration is complete only when:

- research/evidence is documented;
- every task receives a repository-context contract before mutation;
- every file-write/patch/commit/push/branch-mutation path is gated;
- resume/reconnect/context-switch events invalidate cached trust;
- wrong repository/worktree/branch/detached vectors are blocked;
- stale/dirty patch destinations are blocked before application;
- tests pass in the target environment;
- dangerous-operation approvals remain outside model control;
- production metrics are collected;
- no known mutation path bypasses the guard.

## Customization

Possible extensions include:

- signed task contracts;
- repository IDs derived from trusted remote/repository metadata without storing credential-bearing URLs;
- sparse-checkout expectations;
- allowed subdirectory scopes;
- branch-prefix policies;
- upstream/ahead-behind constraints;
- commit-signing identity checks;
- CI enforcement before merge/push;
- host-native worktree session IDs.

Preserve the core rule: **the task's approved repository context must be proven from fresh Git facts before mutation.**