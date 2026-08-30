# Human Review Rules

## Purpose
Ensure human moderation and safety review are consistent, evidence-based, privacy-aware, and resilient to reviewer error or bias.

## Scope
Applies to manual review queues, reviewer tooling, decision guidance, escalation, calibration, and quality assurance.

## MUST
- Reviewers MUST receive the policy context, evidence, and decision options required for the assigned case without unnecessary sensitive data.
- High-severity or ambiguous cases MUST have documented escalation paths to appropriately trained reviewers.
- Review guidance MUST distinguish facts visible in evidence from assumptions about intent.
- Reviewer decisions MUST record the applicable policy reason and disposition.
- Quality sampling MUST measure decision accuracy, consistency, and important error classes rather than throughput alone.
- Material policy updates MUST be reflected in reviewer guidance and calibration before enforcement at scale.

## MUST NOT
- MUST NOT pressure reviewers to trade decision quality for throughput on high-impact cases.
- MUST NOT expose reviewers to sensitive information unrelated to the decision.
- MUST NOT allow undocumented local practices to become de facto policy.
- MUST NOT use a single reviewer decision as unquestioned ground truth for difficult or novel policy areas.

## SHOULD
- Review interfaces SHOULD reduce cognitive load and make relevant evidence provenance clear.
- Calibration exercises SHOULD include edge cases, reversals, and newly emerging abuse patterns.
- Reviewer disagreement SHOULD be analyzed as a signal of unclear policy or tooling defects.

## Exceptions
During urgent incidents, specialized incident queues MAY use temporary guidance. The guidance MUST be approved, versioned, time-bounded, and reconciled with standard policy afterward.

## Verification
Inspect reviewer guidance versions, queue permissions, escalation records, quality audits, inter-rater agreement, reversal analysis, and sampled decisions. Confirm throughput targets do not suppress required escalation or secondary review.