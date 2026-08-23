# Contract Testing

## Purpose
Verify compatibility between service consumers and providers without relying exclusively on expensive end-to-end environments.

## When to use
Use for independently deployed APIs, events, schemas, and third-party-facing contracts.

## Inputs
API/event contracts, consumer expectations, provider implementation, versioning policy.

## Context to inspect
Inspect schemas, optionality, defaults, error semantics, version history, consumers, and deployment independence.

## Core knowledge
Contracts protect observable behavior, not internal implementation. Consumer-driven and schema-based approaches solve different coordination problems. Compatibility rules must be explicit.

## Procedure
1. Identify contract owners and consumers.
2. Define observable request/response or event guarantees.
3. Capture representative success and failure interactions.
4. Encode compatibility checks.
5. Run consumer checks before publication.
6. Verify provider against contracts in CI.
7. Publish/version contract artifacts where appropriate.
8. Block incompatible changes or coordinate migrations.
9. Remove obsolete contracts only after consumer evidence.

## Decision points
Use consumer-driven contracts when consumer expectations vary; schema validation is often enough for stable standardized interfaces.

## Common failure patterns
Testing implementation details, ignoring error contracts, treating schema validity as semantic compatibility, and deleting old versions prematurely.

## Verification
Demonstrate provider and active consumers pass the same versioned compatibility rules.

## Expected output
Executable contracts integrated into delivery workflows.

## Stop conditions
Escalate when ownership or backward-compatibility policy is undefined.