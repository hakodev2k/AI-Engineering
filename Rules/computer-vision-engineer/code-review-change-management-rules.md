# Code Review and Change Management Rules

## Purpose
Ensure vision-system changes receive review proportional to their technical and operational risk.

## Scope
Code, models, datasets, labels, thresholds, preprocessing, runtime, dependencies, and deployment configuration.

## MUST
- Changes MUST state affected model/data/runtime contracts and expected quality, performance, privacy, and production impact.
- High-risk changes MUST include evidence from relevant tests or experiments before approval.
- Reviewers MUST inspect generated artifacts or configuration changes when they affect behavior beyond source-code diff.
- Destructive data operations, history rewriting, production changes, and weakened security controls MUST require explicit approval.

## MUST NOT
- Large model or dataset changes MUST NOT be approved solely because code diff is small.
- Verification failures MUST NOT be dismissed as expected without documented analysis.

## SHOULD
- Changes SHOULD be scoped so causal impact can be understood and rollback remains practical.

## Exceptions
Urgent incident changes require minimum safe review, documented rationale, and follow-up review.

## Verification
Inspect pull-request evidence, experiment links, artifact diffs, approvals, CI, risk notes, and rollback plans.