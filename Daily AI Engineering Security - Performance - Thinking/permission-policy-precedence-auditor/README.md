# Permission Policy Precedence Auditor

**Category:** Security  
**Date:** 2026-08-20 (UTC+7)

## Problem
Agent permission systems now combine static allow/deny rules, classifiers, hooks, inherited subagent policy, approval prompts, and tool-server checks. These layers can contradict each other, so configured permission is not always effective permission.

## Evidence
See `evidence/research.md`. Current public reports show explicitly allowlisted MCP tools still being denied by higher policy layers, including read-only operations and workflows where hook-level `allow` does not override the classifier.

## Existing approach
Most users rely on `permissions.allow`, `permissions.deny`, Auto Mode classifiers, hooks, prompts, or global bypass modes.

## Existing limitations
These mechanisms usually expose configuration, not a deterministic merged decision. Operators cannot easily tell which layer won, whether a denial is retryable, or whether a global bypass would weaken unrelated boundaries.

## Proposed improvement
Normalize every policy source, compute effective permission with explicit precedence, record decision provenance, distinguish deterministic denial from transient failure, and block futile retries or unsafe privilege broadening.

## Architecture
- `evidence/research.md` — current signals and root-cause analysis.
- `skills/effective-permission-analysis.md` — reusable diagnosis procedure.
- `rules/permission-precedence.md` — enforceable security rules.
- `subagents/permission-reviewer.md` — independent reviewer for risky calls.
- `workflows/audit-and-execute.md` — bounded end-to-end workflow.
- `hooks/pre-tool-permission-check.md` — deterministic pre-dispatch gate.
- `scripts/permission_audit.py` — machine-readable policy evaluator.
- `tests/test_permission_audit.py` — regression tests.

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
Create a JSON file such as:
```json
{
  "risk": "high",
  "layers": [
    {"name":"user-allowlist","decision":"allow","priority":50,"hard":false},
    {"name":"safety-classifier","decision":"deny","priority":100,"hard":true,"reason":"classifier blocked action"}
  ]
}
```
Lower numeric `priority` wins among normal known decisions. Any `hard` deny wins regardless of normal priority. Unknown layers make high-risk actions indeterminate.

## Usage
Run:
```bash
python scripts/permission_audit.py --input policy.json
```
Exit codes: `0` clean allow, `1` invalid input, `2` deny, `3` indeterminate/conflicting decision requiring review.

## Workflow
Observe actual runtime behavior → normalize policy layers → diagnose conflicts → compute effective decision → independent review for risky changes → execute only when allowed → verify runtime matches model.

## Metrics
- percentage of tool calls with permission provenance;
- policy conflicts by layer pair;
- deterministic-denial retries prevented;
- preflight/runtime agreement rate;
- number of global bypasses required;
- false-block rate for pre-approved read-only tools.

## Verification
Run:
```bash
python -m unittest tests/test_permission_audit.py
```
A production integration should additionally replay representative safe calls and compare predicted versus observed runtime decisions.

## Safety
The package never changes permission configuration. It MUST NOT be used to disable classifiers, sandboxing, deny rules, or approval requirements. Unknown high-risk precedence fails closed.

## Failure handling
Invalid policy input blocks evaluation. Deterministic denial allows at most one retry after a material policy/approval change. Transient classifier/service failures allow at most two bounded retries before escalation.

## Definition of Done
**Implemented:** all package artifacts exist and evaluator/tests are complete.  
**Measured:** conflicts, retry counts, and preflight/runtime agreement are collected.  
**Verified:** representative fixtures pass, risky unknowns fail closed, no unrelated security boundary is weakened, and observed runtime decisions agree with the modeled decision.

## Customization
Extend the input with organization-specific layers, but preserve explicit provenance and deny-first handling for authoritative hard denies.