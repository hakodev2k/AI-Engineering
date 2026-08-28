# Absent Protected Path Policy Guard

**Category:** Security

## Problem
A filesystem sandbox can correctly protect an existing metadata path yet fail when that same protected path is absent at sandbox construction time. A writable ancestor may then let an agent create `.git`, `.codex`, `.agents`, hooks, modules, worktree configuration, or similar metadata that a later trusted operation consumes.

## Evidence
Current public signals are documented in `evidence/research.md`, including Codex issues opened 2026-08-05 and 2026-08-25 showing absent-path enforcement gaps on Windows and across Seatbelt/bubblewrap, plus evidence that materializing a missing `.git` merely to attach an ACL is itself unsafe operationally.

## Existing approach
Agent sandboxes normally combine writable workspace roots with protected subpaths and platform-native policy backends. Some implementations expand paths or apply ACLs at startup.

## Existing limitations
Object-existence-dependent policy compilation leaves a gap for future names. Creating missing paths to attach access-control state can change workspace semantics. Cross-platform policy syntax does not guarantee equivalent enforcement.

## Proposed improvement
Treat protected paths as namespace invariants, not a list of currently existing objects. Fail closed whenever a writable ancestor contains an absent protected descendant and the selected backend cannot prove future-path denial without materializing that path.

## Architecture
```text
absent-protected-path-policy-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-sandbox-start.md
├── rules/
│   └── protected-namespace-rules.md
├── scripts/
│   └── protected_path_guard.py
├── skills/
│   └── absent-path-threat-analysis.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_protected_path_guard.py
└── workflows/
    └── diagnose-and-verify.md
```

## Installation
Requires Python 3.10+ and only the standard library.

## Configuration
Edit `config/policy.json` to match the runtime's writable roots, protected relative paths, and *verified* backend capabilities. Set `future_path_deny` to `true` only when the backend can deny creation/access to an absent protected path. Set `requires_materialization` to `true` if enforcement creates the protected path as a setup side effect.

## Usage
Static preflight:

`python scripts/protected_path_guard.py --workspace <workspace> --policy config/policy.json`

The script is read-only: it does not create, delete, chmod, or ACL-modify paths.

## Workflow
Follow `workflows/diagnose-and-verify.md`. Active write enforcement checks belong in disposable fixtures; the real workspace remains unchanged during diagnosis.

## Metrics
- Protected paths tested in both absent and present states.
- Absent-state protection coverage.
- Present-state protection coverage.
- Policy-setup mutation count.
- Platform parity count.
- Blocking findings remaining after remediation.

## Verification
Run:

`python -m unittest tests/test_protected_path_guard.py`

Then perform backend-native sandbox tests in an isolated fixture and have `subagents/security-verifier.md` independently review the evidence.

## Safety
The package never requires reading protected-file contents or weakening sandbox rules. It is secure-by-default and blocks unproven future-path enforcement. Do not test protected-path writes in a real workspace.

## Failure handling
**Detection:** non-zero guard/test result or backend ambiguity.  
**Evidence:** guard JSON, policy, backend/version, fixture before/after inventory.  
**Retry policy:** maximum 2 attempts, each requiring a changed hypothesis or configuration.  
**Fallback:** narrow writable scope or disable the affected backend/profile for the workload.  
**Escalation:** sandbox/security owner.  
**Stop condition:** unresolved namespace protection or unexpected setup mutation.

## Definition of Done
**Implemented:** policy guard and blocking pre-start integration are present.  
**Measured:** absent/present path matrix and setup-mutation evidence are captured.  
**Verified:** unit tests and backend fixture tests pass; independent verifier confirms protection on the target platform; no protected path is created by setup; no secret content is exposed; no blocking issue remains.

## Customization
Add application-specific protected metadata to `protected_relative_paths`. For multi-platform environments, maintain separate backend capability profiles rather than assuming one platform's result applies to another.
