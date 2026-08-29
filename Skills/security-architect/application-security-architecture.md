# Application Security Architecture

## Purpose
Establish reusable application security patterns for trust boundaries, validation, authorization, sensitive operations, and secure integration.

## When to use
Use during application design, platform standardization, major refactoring, API programs, and security reviews.

## Inputs
Application architecture, APIs, data model, identity flows, threat model, deployment model, dependencies, business-critical operations.

## Preconditions
The application's major components, actors, and sensitive functions are known.

## Context to inspect
Authentication middleware, authorization decisions, validation layers, session handling, file processing, outbound calls, dependency management, and error behavior.

## Core knowledge
Security architecture should make safe behavior the default. Authorization belongs at enforceable service boundaries; validation must reflect context; sensitive workflows need anti-abuse and audit controls.

## Procedure
1. Identify security-sensitive entry points and operations.
2. Define authentication and authorization boundaries.
3. Specify validation and canonicalization responsibilities.
4. Design secure session and state handling.
5. Protect sensitive data in memory, storage, and transit.
6. Define safe outbound integration and dependency patterns.
7. Establish error-handling and audit requirements.
8. Add anti-automation or transaction protections where business risk warrants them.
9. Define security testing and review gates.

## Decision points
Centralize controls when consistency matters, but keep authorization close enough to business rules to avoid context loss. Avoid custom security mechanisms when mature platform capabilities exist.

## Common failure patterns
UI-only authorization, inconsistent validation, insecure defaults, security hidden in conventions, excessive trust in internal services, and missing audit trails.

## Verification
Validate negative authorization cases, malformed inputs, session lifecycle, sensitive data handling, and security regression tests.

## Expected output
A documented application security architecture with enforceable patterns and validation criteria.

## Stop conditions
Stop when business authorization rules are undefined, the application boundary is unclear, or required controls would alter critical behavior without owner approval.