# Requirement Analysis Rules

## Purpose
Prevent defects caused by ambiguous, contradictory, or untestable requirements.
## Scope
Stories, specifications, acceptance criteria, business rules, and change requests.
## MUST
- Identify ambiguity, missing states, boundary conditions, permissions, failure paths, and conflicting rules before execution.
- Convert material requirements into observable acceptance conditions.
- Record assumptions and unresolved questions separately from confirmed behavior.
## MUST NOT
- Invent expected behavior when authoritative requirements are missing.
- Silently accept contradictions that affect implementation or acceptance.
## SHOULD
- Use examples, decision tables, state models, or domain scenarios for complex rules.
## Exceptions
Exploratory work may proceed with explicit hypotheses and validation ownership.
## Verification
Inspect requirement review evidence and trace critical tests to approved expectations.