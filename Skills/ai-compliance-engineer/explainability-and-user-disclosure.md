# Explainability and User Disclosure

## Purpose
Determine and implement appropriate explanations and disclosures about AI involvement, system limitations, decision factors, and user rights.

## When to use
Use for user-facing AI, automated or AI-assisted decisions, regulated disclosures, generated content, or systems where users may reasonably misinterpret AI capability.

## Inputs
User journey, decision type, model behavior, legal obligations, risk classification, audience characteristics, available explanation signals.

## Preconditions
The system purpose and actual influence of AI on outcomes are known.

## Context to inspect
UI copy, API responses, decision records, model documentation, support workflows, accessibility requirements, local disclosure rules.

## Core knowledge
Useful transparency is contextual. Technical model details are not automatically meaningful explanations. Disclosures should communicate AI involvement, important limitations, consequential factors where applicable, and paths for questions or challenge.

## Procedure
1. Identify disclosure obligations and user expectations.
2. Define what AI does and does not do.
3. Identify material limitations and uncertainty.
4. Determine decision-specific explanation requirements.
5. Translate technical evidence into audience-appropriate language.
6. Avoid unsupported causal claims about model reasoning.
7. Add recourse or contact paths where appropriate.
8. Validate accessibility and localization.
9. Test comprehension with representative users.
10. Version disclosures when system behavior changes.

## Decision points
Provide more detailed explanations for high-impact decisions; prefer concise notice for low-impact assistive features. Separate transparency from exposing sensitive security details.

## Common failure patterns
Generic “AI-powered” labels, claiming to reveal model reasoning when only feature attribution exists, hiding material limitations, and disclosures that do not match actual system behavior.

## Verification
Compare disclosures to system behavior and legal requirements; test that representative users understand AI involvement and available recourse.

## Expected output
Approved disclosure and explanation requirements with implementation locations, evidence, and review triggers.

## Stop conditions
Escalate when required explanation cannot be produced reliably or disclosure conflicts with security, confidentiality, or legal constraints.