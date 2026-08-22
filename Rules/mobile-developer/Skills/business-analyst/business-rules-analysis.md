# Business Rules Analysis

## Purpose
Discover, normalize, and validate business rules so system behavior and operational decisions are explicit and testable.

## When to use
Use when workflows depend on eligibility, calculations, approvals, exceptions, compliance, or conditional behavior.

## Inputs
Policies, regulations, existing code behavior, SME knowledge, decision tables, forms, and historical cases.

## Preconditions
The business scope and rule owners are identifiable.

## Context to inspect
Rule sources, precedence, exceptions, effective dates, ownership, affected data, and downstream consequences.

## Core knowledge
Separate rules from process steps and implementation details. A good rule is atomic, unambiguous, traceable, and testable.

## Procedure
1. Inventory candidate rules from documents, systems, and SMEs.
2. Rewrite ambiguous statements into explicit conditions and outcomes.
3. Separate policy rules, calculation rules, validation rules, and derived rules.
4. Identify precedence and conflict resolution.
5. Capture exceptions and effective dates.
6. Model complex rules using decision tables or decision trees.
7. Validate examples and counterexamples with owners.
8. Trace each rule to requirements and acceptance tests.

## Decision points
Use decision tables for combinatorial conditions and decision trees when order and branching are easier to understand visually.

## Common failure patterns
Embedding rules only in user stories, mixing rules with UI behavior, missing exceptions, and leaving ownership undefined.

## Verification
Confirm representative cases produce expected outcomes and conflicting or overlapping rules are resolved.

## Expected output
A governed set of testable business rules with sources, owners, precedence, exceptions, and traceability.

## Stop conditions
Escalate when authoritative sources conflict or rule ownership cannot be established.