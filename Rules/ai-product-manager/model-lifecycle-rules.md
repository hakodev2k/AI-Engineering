# Model Lifecycle Rules

## Purpose
Ensure model, prompt, policy, and retrieval changes are managed as product changes with controlled compatibility and retirement.

## Scope
Applies to model upgrades, prompt revisions, retrieval changes, deprecations, fallback models, and behavior-version transitions.

## MUST
- User-visible AI behavior MUST have an identifiable version or change record sufficient to investigate regressions.
- Material lifecycle changes MUST define migration, compatibility, evaluation, rollout, rollback, and communication requirements.
- Deprecated models or capabilities MUST have an owner, retirement date, affected dependency inventory, and customer-impact plan when applicable.
- Emergency provider or model substitutions MUST preserve critical safety and policy constraints.

## MUST NOT
- MUST NOT replace a production model solely because a newer version exists.
- MUST NOT remove a fallback or legacy path before confirming dependent workflows are migrated.
- MUST NOT assume prompt compatibility across model versions without regression evidence.

## SHOULD
- Lifecycle decisions SHOULD consider quality, safety, cost, latency, support horizon, and strategic dependency risk together.
- Behavior changes SHOULD be staged to isolate regressions.

## Exceptions
Exceptions require urgency, affected users, residual risk, rollback plan, and accountable approval.

## Verification
Inspect model and prompt version records, dependency inventories, evaluation reports, deprecation plans, rollout controls, and communication artifacts.