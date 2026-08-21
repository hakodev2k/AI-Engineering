# Tool Design and Contracts

## Purpose
Design agent tools that are predictable, minimal, safe, and easy for models to call correctly.

## When to use
Use when exposing APIs, functions, MCP tools, databases, or external actions to an agent.

## Inputs
Operation goals, API contracts, schemas, permissions, error semantics, side effects.

## Context to inspect
Existing endpoints, auth model, rate limits, retries, validation, audit requirements, and downstream SLAs.

## Core knowledge
Models perform better with narrow tools, explicit schemas, stable semantics, and actionable errors. Read and write capabilities should be distinguishable; destructive actions need stronger controls.

## Procedure
1. Define one clear capability per tool.
2. Minimize required parameters and ambiguity.
3. Use typed inputs and bounded enums where possible.
4. Describe side effects and preconditions explicitly.
5. Validate inputs server-side.
6. Return compact structured results and stable error categories.
7. Add idempotency for retryable writes.
8. Apply least privilege and audit sensitive calls.
9. Test malformed, partial, duplicate, timeout, and permission cases.
10. Evaluate tool-selection accuracy with representative tasks.

## Decision points
Combine operations only when they form one atomic business action. Prefer separate read/write tools when permissions or risk differ.

## Common failure patterns
Huge generic tools, opaque string parameters, leaking raw backend errors, hidden side effects, missing idempotency, and trusting model validation.

## Verification
Measure correct tool selection, argument validity, error recovery, permission enforcement, and duplicate-call safety.

## Expected output
A versioned tool contract with schemas, semantics, authorization, failure behavior, and tests.

## Stop conditions
Stop if side effects cannot be bounded, authorization is undefined, or downstream semantics are unstable.