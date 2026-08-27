# MCP Outbound SSRF Credential Boundary
**Category:** Security

## Problem
Network-capable MCP and agent tools may accept LLM-influenced URLs, redirects, or pagination endpoints. Without destination validation, prompt injection or crafted remote data can induce requests to internal/cloud metadata services or attacker-controlled endpoints and expose credentials.

## Evidence
See `evidence/research.md`.

## Existing approach
Sandboxing, URL approvals, least-privilege IAM, patches, and tool allowlists reduce exposure, but application-level destination validation is still required for URL-bearing inputs and redirects.

## Existing limitations
Hostname-only checks miss resolved private/link-local IPs; initial-request checks miss redirect changes; read-only application modes do not limit stolen credential authority; broad egress allowlists can still permit attacker domains.

## Proposed improvement
A fail-closed outbound policy gate validates scheme, approved domain, port, resolved IP class, redirect destinations, and credential attachment order before every request.

## Architecture
- `config/network-policy.json`
- `scripts/url_boundary_guard.py`
- `tests/test_url_boundary_guard.py`
- `skills/outbound-threat-model.md`
- `rules/network-boundary.md`
- `subagents/security-verifier.md`
- `workflows/diagnose-enforce-verify.md`
- `hooks/pre-network-request.md`
- `evidence/research.md`

## Installation
Python 3.10+. No third-party packages.

## Usage
`python scripts/url_boundary_guard.py --url https://api.example.com/path --policy config/network-policy.json --resolved-ip 8.8.8.8`

## Metrics
Blocked private/link-local destinations, approved-domain coverage, redirect revalidation coverage, credential scope, and false-positive count.

## Verification
Run `python -m unittest tests/test_url_boundary_guard.py`.

## Safety
Checks MUST NOT be disabled for convenience. Internal destinations require explicit policy configuration and security review.

## Failure handling
Fail closed. Retry DNS resolution once only. Disable the affected network tool if provenance or destination cannot be established.

## Definition of Done
Implemented: gate runs before request and redirect.  
Measured: fixtures and safe telemetry recorded.  
Verified: metadata/private-address tests block, intended hosts pass, and no credentials are logged.
