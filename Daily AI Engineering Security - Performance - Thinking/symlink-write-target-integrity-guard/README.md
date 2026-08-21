# Symlink Write Target Integrity Guard

**Category:** Security  
**Run date:** 2026-08-20 (UTC+7)

## Problem
AI coding agents frequently combine sandboxed shell activity with more privileged host-side file APIs. A repository or sandboxed process can influence a pathname through symlinks, worktrees, or predictable temporary paths, then a later trusted component follows that path and reads/writes an object outside the intended workspace. This is a confused-deputy problem: authorizing the pathname is not the same as authorizing the final filesystem object.

## Evidence
See `evidence/research.md`. The package is grounded in 2026 Claude Code security advisories covering symlink-following sandbox escape, Git worktree path confusion, and predictable temporary-file symlink writes; a July 2026 OpenAI Codex issue involving write-through of an agent-created Git symlink into the live runtime; and a Claude Code plugin issue demonstrating external-file disclosure through a project-controlled symlink.

## Existing approach
Existing products use sandbox writable roots, canonical-path checks, selected symlink rejection, randomized temporary files, and feature-specific patches.

## Existing limitations
One-time path checks can become stale; parent-directory symlinks can bypass leaf-only checks; host-side APIs may follow links the sandbox itself could not access; blanket bans break legitimate symlink workflows; and predictable or replaceable destinations still create TOCTOU risk.

## Proposed improvement
Treat path identity as a security boundary. Before privileged operations:
- define approved roots and operation types,
- inspect existing path components without following them,
- resolve the final target and enforce component-aware containment,
- deny symlink traversal by default,
- allow only explicit in-root/read-only exceptions,
- use no-follow/descriptor-relative primitives or validate-then-activate identity checks for high-risk operations,
- isolate temporary files,
- independently test adversarial path layouts.

## Architecture
`skills/path-target-threat-model.md` maps path-control and privilege boundaries. `rules/path-integrity-rules.md` defines enforceable security invariants. `hooks/pre-file-operation.md` supplies the fail-closed integration point. `scripts/path_target_guard.py` provides deterministic preflight containment/symlink analysis. `tests/test_path_target_guard.py` exercises safe, outside-root, and explicit in-root symlink cases. `config/path-policy.example.json` shows bounded policy configuration. `subagents/path-boundary-verifier.md` independently verifies the finished change through the bounded workflow.

## Package tree
```text
README.md
evidence/research.md
config/path-policy.example.json
skills/path-target-threat-model.md
rules/path-integrity-rules.md
subagents/path-boundary-verifier.md
workflows/harden-and-verify.md
hooks/pre-file-operation.md
scripts/path_target_guard.py
tests/test_path_target_guard.py
```

## Installation
Requires Python 3.10+ and the standard library only. Copy the package into the repository containing the agent/runtime integration. The script is a policy preflight, not a substitute for secure OS-level open semantics.

## Configuration
Adapt `config/path-policy.example.json` to the host. Approved roots must be absolute and trusted. Default symlink policy should remain deny for privileged writes. Exceptions should declare requested prefix, final resolved root, operation set, and approval provenance.

## Usage
Preflight a write:

```bash
python3 scripts/path_target_guard.py \
  --root /srv/agent/workspace \
  --path /srv/agent/workspace/output.txt \
  --operation write
```

Allow an explicitly approved symlink only when its fully resolved target remains under the approved root:

```bash
python3 scripts/path_target_guard.py \
  --root /srv/agent/workspace \
  --path /srv/agent/workspace/shared/file.txt \
  --operation read \
  --allow-in-root-symlink
```

Run tests:

```bash
python3 -m unittest tests/test_path_target_guard.py
```

Exit 0 means the preflight policy allows the target, 2 is invalid input/runtime failure, and 3 is a security block.

## Workflow
Follow `workflows/harden-and-verify.md`: observe an inert exploit fixture → baseline safe/malicious behavior → threat-model trust boundaries → form one path-identity hypothesis → implement the smallest secure primitive → rerun the fixture matrix → one bounded remediation retry if needed → independent verification.

## Metrics
Track malicious fixtures blocked, legitimate fixtures allowed, privileged operations covered, false positives, unguarded path operations remaining, and regression-test pass rate. Do not claim success solely because a single PoC is blocked.

## Verification
1. Baseline the current implementation with safe and malicious fixtures.
2. Test symlinked leaf, symlinked parent, nested link, outside-root target, and approved in-root link.
3. Test predictable temp/rename flows where applicable.
4. Confirm no negative fixture touches an external target.
5. Review high-risk operations for no-follow/descriptor-relative or equivalent identity recheck.
6. Have `subagents/path-boundary-verifier.md` return PASS.

## Safety
Never use real secrets or executable user configuration as attack targets; use inert marker files in temporary directories. Never dereference a suspicious external target merely to inspect its contents. Never weaken sandbox or workspace permissions to satisfy compatibility. Writes outside approved roots require explicit human approval.

## Failure handling
Detection is any outside-root resolution, forbidden symlink component, target drift, or negative fixture touching an unauthorized target. Retry metadata collection once for transient filesystem changes. Remediation is bounded to two cycles. If secure primitives are unavailable, fail closed for the affected high-risk operation and escalate instead of adding a blanket exception.

## Implemented / Measured / Verified
- **Implemented:** the policy gate and secure target-opening/activation strategy are integrated at the privileged boundary.
- **Measured:** baseline and post-change fixture results exist, including compatibility cases.
- **Verified:** all malicious fixtures are blocked, legitimate approved cases pass, unauthorized targets are untouched, and an independent verifier approves the TOCTOU strategy.

## Definition of Done
Evidence documented; trust boundaries mapped; approved roots explicit; baseline captured; target-integrity gate integrated; secure open/activation strategy documented and implemented for high-risk paths; tests pass; no attack fixture escapes approved roots; no secrets exposed; dangerous exceptions require approval; independent verification passes; residual platform limitations are recorded.

## Customization
For Linux/Unix high-risk operations, prefer descriptor-relative APIs and no-follow flags in the host language rather than relying only on this Python preflight. On Windows, account for junctions/reparse points with platform-native handle semantics. Preserve the same core invariant: authorization must bind to the final filesystem object, not merely the original path string.
