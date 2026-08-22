# Agent Symlink Sandbox Path Integrity Guard

## Topic
`agent-symlink-sandbox-path-integrity-guard`

## Category
Security

## Problem
AI coding-agent runtimes may authorize a filesystem operation using a lexical workspace path while the operating system ultimately mutates a different canonical object through symlink, worktree, temporary-wrapper, or other path indirection. That mismatch can turn an apparently in-workspace operation into an outside-workspace or protected-runtime write.

This is a host/tool-boundary problem. Prompt instructions alone cannot reliably prevent it because the unsafe resolution may occur after the model has already chosen a path.

## Evidence
The package is grounded in current 2026 public signals documented in `evidence/research.md`:

- Anthropic GHSA-vp62-r36r-9xqp: symlink-following sandbox escape allowing writes outside workspace; patched in Claude Code 2.1.64.
- Anthropic GHSA-7835-87q9-rgvv: Git worktree/path confusion plus symlink manipulation allowing sandbox escape; patched in 2.1.163.
- OpenAI Codex issue #32026 (opened 2026-07-10): an agent-created temporary Git symlink was later overwritten through shell redirection, mutating a live managed runtime wrapper.
- Additional current Codex issues show ongoing complexity around canonicalization, symlinked filesystem permissions, TMPDIR, and sandbox bind behavior.

These signals support a recurring failure class: **authorization attached to path strings can diverge from the filesystem object actually mutated**.

## Existing approach
Common defenses include OS sandboxing, workspace allowlists, canonicalizing roots before sandbox setup, human confirmation for outside-root writes, and product-specific patches for individual symlink/worktree vulnerabilities.

## Existing limitations
- String-prefix allowlists do not prove object identity.
- One-time canonicalization does not close validation-to-use races.
- A sandboxed producer plus an unsandboxed host writer can compose into a write neither side should have been able to perform alone.
- Rejecting all symlinks can break legitimate development setups and does not solve other alias types.
- Guarding only one high-level file tool leaves bypass paths through patch, shell redirection, rename, temp-file replacement, or Git helpers.

## Proposed improvement
Use a reusable path-integrity protocol:

**Workspace admission → canonical-root policy → preflight → identity capture → commit-time revalidation → mutation → post-write containment check → audit**

For high-risk implementations, combine this with descriptor-relative/no-follow operating-system primitives to reduce the remaining race between commit-check and the final syscall.

## Architecture

```text
Agent / Planner
      |
      v
Mutation request
      |
      v
Pre-Mutation Hook
      |
      v
path_integrity_guard.py preflight
  - lexical path
  - canonical path
  - writable root
  - protected root
  - symlink chain
  - parent/target identity
      |
 allow? ---- no ----> stop / approval / incident
      |
     yes
      v
Prepare mutation safely
      |
      v
commit-check
  - identity drift?
  - canonical drift?
  - boundary still valid?
      |
 allow? ---- no ----> invalidate authorization
      |
     yes
      v
Filesystem mutation
      |
      v
Post-mutation containment / audit
```

A separate `scan_path_aliases.py` performs metadata-only workspace admission and flags escaping/protected-root symlinks plus Git `gitdir` indirection that requires review.

## Package structure

```text
agent-symlink-sandbox-path-integrity-guard/
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
│   ├── path_integrity_guard.py
│   └── scan_path_aliases.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_path_integrity_guard.py
├── verification/
│   └── verification-report.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.10+ and uses only the Python standard library.

Copy the package into the agent host repository or security-control repository. Keep the enforcement scripts on the host side rather than allowing an untrusted workspace to replace the guard that authorizes that same workspace.

## Configuration
Edit `config/policy.json`.

Key fields:
- `workspace_roots`: roots agents may mutate after canonical validation.
- `protected_roots`: runtime/config/credential locations agents may not mutate.
- `allow_symlinks_within_same_writable_root`: permits legitimate aliases only when canonical target stays in the same approved root.
- `allow_explicit_symlink_roots`: explicit trusted aliases for advanced setups.
- `reject_parent_identity_drift`: blocks TOCTOU parent swaps.
- `reject_target_identity_drift`: blocks target replacement between validation and commit.
- `max_symlink_depth`: bounds alias traversal analysis.

Treat the shipped policy as an example. Platform integrations must resolve real protected runtime/config locations.

## Usage

### Admit a workspace
```bash
python scripts/scan_path_aliases.py --root . --policy config/policy.json
```

### Preflight a mutation
```bash
python scripts/path_integrity_guard.py preflight \
  --path ./src/output.txt \
  --operation write \
  --policy config/policy.json \
  --record .guard/preflight.json
```

### Revalidate before commit
```bash
python scripts/path_integrity_guard.py commit-check \
  --record .guard/preflight.json \
  --policy config/policy.json
```

### Inspect after mutation
```bash
python scripts/path_integrity_guard.py inspect \
  --path ./src/output.txt \
  --policy config/policy.json
```

## Workflow
The full workflows are in `workflows/workflows.md`:
1. Workspace Admission.
2. Safe Filesystem Mutation.
3. Symlink/Worktree Security Regression.
4. Incident Containment and Recovery.

All loops are bounded. Identity drift permits at most one automatic re-preflight before escalation.

## Skills
`skills/core-skills.md` contains four executable skills:
- Path Trust Classification.
- Commit-Time Identity Revalidation.
- Repository and Worktree Alias Audit.
- Path-Incident Recovery.

Each skill defines triggers, inputs, procedures, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` defines observable **MUST / MUST NOT / SHOULD** controls. The most important invariant is:

> Authorization is based on canonical filesystem identity and must be revalidated immediately before mutation.

## Subagents
`subagents/subagents.md` separates Evidence Analyst, Security Architect, Guard Implementer, and Independent Verifier. The implementation agent must not be the sole verifier for security-sensitive changes.

## Hooks
`hooks/hooks.md` defines:
- pre-task workspace admission;
- pre-mutation path validation;
- commit-time revalidation;
- post-mutation containment check;
- final verification.

## Metrics
Track:
- guard checks/task;
- guard latency p50/p95;
- deny rate;
- symlink transitions;
- identity drift detections;
- protected-root attempts;
- scanner duration/findings;
- approved exceptions;
- outside-root successful writes (**target: zero**).

A deployed policy is **Implemented**. Security-fixture results are **Measured**. The integration is **Verified** only when adversarial tests pass in the actual supported runtime/filesystem combinations.

## Verification
Run:

```bash
python -m unittest tests/test_path_integrity_guard.py
```

The tests cover:
- ordinary in-root write;
- legitimate in-root symlink;
- relative symlink escape;
- absolute symlink escape;
- protected-root alias;
- broken symlink write;
- parent identity swap between preflight and commit;
- scanner detection of escaping alias;
- scanner acceptance of benign in-root alias.

See `verification/verification-report.md` for the exact status model and deployment gates. During this generation run, local execution could not clone the GitHub repository because the container could not resolve `github.com`; therefore no runtime test pass is falsely claimed.

## Safety
- Fail closed when identity cannot be established.
- Never weaken sandbox/protected-root policy merely to support a convenient symlink.
- Never execute suspected corrupted runtime wrappers during incident investigation.
- Do not let an untrusted repository modify the host-side guard or protected-root policy controlling that repository.
- Require explicit human approval before destructive incident cleanup or irreversible repair.
- Preserve evidence before restoring suspected runtime corruption.

## Failure handling
| Failure | Detection | Automatic retry | Fallback / escalation |
|---|---|---:|---|
| Outside-root canonical target | Preflight deny | 0 | Block operation |
| Protected-root target | Preflight deny | 0 | Security review |
| Parent/target drift | Commit-check deny | 1 new preflight | Stop after second drift |
| Alias scan incomplete | Scanner non-zero | 1 for transient I/O | Read-only/manual mode |
| Suspected runtime mutation | Integrity/audit signal | 0 destructive retries | Incident workflow + trusted restore |
| Regression test failure | Test assertion | 0 security retries | Block deployment |

## Definition of Done
Package generation is complete when:
- current evidence is documented;
- existing approaches and limitations are documented;
- path-boundary policy exists;
- actionable skills/rules/subagents/workflows/hooks exist;
- deterministic guard and scanner are implemented;
- adversarial regression tests exist;
- failure/recovery rules are bounded;
- verification status does not overclaim runtime results;
- GitHub manifest is verified and all referenced files exist.

A production integration is complete only when the target-runtime test and metric gates in `verification/verification-report.md` are satisfied.

## Customization
Common extensions:
- Windows junction/reparse-point identity checks;
- Linux `openat2(RESOLVE_BENEATH|RESOLVE_NO_SYMLINKS)` integration;
- descriptor-relative atomic writes;
- runtime package-manifest/hash verification;
- Git worktree-specific policy adapters;
- security event export to SIEM/observability systems;
- per-tool writable-root capabilities rather than one global workspace root.

Keep customizations deterministic and host-enforced. Model reasoning can decide *what it wants to do*; the path-integrity boundary decides *whether the requested filesystem object may actually be mutated*.
