# Compatibility Investigation

## Purpose
Investigate browser behavior differences and resolve standards-related regressions with minimal ecosystem risk.

## When to use
Use for page breakage, interoperability reports, standards-test differences, or regressions after engine changes.

## Inputs
Reduced reproduction, browser versions, logs, standards references, test results.

## Context to inspect
DOM, CSS, script behavior, response metadata, standards mode, feature configuration, recent changes.

## Core knowledge
Differences can originate in browser behavior, application assumptions, specification ambiguity, or legacy compatibility constraints. Broad exceptions create long-term maintenance cost.

## Procedure
1. Reproduce in clean environments.
2. Reduce the issue to a minimal test.
3. Compare observable behavior across implementations.
4. Identify the applicable normative requirement.
5. Locate the responsible engine subsystem.
6. Check regression history.
7. Prefer a generally correct implementation fix.
8. Add conformance and regression coverage.

## Decision points
Choose a general engine correction when behavior is broadly wrong; otherwise keep any compatibility handling narrow, documented, and removable.

## Common failure patterns
Fixing symptoms without a reduced test; broad special cases; ignoring standards requirements; failing to test unrelated content.

## Verification
The reduced case, affected workflow, and relevant conformance suites pass without new regressions.

## Expected output
A root-caused compatibility resolution with durable tests.

## Stop conditions
Stop when the expected platform behavior is unresolved and requires standards or product-policy review.