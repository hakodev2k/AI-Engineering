# MCP DNS Rebinding Origin/Host Gate

**Category:** Security  
**Status:** Implemented reference package; production integration must be Measured and independently Verified.

## Problem
Streamable HTTP MCP servers can expose local or private capabilities to malicious browser origins when Host/Origin validation is missing or ambiguous. DNS rebinding can route an attacker-controlled browser origin to loopback while preserving the attacker's hostname/origin semantics.

## Evidence
See `evidence/research.md`. Official MCP SDK advisories in Ruby, Rust, and Java independently documented this attack class in 2026, while MCP transport guidance requires Origin validation.

## Existing approach
Patched SDK versions add transport-specific validation; teams also bind to loopback, use authentication, or place MCP behind proxies.

## Existing limitations
Loopback binding does not itself defeat DNS rebinding, authentication does not replace routing/origin validation, proxy headers can introduce trust ambiguity, and SDK patches do not cover custom wrappers or regressions.

## Proposed improvement
Enforce an explicit pre-dispatch policy over effective Host, Origin, bind address, and forwarded-header trust. Deny ambiguous/unapproved metadata before MCP session or method dispatch and keep high-impact tool authorization independent.

## Architecture

```text
HTTP request
  -> Host/Origin/proxy normalization
  -> deterministic policy gate
       deny -> structured security event
       allow -> authentication/authorization -> MCP JSON-RPC dispatch -> tools/resources/prompts
```

## Package tree

```text
README.md
evidence/research.md
config/policy.json
scripts/origin_host_gate.py
tests/test_origin_host_gate.py
rules/transport-security-rules.md
skills/mcp-http-boundary-review.md
subagents/security-verifier.md
workflows/research-implement-verify.md
hooks/pre-dispatch-regression-check.md
```

## Installation
Requires Python 3.10+ for the offline reference script/tests. No third-party Python packages are required.

## Configuration
Copy `config/policy.json` and replace hosts/origins/bind addresses with exact deployment values. Production policy must not use wildcard Host/Origin entries. Enable forwarded headers only for explicitly trusted proxy peers.

## Usage
Run regression tests:

```bash
python -m unittest tests/test_origin_host_gate.py
```

To evaluate a request metadata fixture:

```bash
python scripts/origin_host_gate.py --policy config/policy.json --request request.json
```

Example `request.json`:

```json
{"host":"127.0.0.1:8000","origin":"https://evil.example","bind_address":"127.0.0.1"}
```

Exit code `0` means allow, `2` means policy deny, and `64` means invalid input/configuration.

## Workflow
Follow `workflows/research-implement-verify.md`: Observe -> Measure baseline -> Diagnose -> Hypothesize -> Implement -> Measure again -> Independent verification.

## Metrics
Hostile fixture rejection rate, approved-client pass rate, pre-dispatch blocking coverage, wildcard policy count, and untrusted forwarded-header acceptance count.

## Verification
The reference script demonstrates policy semantics only. A production system is **Verified** only after integration tests prove equivalent checks execute before MCP dispatch and `subagents/security-verifier.md` independently confirms the result.

## Safety
Do not test systems without authorization. Never weaken authentication, tool authorization, listener boundaries, or allowlists to improve compatibility. Secrets must not be included in fixtures or rejection logs.

## Failure handling
Detection: failing regression/integration fixture. Evidence: preserve request metadata and enforcement-layer result without secrets. Retry: maximum two implementation/test retries. Fallback: disable/restrict HTTP exposure behind a verified boundary. Escalation: platform/security owner. Stop: any hostile fixture still reaches dispatch.

## Definition of Done
- **Implemented:** explicit Host/Origin/bind/proxy policy is enforced before dispatch.
- **Measured:** approved and hostile fixtures have before/after results.
- **Verified:** independent review confirms hostile paths are blocked, approved clients work, no wildcard trust exists, and security boundaries remain intact.

## Customization
Extend the policy for framework-specific trusted-proxy identity, public/browser client classes, mTLS, or deployment-specific hosts. Keep normalization deterministic and enforcement earlier than MCP application dispatch.
