# Workflow: Feature Accessibility Review

**Trigger:** new or changed user-facing feature before release.
**Goal:** prevent accessibility barriers from entering production.

1. Intake scope, critical journeys, platforms, deadline and acceptance criteria.
2. Run requirements/risk assessment.
3. In parallel, delegate semantic review and interaction review; add AT review for medium/high-risk behavior.
4. Consolidate findings, deduplicate and rank by impact/severity/dependency.
5. Engineering remediates; main role keeps the evidence ledger as source of truth.
6. Retest affected behavior plus adjacent regression surface.
7. Evidence Reviewer checks closure package.
8. Main role issues pass, conditional pass with human-approved residual risk, or block recommendation.

**Checkpoints:** scope approved; high-risk interactions covered; all blockers retested.
**Retries:** max 2 remediation/retest loops per finding before escalation.
**Human approval:** residual critical/high risk, compliance exception, or intentionally reduced scope.
**Definition of done:** no unapproved blocker, evidence is reproducible, handoff names owners for deferred risk.