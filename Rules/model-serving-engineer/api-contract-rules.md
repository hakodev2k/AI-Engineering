# API Contract Rules

## Purpose
Keep inference interfaces stable, explicit, and safe for clients.

## Scope
Applies to request schemas, response schemas, streaming contracts, errors, limits, and versioning.

## MUST
- Validate request shape, size, supported parameters, and model-specific constraints before execution.
- Define stable error semantics that distinguish client failures, admission failures, dependency failures, and model execution failures.
- Version breaking contract changes deliberately.
- Specify streaming termination, cancellation, and partial-result behavior.

## MUST NOT
- Leak internal stack traces, secrets, or infrastructure details through API errors.
- Change defaults or response structure in ways that silently alter client behavior.
- Accept unbounded inputs when resource usage scales with input size.

## SHOULD
- Provide machine-readable limits and capability metadata where practical.
- Preserve backward compatibility through additive evolution when feasible.

## Exceptions
Breaking changes require migration guidance, impact assessment, rollout plan, and approval from contract owners.

## Verification
Use schema validation, contract tests, compatibility diffs, client fixtures, and negative-input testing.