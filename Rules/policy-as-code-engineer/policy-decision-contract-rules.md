# Policy Decision Contract Rules

## Purpose
Define stable and auditable contracts between policy evaluators and enforcement points.

## Scope
Applies to policy query inputs, decision outputs, reasons, obligations, metadata, errors, and contract evolution.

## MUST
- Every enforcement point MUST use a documented decision contract with defined input fields, output states, and error semantics.
- Decision outputs MUST distinguish allow, deny, indeterminate, and evaluation failure whenever those states have different operational meaning.
- Inputs that affect security decisions MUST have defined type, provenance, and normalization behavior.
- Breaking contract changes MUST be versioned or introduced through an approved compatibility migration.
- Decisions used for audit or incident investigation MUST expose policy version and sufficient reason metadata without leaking sensitive internals.
- Enforcement consumers MUST test their handling of every supported decision state.

## MUST NOT
- Missing required input MUST NOT be silently interpreted as a permissive value.
- Consumers MUST NOT infer authorization from transport success alone.
- A new output field or enum value MUST NOT be deployed if existing consumers can misinterpret it unsafely.
- Error responses MUST NOT expose secrets, credentials, or sensitive policy data.

## SHOULD
- Contracts SHOULD be machine-readable where practical.
- Decision reasons SHOULD use stable codes in addition to human-readable descriptions.
- Optional inputs SHOULD have explicit defaults or documented absence semantics.

## Exceptions
Compatibility exceptions require affected consumer inventory, risk analysis, migration plan, tests, and approval for security-sensitive decisions.

## Verification
Validate schemas, consumer tests, contract tests, backward-compatibility tests, generated examples, and runtime traces. Confirm malformed and missing inputs produce the documented non-permissive behavior.