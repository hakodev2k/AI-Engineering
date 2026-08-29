# AI Change Management Rules

## Purpose
Ensure material changes to AI systems are identified, assessed, tested, approved, and rolled out without silently invalidating prior governance decisions.

## Scope
Applies to model upgrades, prompt changes, fine-tuning, retrieval changes, tool permissions, provider changes, data changes, policy changes, autonomy changes, and infrastructure changes that can alter risk or behavior.

## MUST
- Every production AI system MUST define what constitutes a material change for its risk context.
- Material changes MUST receive impact assessment covering affected requirements, risks, evaluations, disclosures, controls, and approvals.
- Changes to model version, autonomy, privileged tools, sensitive data use, or high-impact decision logic MUST trigger explicit governance review.
- Pre-release evidence MUST correspond to the exact model, prompt, configuration, data path, and tool set intended for production.
- Rollout plans for high-risk changes MUST define monitoring, rollback or disablement, and decision authority.
- Emergency changes MUST be retrospectively reviewed and documented within a defined period.

## MUST NOT
- MUST NOT treat a provider-side model update as operationally irrelevant when behavior can change.
- MUST NOT reuse stale evaluation evidence after a change that can invalidate it.
- MUST NOT broaden system permissions or autonomy under a routine configuration-change path.
- MUST NOT bypass required review solely because a change has a small code diff.

## SHOULD
- High-risk systems SHOULD pin or otherwise control model and configuration versions where feasible.
- Change detection SHOULD be automated for governed assets and provider versions.
- Rollouts SHOULD use staged exposure when evidence under full production load is uncertain.

## Exceptions
Exceptions MUST document urgency, affected controls, risk, compensating measures, rollback, owner, and approval. Emergency treatment does not remove the obligation to perform post-change review.

## Verification
Inspect change tickets, diffs, provider version history, evaluation artifacts, approvals, deployment records, monitoring plans, and rollback evidence. Confirm the released configuration matches the approved configuration.