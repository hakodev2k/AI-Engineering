# Data Classification and Handling

## Purpose
Create and apply a risk-based classification scheme that drives concrete handling controls across the data lifecycle.

## When to use
Use when defining sensitivity tiers, onboarding datasets, implementing access/security controls, or remediating inconsistent handling.

## Inputs
Data inventory, legal/privacy/security requirements, threat model, business impact criteria, storage and sharing patterns.

## Context to inspect
Inspect existing labels, regulated categories, platform control capabilities, flows, retention, exports, and third-party sharing.

## Core knowledge
Classification is useful only when labels map to enforceable controls. Sensitivity, criticality, and regulatory categories may be separate dimensions. Derived data can inherit or increase sensitivity.

## Procedure
1. Define objectives and dimensions.
2. Establish a small set of unambiguous levels with examples.
3. Map legal and business criteria to levels.
4. Define handling for storage, transport, access, sharing, logging, masking, retention, and disposal.
5. Define inheritance and aggregation rules.
6. Assign classification responsibility.
7. Implement labels in catalog/platform tooling.
8. Automate discovery or enforcement where reliable.
9. Define exception and reclassification workflows.
10. Test representative datasets and edge cases.
11. Monitor unlabeled and misclassified assets.

## Decision points
Prefer simple tiers when human interpretation is required; use tags for regulatory categories. Automated classifiers should support, not silently override, accountable decisions when confidence is low.

## Common failure patterns
Too many levels, labels without controls, ignoring derived datasets, stale labels, and classification based only on storage location.

## Verification
Verify sampled assets have defensible labels and each label produces expected access, encryption, sharing, logging, retention, and disposal behavior.

## Expected output
Classification taxonomy, handling standard, decision guide, mapped controls, and exception process.

## Stop conditions
Escalate ambiguous legal classifications, unsupported mandatory controls, or handling that conflicts with contractual obligations.