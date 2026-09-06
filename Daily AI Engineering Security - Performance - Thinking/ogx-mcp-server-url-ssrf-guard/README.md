# OGX MCP Server URL SSRF Guard

Category: Security

## Problem
Caller-controlled MCP `server_url` values can cross the agent platform trust boundary and cause server-side requests to internal or metadata endpoints when destination validation is missing.

## Evidence
CVE-2026-85666 / GHSA-9mg6-c5wp-2g44 was published 2026-09-04 for OGX (formerly Llama Stack). The advisory describes unauthenticated SSRF through `/v1/responses` MCP tool definitions and notes that an existing private-address validator used by sibling URL inputs was not applied to `server_url`.

## Existing approach and limitation
URL validation existed elsewhere in the codebase, but enforcement was inconsistent across input paths. Patch-only remediation does not protect other agent platforms from the same authorization mistake.

## Proposed improvement
A reusable MCP URL authorization boundary: canonicalize the destination, resolve DNS, deny loopback/link-local/private/metadata ranges, reject unsafe redirects, constrain forwarded credentials, and fail closed when effective destination cannot be proven.

## Architecture
- `evidence/research.md`: current evidence and root cause.
- `skills/mcp-url-threat-model.md`: diagnosis procedure.
- `rules/mcp-url-boundary.md`: enforceable security rules.
- `subagents/security-verifier.md`: independent verifier.
- `workflows/harden-and-verify.md`: bounded implementation flow.
- `hooks/preflight.md`: blocking integration hook.
- `scripts/validate_mcp_url.py`: dependency-free deterministic validator.
- `tests/test_validate_mcp_url.py`: regression tests.

## Installation
Python 3.10+ is sufficient for the reference validator and tests.

## Usage
Run `python scripts/validate_mcp_url.py <url>` before opening an MCP HTTP/SSE connection. Run `python -m unittest tests/test_validate_mcp_url.py` before release.

## Metrics
Blocked unsafe destinations; false-positive rate on approved public endpoints; redirect-policy violations; credential-forwarding violations; security-regression test pass rate.

## Verification
Implemented means the gate is wired into every caller-controlled MCP endpoint. Measured means allowed/blocked decisions are logged in a test environment. Verified means attack cases for loopback, RFC1918, link-local, metadata and DNS resolution are blocked while approved public endpoints pass.

## Safety
Do not weaken network, redirect or credential rules to satisfy compatibility. Exceptions require explicit human approval, destination ownership evidence and expiry.

## Failure handling
Detection: validator error or indeterminate resolution. Retry: one DNS retry only for transient resolver failure. Fallback: block. Escalation: security owner. Stop condition: destination cannot be proven safe.

## Definition of Done
Evidence documented; all ingress paths identified; validator integrated; tests pass; metrics collected; permission boundaries preserved; no secrets logged; independent verification complete.