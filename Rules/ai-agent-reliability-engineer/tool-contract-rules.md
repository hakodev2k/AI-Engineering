# Tool Contract Rules

## Purpose
Ensure tools exposed to agents behave as stable, explicit, testable contracts rather than ambiguous natural-language capabilities.

## Scope
Applies to internal functions, APIs, connectors, MCP tools, plugins, commands, and external services callable by an agent.

## MUST
- Tool schemas MUST define required and optional arguments, valid ranges, side effects, return semantics, and error conditions.
- Destructive or irreversible behavior MUST be clearly represented in the tool contract.
- Tool responses MUST distinguish success, partial success, retryable failure, permanent failure, and authorization failure where relevant.
- Contract changes that can alter agent behavior MUST be versioned or compatibility-reviewed.
- Tool timeouts and retry semantics MUST be defined before production use.

## MUST NOT
- Tool names or descriptions MUST NOT imply guarantees that the implementation cannot enforce.
- Agents MUST NOT parse unstructured output when a stable structured contract is practical.
- Tool wrappers MUST NOT hide partial failures behind a generic success response.

## SHOULD
- Schemas SHOULD minimize ambiguous free-text parameters for high-risk actions.
- Tool contracts SHOULD include idempotency guidance and correlation identifiers.

## Exceptions
Any exception requires rationale, risk assessment, compatibility evidence, and owner approval when it affects production side effects.

## Verification
Review schemas, contract tests, error-path tests, version diffs, integration tests, and sampled production traces for contract conformance.