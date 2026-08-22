# Approval Sandbox Placement Contract Gate

## Category
Security

## Problem
Agent runtimes can implicitly couple command approval with execution placement. This creates two unsafe or confusing outcomes: an approved command can silently remain sandboxed even when host placement was expected, or an allow/no-prompt rule can be interpreted as sandbox escape when the desired policy was only to suppress prompting. When denied-read restrictions protect credentials, direct unsandboxing can also destroy the confidentiality boundary.

## Evidence
Current Codex reports demonstrate the interaction. Issue #38318 shows an `allow` rule remaining sandboxed whenever denied-read restrictions are active, while issue #33349 independently reports that deny rules prevent sandbox exit after approval. Related issues #20917 and #26108 describe the need to separate review/approval from sandbox placement and to support no-prompt sandboxed commands. Full evidence and limitations are in `evidence/research.md`.

## Existing approach and limitation
Common implementations overload one rule decision to cover both approval and placement, conservatively keep all commands sandboxed under denied reads, or require users to choose between full host access and secret isolation. Those choices cannot express important combinations safely and can produce silent differences between configured and effective placement.

## Proposed improvement
Represent each execution policy as an explicit contract with three independent dimensions: approval, placement, and confidentiality invariants. Host execution is never direct when sandbox-only denied-read protections are active; it must go through an explicitly trusted broker with declared capabilities and confidentiality behavior. The deterministic gate rejects incompatible or ambiguous combinations before execution.

## Architecture
The analysis skill compiles a command contract. Rules enforce separation and fail-closed behavior. The deterministic placement gate validates approval, requested placement, broker trust, capability scope, and protected invariants. A blocking pre-execution hook enforces the result. The workflow includes baseline placement measurement, bounded correction, and an independent Security Policy Reviewer.

## Package tree
```text
approval-sandbox-placement-contract-gate/
├── README.md
├── config/
│   └── placement-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-exec-placement-gate.md
├── rules/
│   └── approval-placement-separation.md
├── scripts/
│   └── placement_policy_gate.py
├── skills/
│   └── placement-contract-analysis.md
├── subagents/
│   └── security-policy-reviewer.md
├── tests/
│   └── test_placement_policy_gate.py
└── workflows/
    └── compile-and-verify-placement.md
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy the package into the agent/runtime repository. Wire the pre-execution hook into the point immediately before sandbox or host execution selection. The gate does not itself execute commands or read protected files.

## Configuration
Edit `config/placement-policy.json`:
- Keep `default_placement` as `sandbox` unless there is a reviewed reason to change it.
- Add trusted host brokers only through trusted local configuration under `trusted_brokers`.
- Each broker declaration must contain an explicit `capabilities` array and `preserves_confidentiality` boolean.
- Keep fail-closed behavior for unknown brokers.
- Keep human approval enabled for high-risk broker capabilities.

Never store credentials, tokens, or secret material in the policy file.

Example trusted broker declaration:

```json
{
  "trusted_brokers": {
    "desktop-opener": {
      "capabilities": ["open_app"],
      "preserves_confidentiality": true
    }
  }
}
```

The broker implementation itself remains outside this package and must be independently secured; declaring a broker trusted is an administrative security decision.

## Usage
Create a command contract JSON with `command_id`, `approval`, `placement`, active confidentiality invariants, requested capabilities, optional broker identifier, and action-bound human approval status. Then run:

```bash
python3 scripts/placement_policy_gate.py contract.json --policy config/placement-policy.json
```

Follow the exit-code contract in `hooks/pre-exec-placement-gate.md`. Execution is permitted only on exit code `0`, using exactly the returned effective placement.

## Workflow
Use `workflows/compile-and-verify-placement.md`: Observe → Measure baseline → Diagnose → Compile explicit contract → Gate → Approval checkpoint when required → Independent review → Execute/probe → Compare requested and effective placement. Policy correction is bounded to two cycles.

## Metrics
Track requested/effective placement mismatches, silent fallback count, denied unsafe host requests, broker executions, high-risk human approvals, capability-scope violations, and confidentiality-invariant violations. The target for silent fallbacks and invariant violations is zero.

## Verification
Run:

```bash
python3 tests/test_placement_policy_gate.py
```

The fixtures verify that `approval=allow` does not escape the sandbox, host placement without a broker is blocked, unknown brokers fail closed, high-risk broker actions require bound human approval, trusted broker execution can be admitted when requirements are satisfied, and broker capabilities cannot be exceeded.

Add an environment-specific non-secret placement probe before production use. A placement probe should distinguish sandbox from broker execution without accessing credentials or protected content.

## Safety
- Never weaken denied-read or secret-isolation rules to make host execution work.
- Never allow the model to create its own trusted broker entry.
- Never infer host placement from approval alone.
- Require explicit human approval for dangerous/irreversible broker actions when configured.
- The implementing agent must not be the only verifier for a high-risk policy change.

## Failure handling
Detection is based on explicit contract fields and trusted configuration. Invalid/unknown states fail closed. A missing broker returns `broker_required`; an untrusted broker is denied under default policy. Approval requests are action-bound and an unchanged contract gets at most one approval round. Policy correction is limited to two cycles. If safe host placement is not realizable, keep the command sandboxed when that satisfies user intent; otherwise deny and escalate. Never disable confidentiality controls as fallback.

## Status semantics
- **Implemented:** policy, deterministic gate, hook, rules, workflow, reviewer, and regression tests exist.
- **Measured:** baseline and effective placement have been observed using a non-secret environment probe.
- **Verified:** tests pass, reviewer passes, requested/effective placement match, and protected invariants remain intact.

This package is implemented, but production security improvement is not claimed until the host runtime and any trusted broker are measured and verified.

## Definition of Done
Evidence documented; baseline placement measured; approval/placement separated; protected invariants enumerated; broker trust and capability scope verified when used; required approval obtained; deterministic tests pass; requested and observed placement match; independent security review passes; and no blocking policy mismatch remains.

## Customization
Map the generic approval and placement values to the host agent framework, add only narrowly scoped broker capabilities, and add deployment-specific confidentiality invariants. Preserve the central invariant: approval answers “may this action proceed?”, placement answers “where/how may it execute?”, and neither is allowed to silently override the other.
