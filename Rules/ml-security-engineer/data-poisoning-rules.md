# Data Poisoning Rules

## Purpose
Prevent malicious training-data manipulation from creating targeted or broad model failures.

## Scope
Applies to supervised, self-supervised, online, feedback-driven, and retraining workflows.

## MUST
- Identify data sources an attacker or untrusted contributor can influence.
- Validate unusual source, label, feature, and sampling changes before retraining.
- Preserve enough lineage to isolate and remove suspected poisoned subsets.
- Require targeted security evaluation when training data changes can affect high-impact decisions.

## MUST NOT
- Automatically promote retrained models solely because aggregate accuracy improves.
- Mix trusted and untrusted feedback sources without controls that preserve source identity.
- Delete suspicious examples before retaining investigation evidence.

## SHOULD
- Use influence analysis, robust statistics, holdout checks, or equivalent techniques when poisoning risk is material.
- Limit the effect a single contributor or source can have on automated retraining.

## Exceptions
Online-learning systems that cannot pre-screen every sample require documented rate limits, monitoring, rollback, and incident controls.

## Verification
Inspect source lineage, anomaly reports, retraining gates, security evaluations, contributor controls, and rollback evidence.