# Tool Policy Fail-Closed Invariant Gate

**Category:** Security  
**Research date:** 2026-08-21 (UTC+7)

## Problem
Agent tool restrictions can fail open when runtimes conflate a missing policy with an explicit empty policy, restore broad defaults after filtering, or enforce restrictions in one mode but not another. Recent August 2026 reports in Hermes Agent and Kimi Code show concrete variants of this capability-boundary failure.

## Evidence
See `evidence/research.md`. The package separates observed evidence, interpretation, and the proposed engineering control.

## Existing approach
Agent systems commonly use allowlists/denylists, provider-side tool filtering, runtime authorization checks, and prompt instructions.

## Existing limitations
Those controls remain fragile when policy state is represented inconsistently across parser, provider adapter, sandbox, subagent, and execution dispatcher. Prompt restrictions do not independently enforce authorization.

## Proposed improvement
Normalize policy with explicit presence semantics, calculate the maximum allowed tool set, and deterministically compare it with both provider-visible and runtime-executable capabilities. Any capability broadening blocks activation or sensitive execution.

## Architecture
The audit skill gathers facts; policy rules define enforceable invariants; the Policy Auditor diagnoses mismatches; the Security Verifier independently validates remediation; workflows bound diagnosis/remediation retries; the pre-agent hook runs the deterministic Python gate; tests protect explicit-empty and mode-divergence cases.

## Package tree
```text
README.md
config/policy.json
evidence/research.md
hooks/pre-agent-tool-policy-check.md
rules/tool-policy-invariants.md
scripts/tool_policy_gate.py
skills/effective-tool-policy-audit.md
subagents/policy-auditor.md
subagents/security-verifier.md
tests/test_tool_policy_gate.py
workflows/audit-and-remediate.md
workflows/regression-verification.md
```

## Installation
Requires Python 3.10+ and only the standard library. Copy the package into an agent/runtime repository or invoke the script from CI/session initialization.

## Configuration
Edit `config/policy.json` only to match documented product semantics. The supplied secure default distinguishes missing allowlist from explicit empty and treats explicit empty as zero allowed tools. Do not change semantics merely to make a failing integration pass.

## Usage
Produce a runtime snapshot:

```json
{
  "mode": "interactive",
  "allowlist_present": true,
  "allowlist": ["read_file"],
  "denylist": ["terminal"],
  "known_tools": ["read_file", "write_file", "terminal"],
  "provider_visible_tools": ["read_file"],
  "runtime_executable_tools": ["read_file"]
}
```

Run:

```bash
python scripts/tool_policy_gate.py effective-tools.json --config config/policy.json
python -m unittest tests/test_tool_policy_gate.py
```

Exit code `0` passes, `2` means invalid/unresolved input, and `3` means a policy violation.

## Workflow
Follow `workflows/audit-and-remediate.md` for a detected mismatch and `workflows/regression-verification.md` before release. Remediation loops are bounded to two cycles; regression reruns are bounded to one after a concrete fix.

## Metrics
- Forbidden provider-visible tools: 0.
- Forbidden runtime-executable tools: 0.
- Provider/runtime policy divergence: 0.
- Required policy-boundary checks: 100%.
- Explicit-empty and restricted-policy fixtures passing: 100%.

## Verification
**Implemented:** deterministic normalization/gate, rules, workflows, hook, and regression tests are present.  
**Measured:** the gate emits observed allowed/provider/runtime sets, high-impact exposure, and violations.  
**Verified:** a deployment is verified only after target-runtime snapshots and tests pass; package presence alone is not production verification.

## Safety
The package never recommends expanding privileges to restore functionality. Unknown policy state must fail closed where it could broaden access. Use non-destructive introspection/canaries instead of executing dangerous tools during verification.

## Failure handling
Detection is a non-zero gate or regression failure. Preserve evidence, make at most two evidence-driven remediation attempts, keep sensitive capabilities blocked, and escalate unresolved semantics to the policy/security owner. Never suppress a failure by changing explicit restrictions to broad defaults.

## Definition of Done
Evidence documented; baseline captured; existing limitation identified; effective-policy gate integrated; target runtime measured; explicit-empty and mode cases pass; provider/runtime capabilities stay within policy; independent verification completed for high-impact changes; no blocking issue remains.

## Customization
Extend the input collector for framework-specific tool registries or policy precedence, but keep the normalized gate framework-independent. Add high-impact tool names and integration fixtures without removing the core absent-vs-empty invariant.
