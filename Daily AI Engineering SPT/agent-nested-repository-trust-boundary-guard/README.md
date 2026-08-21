# Agent Nested Repository Trust-Boundary Guard

## Topic
Prevent security-policy drift when an AI coding agent enters or modifies nested repositories and nested agent-configuration roots.

## Category
**Security**

## Problem
A workspace can look protected at its top-level boundary while containing nested repositories/projects whose Git metadata or agent settings are governed differently. Current public reports show two concrete failure modes: writable nested `.git` metadata can permit deferred hook execution, and nested project configuration can silently drop stricter parent sandbox settings.

## Evidence
See `evidence/research.md`.

Primary current signals:
- OpenAI Codex issue #37081 (2026-08-05): nested `.git` can remain writable under `workspace-write` even though the root `.git` is protected, enabling hook planting that may execute later outside the sandbox.
- Anthropic Claude Code issue #83035 (2026-08-01): nested project settings can replace rather than inherit the workspace sandbox configuration for sessions/subagents rooted below that child.
- Claude Code issue #61909 shows the trade-off: broad hook-write denial can break legitimate hook installation, so controlled path-specific exceptions are needed rather than blanket weakening.

## Existing approach
Agent products commonly protect root control metadata, use project trust/config files, sandbox workspace writes, and prompt users for approval around sensitive operations.

## Existing limitations
- Root-scoped controls may not recurse into independently rooted metadata.
- Child settings can have host-specific replace/merge semantics.
- Re-rooting a subagent can change the effective policy boundary.
- Blanket metadata denial harms legitimate workflows.
- Manual inventory becomes stale as dependencies, fixtures, submodules and generated repos change.

## Proposed improvement
Treat each nested Git or agent-config root as an explicit trust boundary. The package provides a read-only deterministic scanner, restrictive policy, attestation procedures, approval rules, workflow checkpoints and regression tests. Unknown roots fail closed; parent security policy must be proven preserved or strengthened before automatic delegation.

## Architecture

```text
Workspace root
   |
   +--> PreTask inventory
   |       `nested_trust_guard.py`
   |              |
   |              v
   |       sanitized trust report
   |
   +--> Parent/child policy attestation
   |       same/stronger -> allow
   |       weaker/unknown -> block/approval
   |
   +--> PreMetadataWrite gate
   |       nested .git/.claude/.codex/.agents
   |       -> exact human approval
   |
   +--> Implementation
   |
   +--> PostChange + FinalVerification
           re-scan + independent review
```

## Package structure

```text
agent-nested-repository-trust-boundary-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
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
│   └── nested_trust_guard.py
├── tests/
│   └── test_nested_trust_guard.py
└── verification/
    └── verification.md
```

## Installation
Requirements: Python 3.10+; no third-party packages.

Clone/copy this package into an orchestration controls directory. Keep the default policy restrictive until actual nested roots have been reviewed.

## Configuration
Edit `config/policy.json`.

Important defaults:
- unknown nested roots block;
- active nested Git hooks block;
- nested agent config roots block until classified;
- directory symlinks are not traversed;
- allowlists are exact relative paths rather than wildcards.

The `approved_metadata_write_paths` field is intentionally empty by default and should be populated only by a host workflow tied to explicit human approval.

## Usage
Run from this package directory:

```bash
python3 scripts/nested_trust_guard.py \
  --root /path/to/workspace \
  --policy config/policy.json \
  --output /tmp/nested-trust-report.json
```

Exit status:
- `0` pass;
- `2` configured trust-boundary violation;
- `3` invalid input/policy;
- `4` scan failure.

Run regression tests:

```bash
python3 tests/test_nested_trust_guard.py
```

## Workflow
Use `workflows/workflows.md` as the operational contract:
1. inventory nested roots before work;
2. attest parent/child policy before re-rooting/delegation;
3. permit implementation only within attested boundaries;
4. require exact human approval for persistence/control metadata writes;
5. re-scan after topology/config changes;
6. independently verify before completion.

## Skills
`skills/core-skills.md` contains executable procedures for:
- nested trust-root discovery;
- parent/child policy attestation;
- nested metadata change review.

## Rules
`rules/engineering-rules.md` defines observable MUST / MUST NOT / SHOULD controls. Most importantly, missing child policy fields are never assumed inherited unless the runtime semantics prove that behavior.

## Subagents
`subagents/subagents.md` separates inventory, security review, implementation and independent verification. An implementing agent cannot approve or solely verify its own high-risk nested metadata change.

## Hooks
`hooks/hooks.md` defines:
- PreTask inventory;
- PreDelegation attestation;
- PreMetadataWrite protection;
- PreGitOutsideSandbox hook check;
- PostChange topology drift detection;
- FinalVerification.

## Metrics
Scanner metrics:
- `nested_roots`
- `nested_agent_config_roots`
- `active_nested_hooks`
- `violations`

Operational metrics:
- unknown roots per task;
- delegations without attestation;
- unapproved nested metadata writes;
- post-change topology drift events;
- verification failures.

Target security values for completion are zero unknown roots for permitted execution, zero unapproved metadata writes and zero unresolved violations.

## Verification
See `verification/verification.md`.

Maintain separate state labels:
- **Implemented:** controls and scripts exist.
- **Measured:** scanner/test metrics captured.
- **Verified:** independent evidence shows the configured attack paths are blocked and no parent security boundary was silently weakened.

## Safety
The scanner is deliberately read-only. It does not execute hooks, source config files, follow directory symlinks, mutate Git state, call external services, or collect arbitrary file contents. This prevents the detector from triggering the persistence surfaces it is designed to identify.

Dangerous or irreversible operations remain outside this package and require explicit human approval. Never disable sandbox protections simply to make a nested Git workflow succeed.

## Failure handling
Detection failures are security uncertainty, not success. Retry only once when there is evidence of a transient filesystem race. Persistent unreadability, ambiguous policy merge semantics, newly discovered roots, or unexpected metadata changes block completion and require review.

Fallback is to keep work inside the attested parent root or reduce to read-only inspection; never broaden permissions automatically.

## Definition of Done
A task using this package is done only when:
- current evidence/problem is documented;
- nested topology is scanned;
- every used child root is attested;
- no unknown root receives write/execute delegation;
- no unapproved nested hook or agent-control metadata change exists;
- required approvals exactly match actual high-risk changes;
- regression/security checks pass;
- post-change scan has no unresolved blocking violation;
- an independent verifier confirms the result;
- no control was weakened to manufacture a pass.

## Customization
Extend `protected_metadata_names`, skipped build directories, or host-specific policy comparison as needed. When adding an exception, prefer the narrowest exact root/path/action and document why the parent control cannot apply unchanged.

For other agent runtimes, map their project-level policy directories into `protected_metadata_names` and implement a host-specific effective-policy comparator while preserving the core invariant: **entering a child project must never silently reduce the parent security contract.**
