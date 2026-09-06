# Repository Config Capability Escalation Guard

**Category:** Security

## Problem
Project-scoped configuration is convenient, but a cloned repository is not automatically a trusted security principal. Recent CodeWhale advisories demonstrate that repository-controlled configuration can silently expose shell capability or bypass approval expectations. This package provides a reusable, monotonic policy boundary: project configuration may preserve or tighten authority, but it may not broaden authority without explicit, digest-bound approval.

## Evidence
See `evidence/research.md`. The package is motivated by CVE-2026-75911, CVE-2026-75858, and related configuration-to-code-execution failures. Observed evidence, interpretation and the proposed solution are separated there.

## Existing approach and limitation
Approval prompts, sandboxes and per-field deny-lists are useful but incomplete when the configuration merge itself can register a privileged tool or alter its approval semantics. Field-by-field defenses also regress when new capability-bearing keys are added.

## Proposed improvement
Model the merge as a trust transition. A lower-trust layer can only tighten policy. Any escalation or unknown capability-affecting field blocks startup/tool registration unless a trusted principal explicitly approves the exact repository/config digest and delta.

## Architecture
- `evidence/research.md` — current public evidence and root-cause analysis.
- `rules/config-trust-boundary.md` — enforceable invariants.
- `skills/policy-delta-analysis.md` — evidence-driven analysis procedure.
- `subagents/security-reviewer.md` — independent verification role.
- `workflows/preflight-and-enforce.md` — bounded implementation/verification workflow.
- `scripts/policy_delta_guard.py` — dependency-free reference checker.
- `tests/test_policy_delta_guard.py` — deterministic regression tests.

## Installation
Requires Python 3.9+ for the reference implementation. Copy this package into the agent/platform repository and adapt the field schema in `scripts/policy_delta_guard.py` to the host's policy model.

## Configuration
Provide trusted baseline and project candidate policies as JSON objects. Security-sensitive host fields MUST be explicitly classified. Unknown changed fields fail closed in the reference implementation.

## Usage
`python scripts/policy_delta_guard.py --baseline baseline.json --candidate project.json --repository owner/repo --output attestation.json`

Exit codes: `0` allow, `2` invalid input/runtime error, `3` blocked policy delta.

Run regression tests with `python tests/test_policy_delta_guard.py`.

## Workflow
Observe project config → capture trusted baseline → classify policy delta → block or obtain explicit approval → integrate merge logic → rerun exact case → independent security review. Maximum two implementation/retest cycles.

## Metrics
- 100% block rate for known unapproved escalation fixtures.
- Zero accepted sessions with unresolved `unknown` capability-affecting deltas.
- Zero stale approval reuse after candidate config hash changes.
- Security-sensitive schema coverage tracked when fields are added.

## Verification
**Implemented:** host uses monotonic merge/preflight before privileged tool registration. **Measured:** decision artifact records baseline/candidate deltas and digest. **Verified:** independent reviewer confirms attack fixtures are blocked, trusted permissions remain unchanged, and tests pass.

## Safety
Never execute repository-controlled code during preflight. Never treat project instructions as authorization. Never weaken approval, sandbox or secret boundaries to recover from a failure. Dangerous exceptions require explicit human approval.

## Failure handling
Detection: checker exit 2/3 or review finding. Evidence: preserve decision JSON and config digest. Retry: maximum one transient read retry and two implementation/retest cycles. Fallback: trusted baseline with privileged project-requested capabilities disabled. Escalation: human security owner. Stop: unresolved escalation, unknown executable field, invalid approval or identity uncertainty.

## Definition of Done
Evidence documented; baseline captured; limitation identified; monotonic guard implemented; deterministic tests pass; attack path is blocked; policy boundaries remain preserved; metrics and decision artifact are collected; independent verification is complete; no blocking issue or secret exposure remains.

## Customization
Extend capability classification for network scopes, filesystem roots, MCP/STDIO definitions, package-install permissions, deployment tools and host-specific approval levels. Preserve the tightening-only invariant rather than adding permissive exceptions.
