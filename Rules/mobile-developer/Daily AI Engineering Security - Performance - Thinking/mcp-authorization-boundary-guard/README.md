# MCP Authorization Boundary Guard

**Category:** Security  
**Run date:** 2026-08-20 (UTC+7)

## Problem
MCP servers can authenticate a request yet fail to authorize the exact audience/resource, session owner, MCP resource, tool/action, or approval boundary. Recent independent CVEs demonstrate audience confusion, workflow ownership failures, and cross-user stateful-session execution.

## Evidence
See `evidence/research.md`. It separates observed public evidence from interpretation and the proposed package.

## Existing approach and limitation
OAuth validation, random session IDs, per-tool checks, and approval prompts are useful but insufficient when authorization context is not carried through the complete request path. A valid token or session identifier must not become a bearer capability for unrelated resources or users.

## Proposed improvement
Represent authorization as a deterministic matrix and enforce it immediately before tool execution. Missing policy fails closed. Negative tests deliberately attempt wrong-audience, cross-session, cross-resource, ungranted-tool, and missing-approval calls. The model never decides whether a check is optional.

## Architecture
`request → token issuer/audience check → authenticated principal → session-owner check → resource grant → tool/action grant → approval gate → tool execution`

## Package tree
```text
README.md
evidence/research.md
config/policy.example.json
skills/authorization-threat-model.md
rules/authorization-boundaries.md
subagents/security-verifier.md
workflows/secure-mcp-change.md
hooks/pre-release.md
scripts/check_authorization.py
scripts/run_negative_tests.py
```

## Installation
Requires Python 3.9+ only. Copy this directory into a repository or adapt the policy/scripts into CI.

## Configuration
Copy `config/policy.example.json`; replace example issuer, audiences, principals, resources, tools, actions, risk, and approval requirements. Do not store secrets or bearer tokens in the policy.

## Usage
Validate one decision:
```bash
python scripts/check_authorization.py --policy config/policy.example.json --principal alice --issuer https://issuer.example.com --audience https://mcp.example.com --resource repo:alpha --tool repo.read --action read --session-owner alice
```

Run the adversarial matrix:
```bash
python scripts/run_negative_tests.py --policy config/policy.example.json
```

## Workflow
Follow `workflows/secure-mcp-change.md`: observe → baseline → diagnose → hypothesis → implement → remeasure → independent verification. Use `skills/authorization-threat-model.md` to build the project-specific matrix and `rules/authorization-boundaries.md` as enforceable review rules.

## Metrics
- Unauthorized-success count: target 0.
- Sensitive-tool policy coverage: target 100%.
- High-risk approval coverage: target 100%.
- Negative authorization test pass rate: target 100%.

## Verification
**Implemented:** policy evaluator, negative-test runner, rules, workflow, verifier role, release hook.  
**Measured:** the included fixtures exercise valid access and five distinct denial boundaries.  
**Verified:** only after the scripts and project integration tests pass against the project's actual policy and a reviewer confirms enforcement is wired before real tool execution.

## Safety
Use synthetic identities/resources in tests. Never paste production tokens into fixtures. Do not make tests pass by disabling audience checks, sharing sessions, or widening grants. Dangerous or irreversible live actions require explicit human approval.

## Failure handling
Detection is any unexpected allow, missing policy, absent authoritative owner, or failing security test. Retry at most twice after distinct fixes. Preserve evidence. Fall back to disabling the affected tool/transport rather than weakening authorization. Escalate unresolved failures to a security owner.

## Definition of Done
- Public evidence documented.
- Current authorization baseline captured.
- All sensitive tools/resources represented explicitly.
- Audience, principal, session owner, resource, tool/action, and approval checks enforced.
- Valid fixture succeeds.
- All negative fixtures deny.
- Project tests pass.
- Independent verifier confirms results.
- No secrets exposed and no blocking residual risk remains.

## Customization
Extend `run_negative_tests.py` or replace its fixtures with project-native integration tests. Keep the same invariants even if policy storage moves to OPA/Cedar/Rego/database authorization. The important property is a deterministic deny before tool execution, not the sample JSON format.
