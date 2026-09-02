# Defect Rule Design

## Purpose
Design static-analysis rules that detect meaningful defects with clear semantics, bounded scope, and actionable explanations.

## When to use
Use when adding a new correctness, security, reliability, API-misuse, or maintainability rule to an analyzer.

## Inputs
Defect definition, examples, language/framework semantics, risk model, available analyses, and false-positive tolerance.

## Preconditions
Define observable evidence that distinguishes a defect from acceptable code.

## Context to inspect
Existing rules, suppression policy, AST/IR APIs, type/call/data-flow services, coding idioms, frameworks, and historical bugs.

## Core knowledge
A useful rule has a narrow semantic contract, high signal, explainable evidence, stable identifiers, and predictable behavior across code styles. More sophistication is justified only when it improves developer outcomes.

## Procedure
1. Write positive and negative examples before implementation.
2. Define the defect condition precisely.
3. Identify minimal semantic services required.
4. Define exclusions and intentional patterns.
5. Implement detection with provenance.
6. Produce a message explaining cause and remediation.
7. Add suppression/configuration only where legitimate variation exists.
8. Test generated, partial, invalid, and unusual code.
9. Evaluate against representative repositories.
10. Track false-positive and missed-case reports.

## Decision points
Prefer syntax/type rules when sufficient; use data-flow or interprocedural analysis only when local evidence cannot reliably distinguish safe from unsafe behavior.

## Common failure patterns
Rules based on naming heuristics, broad pattern matching without semantics, unstable diagnostics, undocumented exclusions, and advice that changes behavior incorrectly.

## Verification
Run curated fixtures, regression bugs, large-codebase evaluation, and manual review of sampled findings.

## Expected output
A documented rule with tests, evidence model, severity rationale, remediation guidance, and quality metrics.

## Stop conditions
Stop when defect semantics cannot be stated precisely or available analysis cannot produce acceptable signal.