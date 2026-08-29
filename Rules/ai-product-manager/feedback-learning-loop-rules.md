# Feedback and Learning Loop Rules

## Purpose
Ensure post-launch feedback improves the product without contaminating evidence, amplifying abuse, or silently changing behavior.

## Scope
Applies to user feedback, ratings, corrections, support signals, annotation pipelines, and product-learning loops.

## MUST
- Feedback channels MUST distinguish preference, factual correction, safety report, defect report, and workflow friction when those imply different actions.
- Feedback used for training or evaluation MUST have documented provenance, quality controls, and eligibility criteria.
- Repeated negative feedback patterns MUST trigger investigation when they cross defined severity or frequency thresholds.
- Product changes based on feedback MUST be evaluated against representative users, not only the loudest segment.

## MUST NOT
- MUST NOT automatically train on raw user feedback without approved filtering, privacy, and quality controls.
- MUST NOT interpret absence of feedback as satisfaction.
- MUST NOT allow malicious or coordinated feedback to silently alter ranking, policy, or model behavior.

## SHOULD
- Feedback SHOULD be connected to measurable product hypotheses and known failure taxonomies.
- Closed-loop communication SHOULD inform affected users when practical and appropriate.

## Exceptions
Exceptions require documented data-quality risk, privacy treatment, owner, and bounded use.

## Verification
Inspect feedback schemas, moderation and filtering logic, training-data lineage, support trends, abuse controls, and resulting product decisions.