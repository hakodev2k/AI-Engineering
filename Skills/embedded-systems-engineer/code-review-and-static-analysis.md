# Embedded Code Review and Static Analysis

## Purpose
Review firmware for correctness, undefined behavior, concurrency hazards, hardware misuse, resource leaks, security defects, and maintainability before defects reach hardware or production.

## When to use
Use for pull requests, critical modules, compiler/toolchain upgrades, safety/security-sensitive changes, and recurring defect classes.

## Inputs
Diff, requirements, architecture, compiler warnings, static-analysis results, target constraints, tests, and relevant datasheets.

## Context to inspect
Inspect integer widths, signedness, bounds, pointer lifetime, volatile/register access, ISR context, concurrency, error paths, resource ownership, timeouts, stack usage, and hardware assumptions.

## Core knowledge
C/C++ firmware can compile while containing undefined behavior or target-specific assumptions. Review must combine language semantics with hardware execution context. Static analyzers amplify review but require triage rather than blind suppression.

## Procedure
1. Understand the behavioral intent and affected execution contexts.
2. Review boundary conditions and integer/pointer semantics.
3. Check concurrency, ISR, DMA, and ownership assumptions.
4. Check every wait/retry for bounds and failure behavior.
5. Validate register/peripheral sequences against authoritative documentation when changed.
6. Review memory/stack/flash impact.
7. Inspect warnings/static-analysis findings and suppress only with rationale.
8. Require tests proportional to risk.
9. Verify observability and recovery for new failure modes.

## Decision points
Request refactoring when complexity blocks confident review, but avoid unrelated redesign. Escalate findings involving safety/security contracts rather than approving based on local tests.

## Common failure patterns
Style-only review, trusting vendor examples blindly, ignoring compiler warnings, unsafe casts, hidden dynamic allocation, infinite polling, unreviewed ISR changes, and suppressing analyzer findings globally.

## Verification
Build with configured warnings/analyzers, run relevant tests, inspect binary size where material, and confirm review findings are resolved or explicitly accepted.

## Expected output
A risk-focused review with actionable findings and evidence that critical issues were verified.

## Stop conditions
Stop approval when required hardware documentation, tests, or safety/security review is missing.