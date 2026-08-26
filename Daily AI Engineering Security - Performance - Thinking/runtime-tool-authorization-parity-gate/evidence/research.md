# Research — Runtime Tool Authorization Parity Gate

**Category:** Security  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Runtime authorization must enforce the same per-request tool boundary shown to the model.

## Problem
Agent frameworks may advertise a restricted tool set to the model but still dispatch a non-advertised tool through a broader resolver. This turns presentation-time scoping into a misleading security boundary and can enable privilege escalation.

## Why it matters now
Spring published CVE-2026-59318 on August 20, 2026 for exactly this failure in Spring AI: under certain conditions, a tool not made available to the current request could still be invoked. The issue is classified as incorrect authorization (CWE-863). Separately, current OWASP and Microsoft guidance recommends explicit per-tool runtime authorization and warns against relying on model output or tool exposure alone as authorization.

## Affected users
Agent-framework maintainers, Spring AI users, platform teams, MCP/tool gateway builders, and teams exposing tools with per-request scopes.

## Current public evidence

### Observed evidence
1. Spring advisory, CVE-2026-59318, published 2026-08-20: Spring AI's per-request tool list was not fully enforced at dispatch, allowing a non-advertised tool to be invoked under certain conditions. Fixed versions include 2.0.1, 1.1.9 and 1.0.10.  
   https://spring.io/security/cve-2026-59318/
2. OWASP AI Agent Security Cheat Sheet recommends minimum tool sets, explicit per-tool authorization, independent validation before execution, fail-closed behavior, and tests proving unauthorized tools are denied even when the model requests them.  
   https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html
3. Microsoft AI defense guidance updated August 2026 says every callable tool should receive explicit authorization and that tool invocations are separate trust decisions bound to initiating principal and task.  
   https://learn.microsoft.com/en-us/security/zero-trust/catalog-ai-defense-capabilities/identity-access-least-privilege

### Interpretation
The root failure is authorization drift between model-visible capability scope and execution-time capability scope. A tool list is not an authorization control unless the dispatcher enforces the same set under the same request context.

## Existing approaches
- Upgrade affected Spring AI versions.
- Limit globally registered tools.
- Advertise only per-request tools.
- Require human approval for high-risk tools.
- Use policy middleware before execution.

## Remaining limitations
- A global resolver can still exceed per-request scope if the dispatch layer does not re-check membership.
- Human approval does not repair silent scope mismatch for lower-risk tools.
- Global allowlists are too coarse when authorization differs by request, user, tenant or workflow stage.
- Tests often verify what the model sees, not what the dispatcher can execute.

## Root-cause analysis
1. Tool discovery and tool dispatch are implemented as separate paths.
2. Dispatch falls back to a global registry/resolver.
3. Authorization context is not cryptographically or structurally bound to the dispatch request.
4. Runtime checks validate tool existence instead of request-scoped permission.
5. Regression suites omit adversarial calls for hidden/unadvertised tools.

## Improvement opportunity
Add a deterministic pre-dispatch parity gate that denies any requested tool absent from the exact request-scoped advertised set, verifies authorization and dispatch context identity, applies global policy, and requires approval for configured high-risk tools. Add regression fixtures that bypass model selection and call the dispatcher directly.

## Relevant sources
- Spring CVE-2026-59318: https://spring.io/security/cve-2026-59318/
- OWASP AI Agent Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html
- Microsoft Identity, Access, and Least Privilege for AI: https://learn.microsoft.com/en-us/security/zero-trust/catalog-ai-defense-capabilities/identity-access-least-privilege
