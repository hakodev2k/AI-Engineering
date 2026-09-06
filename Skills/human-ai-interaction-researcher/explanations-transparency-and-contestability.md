# Explanations, Transparency, and Contestability

## Purpose
Evaluate whether system explanations and transparency mechanisms help users understand, verify, challenge, and recover from AI-mediated outcomes.

## When to use
Use for recommendations, classifications, generated answers, automated decisions, agent actions, provenance displays, confidence indicators, and appeal mechanisms.

## Inputs
Decision context, explanation design, system limitations, user goals, error consequences, available provenance, and policy requirements.

## Context to inspect
Inspect what the system actually knows, how outputs are produced at an appropriate abstraction level, available evidence, user actions after explanation, and escalation or override paths.

## Core knowledge
An explanation is useful only relative to a user goal such as prediction, verification, learning, debugging, accountability, or contesting an outcome. More detail can increase cognitive load or create false assurance. Transparency should not imply certainty or expose sensitive internals unnecessarily.

## Procedure
1. Identify the decisions users make after seeing an AI output.
2. Define the explanation goal for each decision.
3. Inventory available evidence: sources, uncertainty, transformations, rules, tool actions, and limitations.
4. Test whether users can correctly predict system boundaries after viewing explanations.
5. Evaluate whether explanations improve error detection and verification.
6. Measure comprehension separately from perceived helpfulness.
7. Test misleading, incomplete, and conflicting evidence scenarios.
8. Evaluate challenge, correction, override, and appeal workflows.
9. Check accessibility and cognitive load.
10. Recommend the minimum explanation content that supports the intended action.

## Decision points
Prefer source/provenance evidence when factual verification is the goal; rationale summaries when reasoning orientation is needed; explicit limitations when boundary calibration matters. Use human escalation when contestability cannot be safely automated.

## Common failure patterns
Explanations that merely rationalize outputs, confidence theater, excessive technical detail, hidden appeal paths, explanations that cannot be acted upon, and measuring satisfaction instead of comprehension.

## Verification
Users should demonstrate the intended understanding or action in realistic scenarios, including failures. Confirm explanation content is faithful to available system evidence.

## Expected output
An explanation and contestability assessment with user goals, evidence, comprehension findings, risks, and prioritized design recommendations.

## Stop conditions
Stop when the explanation would require fabricating unavailable reasoning, disclosure would violate security or privacy constraints, or no meaningful challenge path exists for a high-stakes outcome.