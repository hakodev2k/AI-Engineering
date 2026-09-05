# Human Review and Release Gating

## Purpose
Design risk-based human review and release gates for synthetic datasets so automated validation is supplemented where semantic, safety, legal, or domain judgment is required.

## When to use
Use for high-impact datasets, subjective labels, regulated domains, safety-critical scenarios, novel generators, weak automatic validators, or releases intended for broad reuse.

## Inputs
Generated dataset, risk classification, validation metrics, sampling plan, review rubric, reviewer expertise, acceptance thresholds, release workflow.

## Preconditions
Review responsibilities, escalation paths, and confidentiality requirements are defined. Reviewers have access only to the data necessary for their task.

## Context to inspect
Known generator failure modes, automated quality reports, privacy/fairness findings, label taxonomy, domain edge cases, previous reviewer disagreement, intended downstream uses.

## Core knowledge
Human review should target uncertainty and risk rather than become an unbounded manual substitute for engineering. Sampling must cover generator configurations, subgroups, rare scenarios, and borderline validation cases. Reviewer agreement and calibration matter as much as raw pass rates.

## Procedure
1. Classify release risk and decide which dimensions require human judgment.
2. Define an explicit review rubric with examples and escalation rules.
3. Build a stratified sample covering common, rare, high-risk, and validator-borderline records.
4. Blind reviewers to irrelevant generator metadata when it could bias judgment.
5. Use multiple reviewers for subjective or high-impact decisions.
6. Measure disagreement and investigate systematic ambiguity.
7. Feed recurring defects back into deterministic validators or generator constraints.
8. Require remediation and re-review when critical thresholds fail.
9. Record approvals, exceptions, and known limitations with the dataset version.
10. Release only after automated and human gates are both satisfied.

## Decision points
Increase review depth for novel generators, sensitive domains, and weak validators. Reduce manual sampling only after stable automated controls demonstrate sustained reliability.

## Common failure patterns
Convenience sampling, reviewers judging without a rubric, using humans to patch endless machine failures, ignoring disagreement, and releasing after average quality passes despite critical subgroup failures.

## Verification
Review coverage matches the sampling plan, reviewer agreement is acceptable, all critical findings are resolved or explicitly approved, and release gates are auditable.

## Expected output
A completed review report, calibrated acceptance decision, exception log, and release approval tied to an immutable dataset version.

## Stop conditions
Stop release when critical reviewer concerns remain unresolved, reviewer disagreement indicates ambiguous requirements, or required domain/privacy/safety expertise is unavailable.