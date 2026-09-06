# Routing Policy Rules

## Purpose
Define deterministic, reviewable rules for selecting models and providers for AI requests.

## Scope
Routing criteria, policy precedence, eligibility, fallbacks, overrides, and production behavior.

## MUST
- Every production route MUST declare the decision inputs it uses, such as task class, required capabilities, latency objective, quality threshold, policy constraints, and cost budget.
- Policy precedence MUST be explicit when multiple routing constraints conflict.
- Routing decisions that affect safety, privacy, compliance, or contractual obligations MUST use hard eligibility gates rather than soft preferences.
- Route changes MUST be versioned and attributable to a deployable configuration revision.
- A route MUST define behavior when no eligible target is available.

## MUST NOT
- MUST NOT route solely on cheapest price when quality, safety, residency, or latency requirements are unmet.
- MUST NOT silently bypass hard policy constraints during provider degradation.
- MUST NOT depend on undocumented manual conventions.

## SHOULD
- Prefer deterministic rules for high-risk traffic and measured adaptive routing for lower-risk workloads.
- Keep policy rules explainable enough for incident reconstruction.

## Exceptions
Exceptions require rationale, bounded scope, expiry, risk assessment, and accountable approval.

## Verification
Inspect route configuration, decision logs, policy tests, fail-closed cases, and configuration diffs.