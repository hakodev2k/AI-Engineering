# Credential Destination Policy Parity Verifier

**Category:** Security

## Problem
Credential destination restrictions can be enforced in one HTTP path while being skipped in AI, MCP, GraphQL, or other adapters that reuse the same credential. Recent n8n advisories show repeated cross-adapter failures where a low-privileged user with use-only access to a shared credential could select an attacker-controlled endpoint and cause the secret to be transmitted there.

## Evidence
See `evidence/research.md`. The evidence is based on multiple 2026 n8n advisories affecting distinct connector paths, plus the vendor patches and documented mitigations.

## Existing approach
Upgrade affected components, configure destination allowlists on credentials, restrict credential sharing, and disable vulnerable modules when patching is delayed.

## Existing limitations
A patch fixes known adapters but does not prove policy parity across every credential-consuming adapter. The security property is cross-cutting: the allowlist must be enforced before a secret is attached or materialized, regardless of which node, tool, agent, or connector creates the request.

## Proposed improvement
Maintain an explicit inventory of adapters that combine credentials with user-configurable destinations. Require the same destination-policy controls and at least one passing negative test for each such adapter. `scripts/verify_destination_policy.py` performs deterministic policy-parity checks without handling real secrets.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `config/policy.example.json` — required controls.
- `examples/adapter-inventory.example.json` — inventory contract example.
- `skills/credential-egress-audit.md` — evidence-driven audit procedure.
- `rules/credential-destination-rules.md` — enforceable rules.
- `subagents/security-reviewer.md` — independent reviewer contract.
- `workflows/audit-remediate-verify.md` — bounded workflow.
- `hooks/pre-deploy-policy-parity.md` — blocking deterministic pre-deploy check.
- `scripts/verify_destination_policy.py` — verifier.
- `tests/test_verify_destination_policy.py` — regression tests.

## Installation
Requires Python 3.10+ and the standard library only. Copy this directory as a unit.

## Configuration
Copy `config/policy.example.json` and `examples/adapter-inventory.example.json`, then describe actual adapters. Do not place credentials, tokens, headers, or secret values in the inventory.

## Usage
Run from the package root:

```bash
python scripts/verify_destination_policy.py --policy config/policy.example.json --inventory examples/adapter-inventory.example.json
python -m unittest tests/test_verify_destination_policy.py
```

## Workflow
Observe credential-consuming request paths → inventory adapters → measure current parity → identify gaps → patch the adapter boundary → run negative tests → independently verify.

## Metrics
Coverage of credential-consuming adapters, number of destination-policy gaps, percentage with passing disallowed-destination tests, and number of high/critical findings.

## Verification
**Implemented:** every relevant adapter declares required controls. **Measured:** inventory and test evidence are captured. **Verified:** deterministic verifier and regression tests pass, and an independent reviewer confirms enforcement occurs before secret materialization.

## Safety
Never use production secrets in tests. Use synthetic credentials and sink endpoints. A failing check MUST block completion; do not weaken the allowlist to make a test pass.

## Failure handling
Detection is a non-zero verifier/test exit. Retry at most twice after correcting inventory or implementation. If still failing, keep deployment blocked and escalate to the credential/platform owner.

## Definition of Done
Evidence documented; adapter inventory complete; all applicable controls present; negative tests pass; no secret values stored; independent review completed; verifier exits 0; no blocking finding remains.

## Customization
Extend `required_controls` for DNS pinning, redirect validation, proxy enforcement, tenant isolation, or provider-specific endpoint semantics while preserving pre-secret enforcement.