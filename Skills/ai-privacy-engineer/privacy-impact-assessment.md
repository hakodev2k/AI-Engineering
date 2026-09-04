# Privacy Impact Assessment

## Purpose
Run a structured privacy impact assessment for AI features so material risks, controls, owners, and approval requirements are identified before launch or significant change.

## When to use
Use for new processing of personal data, sensitive-data use, large-scale profiling, model training on user data, new vendors, new jurisdictions, or changes that materially affect privacy risk.

## Inputs
- Product and architecture description
- Data-flow map and classifications
- Intended users and affected individuals
- Retention, access, and deletion rules
- Model/provider details
- Prior risk assessments and incidents

## Context to inspect
Inspect collection notices, consent or preference flows, training and inference paths, access controls, logging, model retention settings, downstream disclosures, and rights-handling mechanisms.

## Core knowledge
A strong assessment links concrete processing activities to risks to individuals, not only risks to the organization. It should document necessity, proportionality, safeguards, residual risk, and accountable decision makers. Legal conclusions belong to qualified privacy/legal stakeholders; engineering supplies evidence and feasible controls.

## Procedure
1. Define scope, processing purposes, and affected populations.
2. Map data categories, sources, recipients, and retention.
3. Identify sensitive, vulnerable, or high-impact use cases.
4. Assess necessity and proportionality of each major processing activity.
5. Enumerate privacy harms, including exposure, exclusion, manipulation, surveillance, and loss of control.
6. Evaluate likelihood and severity using an agreed rubric.
7. Record existing technical and organizational safeguards.
8. Propose additional controls and alternatives.
9. Measure residual risk after mitigation.
10. Assign owners, deadlines, and verification evidence.
11. Obtain required privacy, security, product, or legal review.
12. Revisit the assessment after material architecture or purpose changes.

## Decision points
Prefer redesign when a high-risk processing path can be eliminated. Use compensating controls only when the processing is necessary and controls are independently verifiable. Require higher approval for sensitive data or consequential automated decisions.

## Common failure patterns
- Treating the assessment as a launch checklist
- Describing organizational risk instead of user harm
- Leaving mitigations without owners or tests
- Failing to reassess after vendor/model changes
- Accepting vague claims such as data is anonymized without evidence

## Verification
Verify every mitigation against implementation evidence, test rights and deletion paths, confirm provider configuration, and ensure residual-risk decisions have explicit accountable approval.

## Expected output
A signed-off assessment containing scope, processing description, risk scenarios, safeguards, residual risks, owners, and verification evidence.

## Stop conditions
Stop and escalate if high residual risk remains unapproved, material processing details are unknown, or required legal/privacy review is unavailable.