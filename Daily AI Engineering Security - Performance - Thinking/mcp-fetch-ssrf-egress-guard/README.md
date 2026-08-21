# MCP Fetch SSRF Egress Guard

**Category:** Security

## Problem
Model-controlled URLs are capabilities, not inert text. A network-capable MCP tool can be coerced by direct or indirect prompt injection into fetching cloud metadata, loopback services, private networks, or other sensitive destinations. See `evidence/research.md` for current public signals and source links.

## Existing approach and limitation
Common defenses—hostname denylists, cloud-specific metadata settings, generic prompt-injection detection, or broad network firewalls—leave gaps when URL parsing, DNS results, IPv6, redirects, and application-level authorization are not evaluated together.

## Proposed improvement
Apply a deterministic DNS-aware policy gate before the initial fetch and every redirect. Default-deny local/private/sensitive networks; permit only configured schemes; optionally use a narrow domain allowlist; produce auditable non-secret reason codes; combine with network-level egress controls.

## Architecture
- `evidence/research.md` — observed evidence, interpretation, gap and root causes.
- `config/policy.json` — secure-by-default schemes, CIDRs, redirect budget and allowlist.
- `scripts/url_guard.py` — executable URL/DNS decision gate.
- `tests/test_url_guard.py` — deterministic adversarial/benign fixtures without real network probes.
- `skills/ssrf-threat-model.md` — investigation and hardening procedure.
- `rules/egress-policy.md` — enforceable security requirements.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/harden-and-verify.md` — bounded observe/measure/implement/verify loop.
- `hooks/pre-fetch-check.md` — integration point for initial requests and redirects.

## Installation
Requires Python 3.10+ and only the standard library. Copy the package into the repository that owns the MCP/network fetch implementation or adapt the same logic natively.

## Configuration
Edit `config/policy.json`. Keep `allow_internal_networks=false` for public fetch capabilities. Prefer `domain_allowlist` for fixed integrations. Treat production allowlist expansion as a security-sensitive configuration change.

## Usage
Validate a candidate destination:

`python3 scripts/url_guard.py "https://example.com/path" --policy config/policy.json`

Run deterministic tests:

`python3 tests/test_url_guard.py`

The HTTP client must invoke equivalent validation again for every redirect target before following it.

## Workflow
Follow `workflows/harden-and-verify.md`: observe all outbound paths → capture baseline → diagnose gaps → implement guard → measure again → independent verification. Maximum two correction cycles.

## Metrics
Track guard coverage, redirect-validation coverage, blocked-fixture pass rate, benign-fixture pass rate, and unresolved high-severity findings. Production telemetry should count allow/deny decisions without storing credentials.

## Verification
### Implemented
The package provides policy, executable guard, deterministic tests, integration hook, rules and bounded workflow.

### Measured
Use the same fixture matrix before and after integration. Do not claim improvement without recorded baseline/after results in the target implementation.

### Verified
An independent verifier defined by `subagents/security-verifier.md` confirms every outbound/redirect path is covered and all adversarial fixtures are blocked. Package presence alone is not proof that a target application is secure.

## Safety
Never test real metadata endpoints in production. Never log authorization headers or retrieved secrets. DNS failure fails closed for security-sensitive fetches. Do not disable TLS verification or broadly permit internal networks to preserve compatibility.

## Failure handling
Detection evidence must include URL class, normalized host, resolved addresses, decision/reason, and call path. Retry transient DNS-test infrastructure at most once. Deterministic policy failures are not retried. Conflicts between legitimate internal-access requirements and default-deny policy require explicit human approval and preferably a separate narrowly scoped capability.

## Definition of Done
- Evidence and existing approaches documented.
- All outbound and redirect paths identified.
- Baseline captured in the target integration.
- Guard integrated before credentials are attached.
- Adversarial fixtures pass with no sensitive network access.
- Benign allowed destinations still work.
- Independent verifier returns `verified`.
- Residual risks and network-level controls documented.
- No blocking finding, secret exposure, or unauthorized policy relaxation remains.

## Customization
Extend CIDRs and allowlists to match deployment boundaries. If a proxy performs DNS resolution, move equivalent enforcement to the component that can authoritatively see the final destination. Preserve the same fail-closed rules and regression fixtures.