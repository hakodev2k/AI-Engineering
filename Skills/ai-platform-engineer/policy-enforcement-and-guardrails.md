# Policy Enforcement and Guardrails

## Purpose
Implement centralized, auditable policy enforcement for AI platform use without forcing every product team to reimplement organizational controls.

## When to use
Use when model access, data handling, tool execution, provider routing, or release behavior must comply with security, privacy, legal, or governance requirements.

## Inputs
- Organizational AI policies
- Data classifications
- Model/provider approvals
- Tenant identities
- Tool and action risk classifications
- Exception process

## Context to inspect
Inspect gateway policies, application-level checks, provider settings, tool permissions, logs, current exceptions, blocked incidents, and policy ownership.

## Core knowledge
Guardrails are layered controls, not a single classifier. Deterministic authorization and data rules should remain deterministic. Model-based moderation can supplement but should not replace enforceable identity, data residency, least privilege, or approval controls.

## Procedure
1. Translate policy statements into enforceable rules and advisory guidance.
2. Identify the most reliable enforcement point for each rule.
3. Separate request-time controls from release-time and administrative controls.
4. Use authoritative identity and resource metadata.
5. Enforce approved model/provider and region constraints.
6. Enforce data-classification and tool-permission boundaries.
7. Define explicit deny behavior and safe error messages.
8. Log policy decisions with rule version and request correlation.
9. Create controlled exception workflows with expiration.
10. Test bypass paths and conflicting rules.
11. Monitor false positives, false negatives, and bypass attempts.
12. Version policies and roll out changes safely.

## Decision points
Use hard blocking for security, legal, and privilege boundaries; use warnings or review queues for uncertain quality policies. Keep product-specific safety logic in products unless it is genuinely reusable across workloads.

## Common failure patterns
Prompt-only enforcement, undocumented exceptions, policy checks after sensitive data leaves the boundary, inconsistent rules across SDKs, unversioned policy changes, and fail-open behavior during policy-service outages.

## Verification
Verify positive and negative authorization cases, rule version logging, exception expiry, fail-safe behavior, region/provider enforcement, and adversarial bypass tests.

## Expected output
Versioned platform policy controls with clear enforcement points, audit trails, exception handling, and tested failure behavior.

## Stop conditions
Stop when a policy cannot be translated unambiguously, the platform lacks authoritative identity/data metadata, or enforcement would conflict with binding legal or security requirements.