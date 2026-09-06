# Sample Applications and Reference Implementations

## Purpose
Create trustworthy sample applications that demonstrate realistic AI integration patterns, production concerns, and platform conventions without becoming repository-specific templates.

## When to use
Use when developers need working examples for APIs, agents, retrieval, streaming, tool calling, evaluation, deployment, or authentication.

## Inputs
Target workflow, supported SDKs, architectural guidance, API contracts, deployment targets, security requirements, and documentation goals.

## Context to inspect
Inspect existing samples, support requests, common implementation mistakes, SDK capabilities, deployment guidance, test infrastructure, and dependency versions.

## Core knowledge
A sample is executable documentation and will be copied into production. It therefore needs secure defaults, realistic error handling, dependency hygiene, configuration separation, and an explicit statement of what is simplified. Reference implementations should demonstrate principles rather than company-specific architecture.

## Procedure
1. Define the exact concept the sample teaches.
2. Minimize unrelated framework complexity.
3. Use current supported SDK and runtime versions.
4. Separate configuration and secrets from code.
5. Implement validation, timeouts, cancellation, and meaningful errors.
6. Include relevant retry or idempotency behavior.
7. Add observability hooks for model calls and tool execution.
8. Demonstrate safe handling of model output.
9. Add tests for critical behavior.
10. Document setup, expected result, architecture, and known simplifications.
11. Add automated dependency and smoke-test maintenance.
12. Revalidate after platform releases.

## Decision points
Use minimal samples for one concept and reference implementations for end-to-end architecture. Avoid adding frameworks merely to appear production-grade; every dependency should support the learning objective.

## Common failure patterns
Hard-coded secrets, no error handling, outdated SDK calls, unrealistic global state, unsafe tool execution, missing tests, and samples that silently depend on internal infrastructure.

## Verification
Clone into a clean environment, follow only documented steps, run tests, execute the happy and failure paths, scan for secrets, and verify supported dependency versions.

## Expected output
A runnable, maintained sample or reference implementation with clear scope, secure defaults, tests, and explanatory documentation.

## Stop conditions
Stop when the sample requires proprietary infrastructure, cannot demonstrate secure credential handling, or depends on unstable APIs without explicit version pinning.