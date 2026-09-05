# Analytics Documentation Rules

## Purpose
Make analytical models, metrics, assumptions, and operational behavior understandable without relying on tribal knowledge.

## Scope
Applies to model documentation, column definitions, metric specifications, runbooks, ownership, and deprecation guidance.

## MUST
- Published datasets MUST document purpose, grain, key fields, ownership, and material limitations.
- Business-critical derived fields and metrics MUST document their semantics and source assumptions.
- Operationally critical pipelines MUST have runbooks covering common failures, recovery, and escalation.
- Documentation MUST be updated in the same change when semantics or operating procedures materially change.
- Deprecations MUST identify replacement guidance and expected removal timing when consumers are affected.

## MUST NOT
- MUST NOT document incorrect certainty when assumptions or limitations are known.
- MUST NOT use documentation as a substitute for automated validation of enforceable contracts.
- MUST NOT leave critical ownership or metric meaning discoverable only through private knowledge.

## SHOULD
- Generate reference documentation from code and metadata where practical.
- Include examples for non-obvious grains, filters, and time semantics.

## Exceptions
Temporary documentation gaps require owner, scope, risk, and a dated remediation action.

## Verification
Review catalog entries, model docs, runbooks, ownership metadata, change diffs, and deprecation notices.