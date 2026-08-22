# Git Mutation Target Integrity Gate

**Category:** Security

## Problem
Repository agents can execute a syntactically valid mutation whose effective destination differs from user intent because of Git upstream/refspec state or filesystem/worktree path resolution. Current public reports include a feature-branch push landing on `master` and a managed-worktree archive correlated with deletion from the main checkout.

## Evidence
See `evidence/research.md`. The package separates observed public evidence from interpretation and the proposed control.

## Existing approach and limitation
Branch protection, approvals, Git worktree metadata, and careful command construction help, but they do not guarantee that the object authorized before execution is the same object actually targeted. Human approval is also insufficient when the approval view omits resolved branch/path identity.

## Proposed improvement
Put an independent fail-closed integrity gate directly before the side effect. Resolve the actual remote branch or canonical cleanup path, compare it with policy, and verify the same target after execution.

## Architecture
- `skills/mutation-target-verification.md` — reusable evidence-driven verification procedure.
- `rules/repository-mutation-boundaries.md` — enforceable mutation policy.
- `subagents/security-verifier.md` — independent verifier that never performs the write.
- `workflows/preflight-execute-verify.md` — bounded execution lifecycle.
- `hooks/pre-mutation-gate.md` — deterministic blocking hook.
- `scripts/git_mutation_guard.py` — standard-library policy checker.
- `tests/test_git_mutation_guard.py` — regression tests.
- `evidence/research.md` — current public evidence and root-cause analysis.

## Package tree
```text
git-mutation-target-integrity-gate/
├── README.md
├── evidence/research.md
├── hooks/pre-mutation-gate.md
├── rules/repository-mutation-boundaries.md
├── scripts/git_mutation_guard.py
├── skills/mutation-target-verification.md
├── subagents/security-verifier.md
├── tests/test_git_mutation_guard.py
└── workflows/preflight-execute-verify.md
```

## Installation
Python 3.9+ only; no third-party dependencies. Copy the package into the agent policy/workflow repository and invoke the hook before consequential Git/filesystem mutations.

## Usage
Create a JSON facts file and run:

```bash
python scripts/git_mutation_guard.py --input facts.json
```

Feature push example:
```json
{"operation":"push","default_branch":"main","remote_branch":"feature/a","approved_default_branch":false}
```

Cleanup example:
```json
{"operation":"cleanup","candidate_path":"/tmp/codex/worktrees/abc/repo","allowed_roots":["/tmp/codex/worktrees/abc"]}
```

Exit codes: `0` ALLOW, `1` invalid/incomplete evidence, `2` policy BLOCK.

## Workflow
Observe → resolve effective target → run guard → obtain exact approval when required → execute once → re-read state → independent verification. Preflight recomputation is bounded to one retry.

## Metrics
Track mutation-gate coverage, unsafe target blocks, unresolved targets, post-action mismatches, false positives, and security regression test pass rate.

## Verification
Run:

```bash
python -m unittest tests/test_git_mutation_guard.py
```

For real integrations, test at least: feature push allowed; default push blocked; force-push default blocked; canonical contained cleanup allowed; root escape blocked; unresolved target blocked; post-action target matches preflight target.

## Safety
The bundled script never performs Git or filesystem mutations. It only evaluates already-resolved facts. Production integrations should derive those facts with read-only Git/filesystem inspection and keep destructive commands behind the gate.

## Failure handling
**Detection:** nonzero guard exit, target mismatch, path escape, or protected-branch resolution. **Evidence:** preserve facts JSON and read-only before/after state. **Retry:** one target recomputation only. **Fallback:** stop mutation. **Escalation:** exact-target human review. **Stop:** do not weaken policy to make the operation pass.

## Implemented / Measured / Verified
- **Implemented:** reusable rules, workflow, hook, deterministic script, tests.
- **Measured:** package defines target-mismatch and block-rate metrics; real environment measurements are produced by integrating the guard with runtime preflight facts.
- **Verified:** package structure and deterministic test cases provide verification mechanics; a production mutation is Verified only after post-action state is independently checked.

## Definition of Done
Evidence documented; effective target resolved; guard returns ALLOW; approval binds to exact protected target when required; mutation occurs once; post-action state matches the allowed target; no protected branch/path changes unexpectedly; independent verifier returns VERIFIED.

## Customization
Extend the operation policy for branch deletion, tag push, deployment refs, multiple managed roots, or organization-specific protected branches without changing the fail-closed rule for unresolved targets.