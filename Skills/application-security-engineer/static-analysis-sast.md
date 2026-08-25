# Static Analysis and SAST

## Purpose
Use static analysis to find scalable, code-level security defects while controlling noise and preserving developer trust.

## When to use
Use in CI, code review, baseline assessments, rule development, and recurring vulnerability classes.

## Inputs
Source code, build metadata, SAST findings, framework conventions, data-flow information, and triage history.

## Context to inspect
Inspect actual source-to-sink paths, sanitizers, framework behavior, generated code, test code, and deployment exposure.

## Core knowledge
SAST is strongest for repeatable code patterns and data flow, but findings require contextual validation. Precision, recall, and remediation latency matter more than raw finding count.

## Procedure
1. Define target vulnerability classes and repositories.
2. Configure language/framework-aware analysis and build context.
3. Establish a baseline without hiding new critical findings.
4. Triage by validating source, sink, path, exploit preconditions, and controls.
5. Fix root patterns rather than isolated instances where possible.
6. Write custom rules for recurring organization-specific unsafe APIs.
7. Add tests or fixtures for custom rules.
8. Track false-positive reasons and tune narrowly.
9. Gate only on sufficiently reliable, actionable classes.

## Decision points
Use blocking gates for high-confidence severe findings; use reporting for exploratory rules. Prefer semantically aware rules over broad regex searches.

## Common failure patterns
Turning on every rule, suppressing whole directories, treating scanner output as proof, and failing builds on noisy low-confidence results.

## Verification
Re-run analysis, inspect the corrected path, and test exploit-relevant behavior. Verify suppressions are scoped and documented.

## Expected output
Triaged findings, code fixes, tuned rules, and measurable analysis quality.

## Stop conditions
Escalate when tool limitations prevent analysis of a critical language/path or findings indicate systemic compromise rather than code defects.