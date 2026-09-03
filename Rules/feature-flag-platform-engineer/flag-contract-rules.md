# Feature Flag Contract Rules

## Purpose
Keep flag semantics stable and understandable across producers, SDKs, services, and clients.

## Scope
Applies to flag keys, value types, defaults, variants, metadata, and evaluation contracts.

## MUST
- Flag keys MUST be globally unambiguous within their intended namespace.
- Value type, variant meaning, and default behavior MUST be defined before client adoption.
- Contract changes MUST be reviewed for backward compatibility across deployed SDK and application versions.
- Multi-variant flags MUST define the semantic meaning of every variant.
- Unknown or missing flag behavior MUST be deterministic.

## MUST NOT
- MUST NOT silently change a boolean flag into a materially different semantic contract.
- MUST NOT overload one flag to control unrelated capabilities.
- MUST NOT depend on undocumented variant values.

## SHOULD
- Contract definitions SHOULD be generated or validated from a canonical schema where practical.
- Names SHOULD express business or operational intent rather than implementation trivia.

## Exceptions
Breaking contract changes require a migration plan, affected-consumer inventory, rollout sequencing, and explicit approval.

## Verification
Use schema validation, code search, SDK contract tests, consumer inventory, and compatibility review.