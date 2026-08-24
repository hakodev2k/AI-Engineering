# Apex Core and Design

## Purpose
Build maintainable Apex code that respects Salesforce's transaction model, type system, governor limits, and multi-tenant runtime.

## When to use
Use for services, domain logic, controllers, trigger handlers, integration adapters, and reusable platform utilities. Do not use Apex when declarative automation is materially simpler and equally testable.

## Inputs
Requirement, repository, Apex classes, object model, transaction context, expected data volume, security requirements.

## Preconditions
Understand which execution context invokes the code and which limits apply.

## Context to inspect
Existing layering, naming conventions, selectors/services, trigger framework, sharing declarations, test factories, custom metadata, error handling, package boundaries.

## Core knowledge
Apex is strongly typed and Java-like, but runs inside a governor-limited multi-tenant transaction. Design must minimize queries/DML, avoid hidden side effects, handle bulk inputs, and keep security semantics explicit. Static state lasts only for the transaction and can hide recursion defects.

## Procedure
1. Identify the business invariant and transaction boundary.
2. Inspect existing abstractions before adding a new pattern.
3. Separate orchestration, data access, domain decisions, and side effects where useful.
4. Design APIs around collections, not single records, when data-triggered execution is possible.
5. Keep SOQL and DML outside loops.
6. Make nullability, error behavior, and partial-failure semantics explicit.
7. Declare sharing behavior intentionally.
8. Avoid unnecessary static/global exposure.
9. Add focused tests for success, boundary, bulk, and failure paths.
10. Measure query, DML, CPU, and heap consumption for realistic volumes.

## Decision points
Prefer small composable services over generic frameworks unless multiple modules need the abstraction. Use custom metadata for deployable configuration; use custom settings or records only when runtime mutability is required.

## Common failure patterns
One-record assumptions, query/DML in loops, overuse of static flags, excessive inheritance, hidden security bypass, catch-and-ignore exceptions, and logic coupled directly to UI or trigger context.

## Verification
Code compiles; tests cover representative bulk inputs; limit consumption remains safely below thresholds; CRUD/FLS/sharing expectations are validated; no unbounded recursion occurs.

## Expected output
Apex implementation with explicit transaction, limit, error, security, and test behavior.

## Stop conditions
Stop when requirements depend on unclear data ownership, unsafe privilege elevation, or transaction volume that cannot fit platform limits without architectural change.