# Windows Future-Protected-Path Sandbox Guard

**Category:** Security

## Problem
A sandbox policy can declare metadata/control directories protected yet fail when those paths do not exist at policy-construction time. If the writable parent remains allowed, an agent can create `.git`, `.codex`, `.agents`, hooks, config, or other future control paths and poison behavior consumed later by a more trusted process.

## Evidence
Current 2026 Codex reports show both sides of the failure: missing protected directories can receive no deny rule, while materializing missing `.git` directories just to attach ACLs changes developer-tool behavior. See `evidence/research.md`.

## Existing approach and limitation
Path ACLs, workspace-write sandboxes, and protected-subpath lists are sound primitives. The weakness is representing protection only through an ACL attached to an already-existing filesystem object. A future path needs a policy invariant independent of object existence.

## Proposed improvement
Maintain a canonical protected-path contract and run a deterministic pre-tool check against the *requested resolved target*, including paths that do not yet exist. The sandbox backend remains the primary boundary; this package is an additional fail-closed enforcement and attestation layer.

## Package tree
```text
README.md
evidence/research.md
config/protected-paths.json
rules/sandbox-policy.md
skills/effective-sandbox-preflight.md
subagents/security-verifier.md
workflows/protect-and-verify.md
hooks/pre-tool-protected-path.md
scripts/protected_path_guard.py
tests/test_protected_path_guard.py
```

## Installation
Python 3.10+ only; no third-party packages. Copy the directory into the agent host and edit `config/protected-paths.json` for the workspace.

## Usage
```bash
python scripts/protected_path_guard.py --policy config/protected-paths.json --workspace . --target .git/hooks/pre-commit --operation write
```
Exit `0` = allowed, `4` = blocked by protected-path policy, `2` = invalid configuration/input.

## Workflow
1. Capture configured sandbox policy and protected control paths.
2. Normalize workspace and requested target without requiring target existence.
3. Compare target against protected relative paths and descendants.
4. Block writes/creates/deletes before tool execution.
5. Independently verify with negative and positive fixtures.
6. Keep the platform sandbox enabled; do not downgrade permissions to make tests pass.

## Metrics
- Protected-path bypass fixtures blocked: 100%.
- False blocks on allowed workspace fixtures: 0%.
- Missing-path coverage: every configured protected path tested while absent and present.
- No security regression: native sandbox/ACL remains enabled.

## Verification status
**Implemented:** deterministic guard, policy, hook contract, tests, workflow.

**Measured:** test fixtures measure deny/allow decisions including nonexistent targets.

**Verified:** complete only after tests pass in the target host and native sandbox behavior is independently checked.

## Safety
The guard never creates directories, mutates ACLs, deletes files, or disables sandboxing. Human approval cannot override an explicit protected-path deny unless the local policy itself is deliberately changed outside the agent run.

## Failure handling
Invalid policy or unresolved workspace boundary fails closed. Retry at most once after refreshing policy/config; persistent mismatch stops the action and escalates to a human/platform owner.

## Definition of Done
Evidence documented; configured protected paths canonicalized; absent/present path fixtures pass; blocked operations produce auditable reasons; native sandbox remains active; no unrelated path is denied; independent verifier signs off.
