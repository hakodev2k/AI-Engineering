# Workflow: Ad-hoc Analysis

**Trigger:** bounded stakeholder question with a decision deadline.

**Goal:** produce a reproducible decision-ready answer, not a pile of charts.

**Stages:**
1. Frame request with `analysis-question-framing`.
2. Check access/privacy and metric ownership.
3. Run source audit and metric-definition review in parallel.
4. If blocked, stop and escalate; otherwise execute descriptive/diagnostic analysis.
5. Send surprising/high-impact result to data-quality and insight-challenger reviews.
6. Resolve material contradictions; maximum 2 retries for transient query/tool errors.
7. Produce decision brief with confidence/caveats.
8. Obtain human approvals where required.
9. Handoff with refresh/follow-up trigger.

**Checkpoints:** contract accepted; source fitness passed; result verified; publication gate passed.

**Definition of Done:** checklist satisfied or status explicitly blocked with owner and next action.
