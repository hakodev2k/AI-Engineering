# AI Workflow Sandbox Boundary Regression Guard

**Category:** Security

## Problem
Custom-code, expression, evaluator, and task-runner features in AI/workflow platforms can unintentionally expose host capabilities through prototypes, constructors, imported module graphs, or shared process state. Recent 2026 advisories across n8n, Flowise, and Agenta show that patching individual exploits does not remove the need for reusable boundary verification.

## Evidence
See `evidence/research.md` for current public advisories and dates.

## Existing approach
Upgrade vulnerable releases, freeze selected prototypes, restrict imports, lower worker privileges, isolate workers/containers, disable unnecessary custom code, and restrict authoring rights.

## Existing limitations
Known-version patches address disclosed paths, not future capability regressions. Selective blocklists/freezing can miss transitive objects. Shared process state can amplify a single escape. Configuration drift can reopen module, network, filesystem, or privilege paths.

## Proposed improvement
A non-destructive, deterministic regression package that treats sandbox safety as a set of observable invariants: known fixed versions, isolated low-privilege workers, explicit module/network/filesystem policies, no forbidden host capabilities, and independent review of allowlist changes. It deliberately avoids exploit execution in normal CI.

## Architecture
```
ai-workflow-sandbox-boundary-regression-guard/
├── README.md
├── config/
│   └── sandbox-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── inventory.example.json
├── hooks/
│   └── pre-release-boundary-check.md
├── rules/
│   └── sandbox-security.md
├── scripts/
│   └── sandbox_boundary_guard.py
├── skills/
│   └── sandbox-boundary-analysis.md
├── subagents/
│   └── security-reviewer.md
├── tests/
│   └── test_sandbox_boundary_guard.py
└── workflows/
    └── measure-remediate-verify.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Maintain `config/sandbox-policy.json` using current official advisories. The included minimum versions reflect the cited August 2026 evidence and must be updated when newer supported release lines or fixes supersede them.

## Usage
Copy `examples/inventory.example.json`, replace it with measured deployment facts, then run:

`python scripts/sandbox_boundary_guard.py --inventory inventory.json --policy config/sandbox-policy.json`

Exit `0` = policy pass, `3` = blocking boundary violation, `2` = invalid input/configuration.

## Workflow
Use `workflows/measure-remediate-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement improvement → Measure again → independently verify. A failed invariant permits only one remediation revision before escalation.

## Metrics
- Known-vulnerable component count.
- Missing required isolation/control count.
- Forbidden-capability count.
- Unreviewed module-allowlist additions.
- Sandbox regression-test pass rate.

## Verification
Run:

`python -m unittest tests/test_sandbox_boundary_guard.py`

Then have `subagents/security-reviewer.md` independently review the measured inventory and any boundary-affecting changes.

## Safety
The package uses inventory and non-destructive invariants rather than RCE payloads. It never requires secrets. Dangerous or irreversible security testing requires explicit human approval and an isolated environment.

## Failure handling
A failed policy check blocks release/deployment. Retry inventory collection once only for tooling/collection errors. Do not retry failed invariants without a code/configuration change. Fallback is to disable the affected custom-code path when feasible and escalate with preserved evidence.

## Definition of Done
**Implemented:** version and control policy, guard, hook, workflow, rules, reviewer, example and tests are integrated.  
**Measured:** a current deployment inventory has been evaluated.  
**Verified:** unit tests pass, known vulnerable versions are rejected, missing isolation/forbidden capabilities are rejected, independent review passes, and no secrets are exposed.

## Customization
Add platform-specific minimum versions and controls only from authoritative advisories or internal verified releases. Extend forbidden capabilities conservatively. Do not weaken worker isolation, egress, filesystem, module, or privilege boundaries to make custom code easier to run.
