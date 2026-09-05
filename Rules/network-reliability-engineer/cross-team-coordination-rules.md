# Cross-Team Coordination Rules

## Purpose
Prevent reliability failures caused by unclear ownership, uncommunicated dependencies, or conflicting changes across teams.

## Scope
Network changes that involve application teams, platform teams, cloud owners, vendors, or shared infrastructure owners.

## MUST
- Material cross-team dependencies MUST have an identified owner and escalation path.
- Changes that can affect dependent teams MUST communicate expected impact, timing, and validation requirements before execution.
- Conflicting concurrent changes MUST be identified and sequenced when they can obscure diagnosis or increase risk.
- Shared incidents MUST establish a single coordination channel and clear decision ownership.
- Handoffs MUST preserve unresolved risks, current evidence, and next actions.

## MUST NOT
- MUST NOT assume another team has validated an undocumented dependency.
- MUST NOT close shared incidents while ownership of unresolved risk is ambiguous.
- MUST NOT omit known downstream impact from change review.

## SHOULD
- Maintain dependency contacts for critical services.
- Use shared post-incident actions when fixes cross organizational boundaries.

## Exceptions
Urgent coordination gaps require explicit owner assignment and follow-up documentation.

## Verification
Review change communications, ownership records, incident timelines, dependency maps, and handoff notes.