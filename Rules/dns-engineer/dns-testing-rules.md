# DNS Testing Rules

## Purpose
Require deterministic evidence that DNS behavior matches intent.

## Scope
Zone changes, server configuration, migrations, security controls, and failure handling.

## MUST
- Tests MUST cover authoritative answers, recursive resolution, negative responses, and relevant security behavior for changed paths.
- Critical migrations MUST test rollback and at least one realistic failure scenario.
- Tests MUST distinguish expected cached behavior from authoritative state.

## MUST NOT
- MUST NOT validate production DNS solely with local host lookup behavior.
- MUST NOT ignore intermittent failures without bounding their cause and impact.

## SHOULD
- Reusable DNS checks SHOULD run in CI or pre-deployment validation where feasible.

## Exceptions
Manual-only validation requires documented evidence and reviewer acceptance.

## Verification
Inspect test results, query transcripts, external probes, failure simulations, and CI evidence.