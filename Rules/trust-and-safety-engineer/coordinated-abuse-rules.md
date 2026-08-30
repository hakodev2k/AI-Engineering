# Coordinated Abuse Rules

## Purpose
Detect and contain harmful behavior performed by groups of accounts, devices, services, or operators acting in coordination.

## Scope
Applies to coordinated spam, brigading, manipulation, harassment, fraud, inauthentic behavior, and multi-account abuse.

## MUST
- Coordination findings MUST be supported by multiple relevant signals such as temporal alignment, shared infrastructure, repeated content, graph relationships, or synchronized targets.
- Investigations MUST distinguish organic popularity or community behavior from coordinated manipulation.
- Cluster-level enforcement MUST define confidence thresholds and safeguards against punishing loosely connected legitimate users.
- Detection systems MUST account for adversaries rotating accounts, devices, network locations, and content variants.
- High-impact coordinated-abuse actions MUST preserve evidence showing why entities were grouped and why group-level action was justified.
- Response plans MUST consider containment of the underlying operation, not only removal of individual accounts.

## MUST NOT
- MUST NOT infer malicious coordination solely from shared viewpoints, hashtags, language, geography, or audience overlap.
- MUST NOT treat graph proximity as proof of common control.
- MUST NOT expose sensitive clustering logic where disclosure would materially aid evasion.
- MUST NOT extend penalties to uncertain cluster members without consequence-appropriate evidence.

## SHOULD
- Analysts SHOULD evaluate coordination over multiple time horizons to distinguish campaigns from coincidence.
- Systems SHOULD support partial containment when confidence varies across a cluster.
- Historical campaign signatures SHOULD be retained in privacy-compliant derived form when useful for recurrence detection.

## Exceptions
During an active high-severity campaign, temporary cluster-level containment MAY use conservative emergency thresholds with human approval, active monitoring, and post-incident review.

## Verification
Inspect graph features, clustering criteria, campaign case files, sampled group actions, false-positive reviews, and recurrence metrics. Confirm evidence supports coordination independently of ideology or content popularity alone.