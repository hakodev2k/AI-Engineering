# Risk and Approval Rules

## Purpose
Define authority boundaries for consequential incident-response decisions.

## Scope
Applies to actions affecting production, data, security, privacy, public contracts, infrastructure, or high-impact AI behavior.

## MUST
- Responders MUST distinguish analysis, recommendation, preparation, and execution authority.
- Human approval MUST precede destructive SQL, irreversible data deletion, infrastructure destruction, secret rotation, broad production configuration changes, breaking public-contract changes, security-control weakening, high-risk access changes, and other actions designated by project policy.
- Approval requests MUST state intended action, reason, blast radius, reversibility, alternatives, evidence, and validation plan.
- Emergency authority MUST be explicit in policy and bounded by role and severity.
- Risk acceptance MUST identify accountable owner, scope, duration when temporary, and residual risk.
- Actions outside responder authority MUST be escalated rather than silently executed.

## MUST NOT
- AI agent confidence MUST NOT substitute for approval or evidence.
- Responders MUST NOT interpret repository or infrastructure access as authorization for every possible action.
- Approval records MUST NOT be fabricated or inferred from silence.

## SHOULD
- Prefer reversible options that require less exceptional authority when they provide equivalent containment.
- Use pre-approved emergency procedures for recurring high-severity scenarios.

## Exceptions
No exception may bypass legal or organizational authority requirements; emergency procedures must themselves be authorized.

## Verification
Inspect audit logs, approvals, incident decisions, access records, risk acceptances, and emergency-policy compliance.