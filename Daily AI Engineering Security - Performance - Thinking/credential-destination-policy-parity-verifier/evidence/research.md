# Research

## Topic
Credential Destination Policy Parity Verifier

## Category
Security

## Problem
A credential-level destination allowlist can be correctly implemented in a primary request node yet omitted in alternate AI/LLM, MCP, GraphQL, or integration paths. If a user can choose an endpoint and use—but not view—a shared credential, that omission converts use-only access into secret exfiltration.

## Why it matters now
During June–July 2026, n8n published multiple advisories for the same security invariant failing in different execution paths. This is strong evidence of a recurring integration problem: adding new adapters expands the set of places where credential destination policy must be propagated and tested.

## Affected users
Workflow-platform maintainers, AI-agent platform builders, connector authors, security teams, and organizations that share credentials with lower-privileged workflow editors.

## Current public evidence

### Observed evidence
1. **GHSA-h44j-f5r5-ph73 / CVE-2026-59207**, published June 24, 2026: n8n AI Agents MCP Connector did not enforce `Allowed HTTP Request Domains`. A member-level user with use-only access to a shared credential could point an MCP tool at an external server and transmit the secret. Patched in 2.27.4 and 2.28.1.
2. **GHSA-64xh-79j6-r5v8**, published July 22, 2026: multiple AI/LLM nodes similarly bypassed the same credential restriction when a user-supplied base or endpoint URL was configured. Patched in 2.31.5 and 2.32.1.
3. **GHSA-gq66-9cw5-j5jm / CVE-2026-65596**, published July 2026: the GraphQL node failed to enforce the same restriction for HTTP-based credentials, unlike the HTTP Request node. Patched in 1.123.64, 2.29.8, and 2.30.1.

### Interpretation
Three distinct adapter families violating the same credential policy show that local fixes are insufficient as the only engineering control. The missing invariant is policy parity: every path that combines a credential with a user-selectable destination must apply canonical destination validation before secret materialization or transmission.

### Proposed solution
Use a repository-level adapter inventory plus deterministic parity gate. Each credential-consuming, user-endpoint-capable adapter must declare destination allowlisting, canonical host validation, redirect policy, and pre-secret enforcement, and must include a passing negative test for a disallowed destination.

## Existing approaches
- Upgrade to vendor-patched versions.
- Configure credential destination restrictions.
- Disable affected AI Agents modules while patching.
- Restrict shared credentials to trusted users.
- Audit sharing relationships.

## Remaining limitations
Vendor patches cover known paths but do not prove future or custom adapters inherit the same policy. Restricting sharing reduces exposure but defeats the use-only collaboration model. Network egress controls are useful defense-in-depth but can be broader or differently scoped than credential-specific intent. Tests limited to the primary HTTP adapter miss parity regressions elsewhere.

## Root-cause analysis
1. Destination policy is attached to a credential type but enforcement is implemented inside individual request adapters.
2. New adapters duplicate or bypass request construction rather than using one mandatory credential-egress boundary.
3. Secret attachment may occur before endpoint authorization, making later checks too late.
4. Test matrices are adapter-centric rather than invariant-centric.
5. Use-only shared credentials create a privilege boundary that ordinary happy-path tests do not exercise.

## Improvement opportunity
Make policy parity measurable. Inventory every adapter capable of combining credentials with user-controlled endpoints; require a common set of controls; add synthetic negative tests; and block deployment when any relevant adapter lacks proof.

## Goal
No lower-privileged user can cause a restricted shared credential to be transmitted to a destination outside its configured policy through any supported adapter.

## Metrics
Applicable adapter count; policy coverage percentage; negative-test coverage; critical/high findings; time-to-remediate; number of adapters verified before release.

## Trigger
New adapter/node/tool, credential-type change, endpoint override feature, AI/MCP integration, credential-sharing change, or security review.

## Inputs
Credential policy definitions, adapter inventory, endpoint ownership model, synthetic negative-test results, version/release information.

## Outputs
Parity report, blocking findings, remediation targets, verification record.

## Relevant sources
- https://github.com/n8n-io/n8n/security/advisories/GHSA-h44j-f5r5-ph73
- https://github.com/advisories/GHSA-h44j-f5r5-ph73
- https://github.com/n8n-io/n8n/security/advisories/GHSA-64xh-79j6-r5v8
- https://github.com/advisories/GHSA-gq66-9cw5-j5jm
- https://nvd.nist.gov/vuln/detail/CVE-2026-59207
- https://nvd.nist.gov/vuln/detail/CVE-2026-65596