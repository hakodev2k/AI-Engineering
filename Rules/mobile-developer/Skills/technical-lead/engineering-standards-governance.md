# Engineering Standards Governance

## Purpose
Establish lightweight engineering standards that improve consistency, safety, and maintainability without suppressing justified local decisions.

## When to use
Use when teams show recurring quality problems, fragmented conventions, or duplicated infrastructure decisions.

## Inputs
Codebases, incident patterns, review feedback, tooling, architecture principles, team constraints.

## Context to inspect
Inspect existing conventions, automation, pain points, exceptions, adoption cost, and areas where inconsistency creates real risk.

## Core knowledge
Standards should solve recurring problems and be automated when possible. A standard without rationale, ownership, or exception policy becomes ceremony.

## Procedure
1. Identify recurring costly inconsistency.
2. Define the outcome the standard should protect.
3. Review current practices and viable alternatives.
4. Choose the minimum rule set that addresses the risk.
5. Automate enforcement through formatters, analyzers, tests, templates, or CI where appropriate.
6. Document rationale and examples.
7. Define an exception process.
8. Roll out incrementally.
9. Measure friction and defects.
10. Retire standards that no longer provide value.

## Decision points
Mandate standards for high-impact interoperability, security, or maintainability concerns; provide guidance rather than mandates for low-risk style choices.

## Common failure patterns
Rules based on taste, giant style guides, manual enforcement, no exception path, and standards disconnected from tooling.

## Verification
Adoption is measurable, recurring targeted defects decline, and exceptions remain explicit rather than accidental.

## Expected output
A small enforceable standard with rationale, automation, ownership, and exception policy.

## Stop conditions
Escalate organization-wide mandates that affect teams outside the lead's authority.