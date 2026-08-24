# Trigger Architecture and Bulkification

## Purpose
Implement deterministic, bulk-safe trigger behavior with clear ordering, recursion control, and separation between event plumbing and business logic.

## When to use
Use for record-triggered Apex where declarative automation is insufficient, too complex, or requires transaction-level control.

## Inputs
Object events, business rules, related-object effects, expected batch size, automation inventory, recursion risks.

## Preconditions
Know all Flow, Process, workflow, trigger, and managed-package automation that can participate in the transaction.

## Context to inspect
Existing triggers, handler framework, order-of-execution dependencies, cross-object updates, async handoffs, validation rules, rollups, duplicate rules.

## Core knowledge
A trigger can receive up to bulk-sized record sets and can be re-entered through updates. Correct design treats trigger collections as the unit of work, collects keys first, performs bounded queries/DML, and avoids relying on invocation order that Salesforce does not guarantee across unrelated automation.

## Procedure
1. Map events to business invariants.
2. Identify whether before or after timing is required.
3. Keep one trigger entry point per object where practical.
4. Pass full collections into handlers.
5. Build sets/maps of keys before querying.
6. Execute no SOQL or DML inside record loops.
7. Make recursion prevention based on processed work, not a single global boolean.
8. Defer expensive/non-transactional work asynchronously when safe.
9. Test insert, update, delete, undelete, partial data, and bulk batches as applicable.
10. Validate interactions with Flow and other automation.

## Decision points
Use before triggers for same-record field derivation without extra DML. Use after triggers when record IDs or committed relationship state are required. Prefer Flow for straightforward declarative business automation when maintainability is better.

## Common failure patterns
Single-record assumptions, static Boolean recursion guards, order-of-execution coupling, duplicate DML, cross-object ping-pong, and trigger handlers that hide unbounded queries.

## Verification
Run bulk tests near platform batch sizes, assert expected side effects exactly once, inspect limits, and test coexistence with declarative automation.

## Expected output
A thin trigger plus bulk-aware handlers with explicit recursion and side-effect semantics.

## Stop conditions
Stop when automation ownership is unknown, transaction cycles cannot be bounded, or the design requires limits that exceed synchronous Apex capacity.