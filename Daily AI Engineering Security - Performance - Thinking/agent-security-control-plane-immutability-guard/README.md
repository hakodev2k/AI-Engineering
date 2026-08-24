# Agent Security Control-Plane Immutability Guard

**Category:** Security  
**Run date:** 2026-08-24 (UTC+7)

## Problem
AI coding agents increasingly consume local files that define sandbox, permission, hook, MCP, network, and approval behavior. If those control-plane files are writable by the same agent they govern, or if runtime behavior silently diverges from declared policy, the agent can cross a security boundary without a separately authorized control-plane change.

## Evidence
See `evidence/research.md`. Current 2026 reports show mutable sandbox settings, managed-policy bypass, and runtime egress behavior diverging from declared allowlists.

## Existing approach
Products provide workspace trust, permission modes, sandbox profiles, managed settings, and network allowlists. These are necessary but do not independently prove that the effective policy used for an action is the approved policy revision.

## Existing limitations
- Policy files may live in writable user/project trees.
- A loaded policy is not proof of effective enforcement.
- Changes can occur between session start and a later tool call.
- Parent/subagent/process boundaries can observe different policy state.
- Human approval is often attached to the command, not to the policy revision enabling it.

## Proposed improvement
Bind privileged execution to a deterministic control-plane attestation. Record approved hashes of policy files, re-check before sensitive tool actions, block on hash drift or missing required files, and require a distinct human-controlled re-baseline operation.

## Architecture
```text
config/policy.json
      |
      v
scripts/policy_attest.py ----> state/control-plane-baseline.json
      |                               ^
      v                               |
hooks/pre-tool-policy-attestation.md |
      |                               |
      +---- block on drift -----------+
```

## Package tree
```text
README.md
evidence/research.md
config/policy.json
skills/control-plane-attestation.md
rules/control-plane-immutability.md
subagents/security-verifier.md
workflows/baseline-and-enforce.md
hooks/pre-tool-policy-attestation.md
scripts/policy_attest.py
tests/test_policy_attest.py
```

## Installation
Python 3.10+ only; no third-party dependencies.

## Configuration
Edit `config/policy.json` to list policy files that govern your runtime. Use `required: true` only for files that must exist in every protected environment. Store the generated baseline outside agent-writable workspace state when possible.

## Usage
Create an approved baseline from a trusted shell:
```bash
python scripts/policy_attest.py --root /path/to/workspace --config config/policy.json --state /secure/control-plane-baseline.json --record
```

Verify before a privileged action:
```bash
python scripts/policy_attest.py --root /path/to/workspace --config config/policy.json --state /secure/control-plane-baseline.json
```

Exit codes: `0` verified, `2` policy drift/missing protected state, `3` invalid input/config, `4` baseline write failure.

## Workflow
Follow `workflows/baseline-and-enforce.md`: inventory → establish trusted baseline → attach pre-tool attestation → exercise negative tests → independently verify.

## Metrics
- policy drift events detected before privileged execution
- percentage of privileged actions covered by attestation
- false-positive rate
- mean time from legitimate policy edit to reviewed re-baseline
- number of actions attempted under unverified policy

## Verification
Run:
```bash
python -m unittest tests/test_policy_attest.py
```
The tests prove unchanged policy passes, modified policy blocks, and a missing required policy blocks.

## Safety
The script never executes repository-controlled commands, never evaluates config as code, and never mutates policy files. `--record` changes only the chosen baseline state and MUST be run from a human-controlled trust context.

## Failure handling
Detection: non-zero attestation exit. Evidence: JSON report on stdout. Retry: at most once after refreshing filesystem state. Fallback: keep privileged action blocked. Escalation: human reviews exact changed file/hash. Stop condition: no execution while drift remains unresolved.

## Definition of Done
**Implemented:** policy inventory, hash attestation, blocking hook contract, rules, independent verifier, tests.  
**Measured:** coverage/drift metrics are collected in the host integration.  
**Verified:** deterministic tests pass and a real privileged action is blocked after an unauthorized policy mutation while an unchanged baseline remains usable.

## Customization
Extend `config/policy.json` with editor, MCP, CI, sandbox, proxy, hook, or orchestration control files. Do not add ordinary source files unless they directly govern security policy.