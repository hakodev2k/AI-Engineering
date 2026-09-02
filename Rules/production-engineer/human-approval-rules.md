# Human Approval Rules

## Purpose
Define authority boundaries for production actions with material, destructive, irreversible, or security-sensitive impact.

## Scope
Applies to engineers, agents, automation, deployment systems, administrative tools, and emergency procedures acting on production.

## MUST
- Human approval MUST be obtained before production deployment, destructive data operations, irreversible migrations, infrastructure destruction, secret rotation, material production configuration changes, breaking public contracts, security-control weakening, force push or history rewriting, and high-risk access changes unless a formally approved policy explicitly delegates that action.
- Approval requests MUST state the proposed action, scope, expected impact, evidence, rollback or recovery path, and known risks.
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Automated or AI-driven systems MUST remain within explicitly delegated authority and MUST stop when required approval is absent or ambiguous.

## MUST NOT
- MUST NOT infer approval from silence, urgency, prior approval of a different action, or access capability.
- MUST NOT split one high-risk action into smaller steps to evade approval requirements.
- MUST NOT weaken approval controls merely to accelerate routine work.

## SHOULD
- Prefer approval mechanisms that are attributable, time-bounded, and linked to the exact change.
- Use two-person review for exceptionally high-blast-radius actions where practical.

## Exceptions
Emergency authority must be predefined where possible. Any emergency override requires recorded justification, minimized scope, auditable execution, and retrospective review.

## Verification
Inspect change records, approval logs, IAM policies, deployment controls, audit trails, emergency overrides, and evidence that executed scope matched approved scope.
