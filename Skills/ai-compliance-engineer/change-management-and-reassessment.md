# Change Management and Reassessment

## Purpose
Ensure material AI system changes trigger appropriate compliance review rather than silently invalidating prior assessments, controls, or approvals.

## When to use
Use for model swaps, prompt redesigns, new tools, data-source changes, autonomy increases, new markets, new user groups, fine-tunes, or material policy changes.

## Inputs
Change description, prior approval package, risk classification, evaluations, architecture diff, model/config versions, deployment plan.

## Preconditions
A baseline approved system state exists and changes can be versioned.

## Context to inspect
Release notes, model registry, prompt registry, feature flags, data lineage, vendor notices, risk assessments, control mappings, monitoring thresholds.

## Core knowledge
AI behavior can change materially even when application code barely changes. Compliance significance depends on changed capability, context, data, decision impact, and controls—not only semantic version numbers.

## Procedure
1. Compare proposed state with the last approved baseline.
2. Identify changed models, prompts, data, tools, autonomy, users, or geography.
3. Determine affected obligations and controls.
4. Reassess inherent and residual risk where needed.
5. Identify evaluations that must be rerun.
6. Review transparency, documentation, and vendor dependencies.
7. Obtain required approvals before release.
8. Record the decision and evidence.
9. Monitor post-release indicators.
10. Update inventory and documentation.

## Decision points
Use full reassessment for changes affecting risk category or regulated function; use scoped review for changes with bounded, demonstrated impact.

## Common failure patterns
Treating model alias updates as non-events, approving large prompt changes as content edits, not reassessing new geographies, and relying on vendor assurances without regression evidence.

## Verification
Confirm all changed compliance assumptions are either revalidated or explicitly shown to remain unaffected.

## Expected output
A change-impact record with reassessment scope, required tests, approvals, updated artifacts, and monitoring plan.

## Stop conditions
Escalate when the change creates a new high-risk use, invalidates mandatory controls, or cannot be compared reliably with the approved baseline.