# Frontend Code Review

## Purpose
Review frontend changes for correctness, maintainability, accessibility, security, performance, testing, and consistency while focusing attention on material risk.

## When to use
Use for pull requests, risky refactors, dependency changes, UI behavior changes, and architecture-sensitive modifications.

## Inputs
Change diff, requirements, tests, screenshots, architecture conventions, performance/security context, and affected APIs.

## Context to inspect
Changed code plus surrounding ownership boundaries, consumers, tests, API contracts, design system, browser support, and deployment implications.

## Core knowledge
Review should validate behavior and risk, not enforce personal style already covered by automation. Senior review considers hidden states, lifecycle, accessibility, async races, compatibility, and operational consequences.

## Procedure
1. Understand the user/business outcome and scope.
2. Identify high-risk boundaries: auth, data mutation, shared state, routing, rendering of untrusted data, shared components, and performance-critical paths.
3. Trace data/state flow through the change.
4. Check loading, error, empty, disabled, and concurrency states.
5. Review semantic HTML, keyboard behavior, and accessibility impact.
6. Check security and privacy boundaries.
7. Assess rendering/network/bundle impact where material.
8. Verify tests prove behavior rather than implementation.
9. Distinguish blocking defects from optional improvements.
10. Re-review resolved findings and evidence.

## Decision points
Block changes for correctness, security, accessibility, compatibility, or material maintainability risk. Prefer follow-up work for bounded non-critical improvements rather than expanding scope indefinitely.

## Common failure patterns
Style-only reviews, reviewing diff without context, missing negative states, requesting speculative abstractions, ignoring generated bundle/API impact, and approving because tests merely exist.

## Verification
Blocking findings have evidence, required tests/builds pass, critical workflows are covered, and review comments are resolved or explicitly accepted.

## Expected output
Actionable review feedback prioritized by severity and tied to observable risk.

## Stop conditions
Stop and request escalation when requirements are unavailable for a behavior-changing change, security impact requires specialist approval, or the diff is too large to review safely without decomposition.