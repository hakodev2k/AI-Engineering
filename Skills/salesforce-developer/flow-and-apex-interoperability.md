# Flow and Apex Interoperability

## Purpose
Design clean boundaries between declarative Flow automation and Apex so ownership, transaction behavior, bulk safety, and maintenance responsibility remain understandable.

## When to use
Use when extending Flow with invocable Apex, replacing complex Flow logic, or reviewing automation collisions.

## Inputs
Flows, Apex, automation requirements, data volume, error handling, admin ownership, transaction expectations.

## Context to inspect
Record-triggered flows, subflows, invocable methods, trigger handlers, order of execution, recursion, scheduled paths, fault connectors.

## Core knowledge
Flow and Apex share platform limits in many transactions. Declarative does not mean limit-free. Invocable Apex should expose stable collection-oriented contracts and avoid forcing Flow authors to understand internal implementation details.

## Procedure
1. Inventory automation touching the object/process.
2. Assign each business rule a primary owner.
3. Keep simple orchestration declarative when maintainable.
4. Move algorithmic, reusable, integration-heavy, or limit-sensitive logic to Apex where justified.
5. Design invocable inputs/outputs for collections and explicit errors.
6. Avoid Flow-Apex-Flow recursion cycles.
7. Define fault handling and operator visibility.
8. Test combined order of execution at realistic volume.

## Decision points
Prefer Flow for transparent business automation maintained by admins; prefer Apex for complex algorithms, reusable domain logic, advanced integrations, or stricter testability/performance control.

## Common failure patterns
Duplicated rules in Flow and Apex, one-record invocable methods, hidden recursion, swallowed Flow faults, and moving logic solely due to developer preference.

## Verification
Test bulk transactions, failure paths, recursion behavior, permissions, and maintainability of the combined design.

## Expected output
A clear automation ownership map and stable Flow/Apex contract.

## Stop conditions
Stop when rule ownership or admin/developer governance is unresolved and changes risk duplicate automation.