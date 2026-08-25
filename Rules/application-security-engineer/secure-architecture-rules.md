# Secure Architecture Rules

## Purpose
Protect system trust boundaries and security invariants through architecture that remains defensible under failure and attack.

## Scope
Applies to application decomposition, service boundaries, trust relationships, privileged components, integration patterns, and security control placement.

## MUST
- Security invariants MUST be enforced at authoritative boundaries, not only in clients or presentation layers.
- Privileged components MUST expose the minimum capability and attack surface required for their function.
- Cross-boundary calls MUST authenticate the caller and authorize the requested action using server-side policy.
- Designs MUST define failure behavior for unavailable identity, policy, key-management, and security dependencies.
- Sensitive operations MUST have explicit ownership, auditability, and a documented trust model.
- Significant security architecture changes MUST record constraints, alternatives, residual risk, and rollback or migration considerations.

## MUST NOT
- MUST NOT rely on obscurity, network location, UI restrictions, or undocumented conventions as primary access controls.
- MUST NOT create shared privileged services that bypass tenant, environment, or authorization boundaries for convenience.
- MUST NOT weaken a security boundary merely to simplify integration without approved risk acceptance.

## SHOULD
- SHOULD minimize state and privilege in internet-facing components.
- SHOULD choose simple, centrally understandable security invariants over duplicated ad hoc controls.

## Exceptions
Any exception affecting a trust boundary requires documented rationale, alternatives considered, compensating controls, verification evidence, residual risk, and accountable approval.

## Verification
Use architecture review, dependency diagrams, data-flow inspection, architecture tests where feasible, configuration review, and targeted adversarial tests to verify boundaries and invariants.