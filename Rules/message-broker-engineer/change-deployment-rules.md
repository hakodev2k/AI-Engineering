# Change and Deployment Safety

## Purpose
Prevent broker and topology changes from causing avoidable production incidents.

## Scope
Configuration, upgrades, topology changes, rolling deployment, and rollback.

## MUST
- Production changes MUST have impact analysis, validation, observability, rollback or recovery plan, and authorized approval.
- Version upgrades MUST verify client, protocol, schema, and feature compatibility.
- Changes MUST be staged to limit blast radius where feasible.

## MUST NOT
- MUST NOT perform irreversible production changes without explicit approval.
- MUST NOT combine unrelated high-risk broker changes into one rollout without justification.

## SHOULD
- Prefer declarative, reviewed configuration and canary or phased rollout.

## Exceptions
Emergency changes require incident authority, recorded rationale, and post-change review.

## Verification
Inspect change records, diffs, compatibility tests, rollout telemetry, and rollback evidence.