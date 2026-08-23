# Research — MCP OAuth Resource Audience Compatibility Guard

## Topic
MCP OAuth Resource Audience Compatibility Guard

## Category
Security

## Problem
The MCP 2026-07-28 authorization specification requires OAuth Resource Indicators (RFC 8707): clients must send `resource` on authorization and token requests, and servers must validate that tokens were issued for the MCP server. In practice, major OAuth providers can reject or ignore this parameter, leaving implementations with a compatibility/security trade-off.

## Why it matters now
The July 28, 2026 MCP specification made audience binding explicit, while Microsoft documents a current Azure MCP limitation where some OAuth providers such as Entra ID do not support the required token-endpoint `resource` parameter.

## Affected users
MCP server authors, enterprise platform teams, connector developers, OAuth gateway maintainers, and agents accessing third-party APIs through MCP.

## Current public evidence
### Observed evidence
1. MCP 2026-07-28 authorization requires clients to send RFC 8707 `resource` in both authorization and token requests and to identify the target MCP server: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
2. MCP security considerations require servers to validate token audience, prohibit token passthrough, and describe confused-deputy risk: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
3. Microsoft MCP authentication documentation records a current limitation: some providers, including Entra ID, do not support the MCP token request `resource` parameter; their workaround is narrow scopes and provider-specific configuration: https://github.com/microsoft/mcp/blob/main/docs/Authentication.md
4. RFC 8707 standardizes OAuth Resource Indicators so clients can explicitly identify protected resources: https://www.rfc-editor.org/rfc/rfc8707

### Interpretation
MCP implementations need a deterministic compatibility gate. Silently dropping `resource` is unsafe; blindly requiring it can break otherwise valid enterprise providers. The safe response is explicit capability detection plus independent audience proof, narrow scopes, and fail-closed policy for high-impact tools.

## Existing approaches
- Strict RFC 8707 resource parameter.
- Provider-specific omission/workaround.
- Narrow OAuth scopes.
- JWT `aud` validation or token introspection.
- Separate upstream tokens for proxy servers.

## Remaining limitations
- Provider metadata may not describe RFC 8707 support accurately.
- Scope names alone do not prove audience binding.
- Opaque tokens may require introspection.
- Compatibility fallbacks can accidentally become permanent security bypasses.

## Root-cause analysis
1. MCP authorization requirements and provider OAuth feature sets evolve independently.
2. Implementations conflate successful token acquisition with correct token audience.
3. Fallback behavior is often implicit instead of policy-controlled.
4. Tests cover login success but not wrong-audience rejection.

## Improvement opportunity
Introduce a preflight that records provider resource-indicator capability, expected canonical MCP resource URI, token audience evidence, fallback mode, scope narrowness, and tool impact. High-impact operations fail closed unless audience binding is verified by `aud`, introspection, or an approved equivalent mechanism.

## Goal and metrics
- 100% wrong-audience test tokens rejected.
- 0 silent resource-parameter downgrades.
- Every compatibility fallback emits evidence and expiry/review date.
- High-impact tools unavailable when audience proof is absent.

## Trigger / Inputs / Outputs
- Trigger: provider onboarding, auth configuration change, token acquisition, or protected tool invocation.
- Inputs: provider metadata, MCP canonical URI, token claims/introspection, scopes, tool impact class.
- Outputs: `allow`, `degraded-low-risk`, or `deny`, plus evidence and remediation.
