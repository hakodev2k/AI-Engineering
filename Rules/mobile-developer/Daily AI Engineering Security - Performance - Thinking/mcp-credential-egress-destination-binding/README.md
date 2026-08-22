# MCP Credential Egress Destination Binding

**Category:** Security

## Problem
Authenticated MCP/tool integrations can leak credentials when a caller-influenced hostname or URL is accepted as the destination of a request carrying authorization material.

## Evidence
See `evidence/research.md`. The package is motivated by the 2026-08-03 AWS Labs Amazon MQ MCP Server advisory GHSA-xwj6-8x5h-hjp6 plus established SSRF/destination-validation guidance.

## Existing approach and limitation
HTTPS-only checks, generic URL parsing, or human approval do not prove that credentials are sent only to service-owned destinations. Redirects, lookalike hosts, alternate ports, IP literals, and DNS behavior require deterministic enforcement.

## Proposed improvement
Bind each credential class to a canonical destination policy before credentials are attached. Fail closed on invalid destination, prohibit unsafe redirects, and verify adversarial cases using synthetic credentials.

## Architecture
- `evidence/research.md` — current evidence, root cause, gap, metrics.
- `config/destination-policy.json` — service/credential destination policy.
- `scripts/destination_guard.py` — deterministic canonicalization/DNS/policy guard.
- `skills/destination-binding-threat-model.md` — reusable investigation procedure.
- `rules/credential-egress-policy.md` — enforceable security rules.
- `subagents/security-verifier.md` — independent verifier contract.
- `workflows/secure-outbound-request.md` — bounded improvement/verification workflow.
- `hooks/pre-network-destination-check.md` — blocking pre-network hook.
- `tests/test_destination_guard.py` — adversarial offline policy tests.

## Installation
Requires Python 3.9+; tests use `pytest`. No external runtime dependency is required by the guard.

## Configuration
Edit `config/destination-policy.json` to define a real service's owned host suffixes, ports, and redirect policy. Any broadening of egress requires human security review.

## Usage
`python3 scripts/destination_guard.py https://b-123.mq.amazonaws.com --credential-class amazon-mq --policy config/destination-policy.json`

For offline unit testing only, `--no-dns` skips DNS resolution. Production enforcement must not use that flag.

## Workflow
Observe → establish synthetic-secret baseline → diagnose credential/destination flow → define policy → implement pre-credential guard → rerun attacks → independent verification. The workflow allows at most two implementation iterations per hypothesis.

## Metrics
Credential paths guarded, attack fixtures blocked before network I/O, approved endpoint pass rate, redirect coverage, and unresolved destination paths.

## Verification
Run `pytest tests/test_destination_guard.py`. Integration verification must additionally prove that credentials are not attached or transmitted after a deny decision and that redirects cannot escape policy.

## Safety
Never put production credentials in fixtures or logs. Never disable TLS verification. A validation or DNS failure is blocking for credential-bearing requests.

## Failure handling
Detection: guard/test denial or unexpected request destination. Evidence: canonical destination, matched rule, resolved addresses, synthetic fixture. Retry: maximum two implementation iterations. Fallback: constrain the tool to a fixed trusted endpoint or disable the affected authenticated operation. Escalation: security owner. Stop: unresolved service ownership, exhausted retries, or any required weakening of security.

## Definition of Done
**Implemented:** deterministic guard is wired before credential attachment. **Measured:** positive and adversarial fixtures are recorded. **Verified:** independent reviewer confirms unapproved hosts, ports, IP literals, and redirect escape paths cannot receive credentials; approved service paths still function; no secrets are exposed.

## Customization
Add credential classes rather than making one broad wildcard policy. Keep policies service-specific and test each expanded endpoint boundary.