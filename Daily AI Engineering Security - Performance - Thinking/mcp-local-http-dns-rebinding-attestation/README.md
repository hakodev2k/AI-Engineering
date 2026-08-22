# MCP Local HTTP DNS Rebinding Attestation

## Topic
Runtime attestation for DNS-rebinding, Host/Origin, bind-address, authentication, and sensitive-tool exposure controls on local MCP HTTP servers.

## Category
Security

## Problem
A server described as “localhost only” can still be driven from a malicious browser page when DNS rebinding or unsafe Host/Origin handling crosses the browser-to-localhost boundary. The impact is amplified when the MCP server holds a PAT, can execute commands, mutate CI/CD, write files, control browsers, or expose secrets.

## Evidence
Current evidence and source links are documented in `evidence/research.md`. Recent 2026 advisories affect multiple MCP SDKs and a concrete CircleCI MCP server; the 2026-07-28 MCP security guidance explicitly addresses DNS rebinding and local-server compromise.

## Existing approach
Patch affected SDKs, bind local services to loopback, validate Host/Origin, require authentication, and use reverse proxies or stdio where appropriate.

## Existing limitations
Version checks and source configuration do not prove the effective endpoint is safe. Proxy rewriting, environment overrides, custom transports, parser behavior, and app-level configuration can make the runtime differ from the intended policy.

## Proposed improvement
Treat the boundary as an executable invariant: a positive control must reach the endpoint, while configured foreign Host values, foreign Origin values, and unauthenticated access (when required) must be rejected at runtime. The probe never invokes tools.

## Architecture
- `evidence/research.md` — current public evidence, existing controls, gaps, root cause, metrics.
- `config/policy.json` — default loopback/Host/Origin/auth policy and probe matrix.
- `skills/runtime-attestation.md` — reusable evidence-driven attestation procedure.
- `rules/security-boundary.md` — enforceable security invariants.
- `subagents/security-reviewer.md` — independent security verification contract.
- `workflows/attest-remediate-verify.md` — bounded measure/diagnose/remediate/re-measure workflow.
- `hooks/pre-start-attestation.md` — blocking startup/release verification hook.
- `scripts/attest_mcp_http.py` — dependency-free safe runtime probe.
- `tests/test_attest_mcp_http.py` — deterministic unit tests for policy and safe request semantics.

## Installation
Requires Python 3.10+ and only the standard library. Copy this directory as a unit. No secrets are stored in the package.

## Configuration
Edit `config/policy.json` for the intended server. For an authenticated endpoint, export the complete test Authorization header value through `MCP_ATTEST_AUTHORIZATION`. Use a scoped test credential rather than a production-wide token whenever possible.

## Usage
From this package directory:

```bash
python3 -m unittest tests/test_attest_mcp_http.py
MCP_ATTEST_AUTHORIZATION='Bearer <scoped-test-token>' \
  python3 scripts/attest_mcp_http.py http://127.0.0.1:8000/mcp --policy config/policy.json
```

Do not place the real token in committed config, shell history, reports, or examples.

## Workflow
Follow `workflows/attest-remediate-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement → Measure again → Independent verification. Remediation is bounded to three hypothesis cycles; ambiguous network failures are not treated as passes.

## Metrics
- Foreign Host rejection rate.
- Foreign Origin rejection rate.
- Required unauthenticated rejection rate.
- Wildcard-bind violations.
- Sensitive unauthenticated capability count.
- Number of remediation cycles.

## Verification
### Implemented
A transport/configuration change exists and the package is integrated.

### Measured
The positive and negative runtime probe matrix has been executed against the effective endpoint.

### Verified
All prohibited requests are rejected, positive control succeeds, bind/auth policy is satisfied, tests pass, and an independent reviewer confirms the result.

## Safety
The script sends only MCP `initialize`. It MUST NOT be modified to call tools for this security check. Run only against endpoints you own or are authorized to test. Reports intentionally omit response bodies and Authorization values.

## Failure handling
- Blocking exposure: stop verification immediately, preserve sanitized evidence, remediate.
- Ambiguous network/TLS/proxy path: manual review; do not infer safety.
- Transient probe failure: retry at most twice.
- Three failed remediation hypotheses: escalate with evidence.
- Never weaken auth, Host/Origin policy, sandboxing, or tool permissions to achieve a pass.

## Definition of Done
- Current evidence documented.
- Policy reviewed for the server.
- Baseline captured.
- Positive control succeeds.
- All prohibited Host/Origin probes are rejected.
- Required unauthenticated request is rejected.
- Sensitive capability risk is documented.
- Unit tests pass.
- Independent reviewer verifies the post-change result.
- No secrets appear in reports or repository content.
- No blocking issue remains.

## Customization
Add organization-specific foreign Host/Origin canaries, capability classes, proxy-specific checks, or listener inspection as separate deterministic controls. Preserve the fail-closed semantics and the rule that no state-changing MCP tool is invoked during attestation.
