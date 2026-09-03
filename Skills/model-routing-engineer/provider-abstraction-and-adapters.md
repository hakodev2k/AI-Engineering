# Provider Abstraction and Adapters

## Purpose
Create stable provider-neutral interfaces so routing logic can switch models without leaking vendor-specific semantics into calling applications.

## When to use
Use when multiple providers or deployment backends must be routed behind a consistent contract.

## Inputs
Provider APIs, authentication methods, request/response schemas, streaming semantics, tool-calling behavior, error catalogs.

## Context to inspect
Existing clients, retry middleware, response parsers, tool execution, tracing, secret management, and provider-specific extensions.

## Core knowledge
A useful abstraction normalizes common semantics while preserving explicit capability differences. Lowest-common-denominator interfaces can erase important features; leaky abstractions make routing unsafe.

## Procedure
1. Define a canonical request and response envelope.
2. Separate portable features from provider extensions.
3. Normalize roles, content parts, tools, structured output, usage, finish reasons, and errors.
4. Map timeouts and cancellation consistently.
5. Normalize streaming lifecycle events.
6. Preserve raw provider metadata for diagnosis without exposing it as application contract.
7. Implement contract tests for every adapter.
8. Test unsupported-feature behavior explicitly.
9. Version breaking canonical-contract changes.

## Decision points
Expose an extension mechanism when a provider feature has clear value but is not portable. Reject rather than silently degrade when a required feature is unsupported.

## Common failure patterns
Semantic mismatch in tool calls, lost finish reasons, inconsistent cancellation, retries hidden inside adapters, and silently dropping unsupported parameters.

## Verification
Verify adapter contract tests, streaming parity, error normalization, cancellation behavior, and round-trip preservation of required semantics.

## Expected output
A provider-neutral inference contract with tested adapters and explicit capability exceptions.

## Stop conditions
Stop when provider behavior cannot be represented safely without changing the canonical contract.