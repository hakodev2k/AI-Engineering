# Hypothesis Management Rules

## Purpose
Keep incident investigation evidence-driven and prevent unstructured guessing.

## Scope
Applies to technical investigation, suspected causes, and mitigation reasoning.

## MUST
- State significant hypotheses explicitly with supporting and contradicting evidence.
- Assign owners for tests that can materially confirm or eliminate a hypothesis.
- Prefer discriminating tests that separate multiple plausible causes.
- Update or retire hypotheses when evidence changes.
- Preserve uncertainty when evidence is incomplete.

## MUST NOT
- Treat confidence, seniority, or repetition as evidence.
- Continue broad corrective changes after the working hypothesis has been contradicted.
- Present correlation as proven causation without validation.

## SHOULD
- Rank hypotheses by plausibility, impact, and cost of verification.
- Capture negative evidence when it eliminates likely causes.

## Exceptions
During immediate containment, action may precede complete hypothesis testing when the mitigation is safe and reversible.

## Verification
Review incident notes for explicit hypotheses, tests, evidence, eliminated causes, and changes in confidence over time.