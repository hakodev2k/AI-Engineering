# Production Release Safety Rules

## Purpose
Make NLP production changes reversible, observable, and explicitly authorized.

## Scope
Model releases, configuration, datasets, thresholds, indexes, migrations, canaries, rollback, and approvals.

## MUST
- Material production changes MUST have defined acceptance signals, rollback criteria, and an identified prior safe state.
- Human approval MUST precede production deployment, destructive data operations, breaking contracts, weakened security controls, or irreversible migrations when the actor is an AI agent or lacks explicit standing authority.
- Canary or staged rollout MUST be used when blast radius or uncertainty justifies it.
- Release evidence MUST identify model, tokenizer, configuration, index, and relevant data versions.

## MUST NOT
- MUST NOT silently promote an experiment directly to full production.
- MUST NOT destroy prior artifacts needed for rollback before the new release is proven stable.
- MUST NOT treat absence of alerts as proof of model quality.

## SHOULD
- High-risk releases SHOULD occur with active monitoring and an available rollback owner.
- Changes SHOULD be small enough to attribute regressions.

## Exceptions
Emergency changes require incident authority, recorded rationale, bounded scope, and retrospective verification.

## Verification
Inspect approval records, release manifests, canary metrics, rollback drills or procedures, artifact retention, post-release evaluation, and production telemetry.