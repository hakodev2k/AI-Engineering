# Research — MCP OAuth Scope Intent Preservation Guard

## Topic
Preserve explicit client scope intent across MCP OAuth discovery, authorization, refresh, and step-up flows.

## Category
Security

## Problem
MCP clients increasingly derive OAuth scopes from multiple sources: explicit client configuration, Protected Resource Metadata, Authorization Server Metadata, `WWW-Authenticate` challenges, prior grants, refresh state, and runtime step-up requests. When one source overwrites rather than merges with another, a client can silently lose scopes the operator explicitly required. A current example is loss of `offline_access`, which prevents refresh-token issuance and breaks scheduled/background MCP use after access-token expiry.

## Why it matters now
The MCP 2026-07-28 authorization specification explicitly defines refresh-token guidance and client-side scope accumulation for step-up authorization. On 2026-08-24, a Hermes Agent report showed explicit per-server scope being overwritten when server metadata exposed `scopes_supported`. Separately, the MCP TypeScript SDK has an open issue where step-up authorization can dead-end when a refresh token already exists. These indicate that scope state is not yet a uniformly reliable end-to-end invariant across clients and SDKs.

## Affected users
- Developers building MCP clients and gateways.
- Teams running scheduled/background agents that depend on refresh tokens.
- Platform builders integrating heterogeneous OAuth-protected MCP servers.
- Operators who configure least-privilege scopes or require explicit refresh/offline behavior.

## Current public evidence

### Observed evidence
1. NousResearch/hermes-agent issue #93719, opened 2026-08-24: an explicit per-server MCP OAuth scope is overwritten by server metadata during auth flow, including cases where `offline_access` is needed for refresh-token issuance. https://github.com/NousResearch/hermes-agent/issues/93719
2. modelcontextprotocol/typescript-sdk issue #2255: a 403 `insufficient_scope` step-up flow can terminate with `SdkHttpError` instead of reauthorization when a refresh token is present. https://github.com/modelcontextprotocol/typescript-sdk/issues/2255
3. MCP 2026-07-28 authorization specification: clients MAY request `offline_access` when supported, MUST NOT assume refresh tokens are issued, and scope accumulation across step-up operations is explicitly a client responsibility. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
4. Hermes issue #84843, opened 2026-08-12, reports scheduled/background MCP jobs failing after refresh state becomes unusable, with manual reauthorization required. While its root cause is not scope overwrite, it independently demonstrates the operational severity of losing refresh survivability in non-interactive agents. https://github.com/NousResearch/hermes-agent/issues/84843

## Interpretation
The recurring engineering weakness is not merely “OAuth is hard.” MCP clients lack a deterministic scope-intent ledger that separates operator-required scopes from server-advertised scopes, previously granted scopes, and transient step-up requirements. Without explicit provenance and merge semantics, implementations can replace authoritative client intent, downgrade refresh behavior, or retry with inconsistent scope sets.

## Existing approaches
- OAuth/OIDC discovery via Authorization Server Metadata.
- Protected Resource Metadata and `WWW-Authenticate` scope challenges.
- SDK-managed refresh and step-up logic.
- Explicit per-server configuration in clients such as Hermes.
- Manual reauthentication when refresh or scope state fails.

## Remaining limitations
- Configuration and metadata can be merged with implicit precedence rules that are not visible to operators.
- A scope can disappear between initial authorization and reauthorization without a deterministic guard.
- Refresh-token presence can interact badly with step-up paths.
- Non-interactive jobs often discover the problem only after expiry, when no browser/user is available.
- Existing logs may show the final requested scope but not where each scope came from.

## Root-cause analysis
1. Scope sets from different trust/provenance layers are represented as one mutable value.
2. Replacement is simpler than union-with-policy, so later discovery data can erase explicit intent.
3. Refresh and step-up paths are often implemented separately and do not share one scope state machine.
4. Tests emphasize successful interactive authorization, not long-lived background survivability.
5. Operators lack preflight checks proving that required scopes survive discovery and refresh planning.

## Improvement opportunity
Introduce a scope-intent contract with provenance. Explicit required scopes are immutable unless the operator changes configuration. Server metadata constrains what may be requested but does not silently delete required client intent. Runtime step-up adds scopes by union. Before browser launch or token refresh, a deterministic checker computes the effective scope set and blocks impossible or regressive states with actionable diagnostics.

## Proposed solution
This package provides a deterministic scope-set analyzer, policy rules, an OAuth verification agent, pre-auth hook guidance, tests, and a bounded diagnosis/hardening workflow. It does not perform OAuth or store credentials.

## Goal
Prevent silent loss of required MCP OAuth scopes and detect refresh/step-up regressions before they break non-interactive workloads.

## Metrics
- `required_scope_loss_count` = 0.
- `% auth attempts with provenance-complete effective scope set` = 100%.
- `% background scenarios surviving access-token expiry without unexpected interactive reauth`.
- `scope_regression_block_count` during preflight.
- Step-up tests passing for union semantics.

## Trigger
Before initial OAuth authorization, reauthorization, refresh planning, config reload, server metadata refresh, or handling a 403 `insufficient_scope` challenge.

## Inputs
Explicit required scopes, optional desired scopes, server-supported scopes, previously granted scopes, runtime challenge scopes, and policy flags.

## Outputs
Effective scope set, provenance map, warnings, blocking errors, and machine-readable verification result.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/93719
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2255
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
- https://github.com/NousResearch/hermes-agent/issues/84843
