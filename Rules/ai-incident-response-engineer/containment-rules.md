# Containment Rules

## Purpose
Limit ongoing harm from AI incidents while preserving evidence and avoiding unnecessary secondary failures.

## Scope
Applies to temporary mitigations such as disabling features, restricting tools, isolating models, blocking traffic, tightening policies, or failing over dependencies.

## MUST
- Containment MUST prioritize stopping credible ongoing harm before optimizing convenience or feature availability.
- Responders MUST identify the smallest safe containment boundary that materially reduces risk.
- High-risk containment actions MUST define expected impact, rollback conditions, and verification before execution.
- Tool-capable or autonomous AI systems MUST support a means to restrict or disable dangerous actions independently from ordinary model availability when feasible.
- Containment changes MUST be recorded with actor, time, scope, rationale, and observed result.
- Evidence needed for investigation MUST be preserved before destructive containment when doing so does not prolong unacceptable harm.

## MUST NOT
- Responders MUST NOT weaken authentication, authorization, safety controls, or auditability as a containment shortcut.
- Containment MUST NOT silently expand privileges or expose sensitive data.
- Temporary mitigations MUST NOT remain indefinitely without ownership and follow-up.

## SHOULD
- Prefer reversible controls such as feature flags, routing changes, rate limits, scoped disablement, or known-good rollback when they adequately contain risk.
- Predefined kill switches SHOULD be tested periodically for high-impact AI capabilities.

## Exceptions
Emergency actions may precede full documentation when delay would materially increase harm; rationale and evidence must be reconstructed immediately afterward.

## Verification
Inspect incident timeline, configuration diffs, audit logs, and post-containment metrics. Confirm the failure signal decreased and no unacceptable secondary impact was introduced.