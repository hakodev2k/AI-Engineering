# Workflow: Release Acceptance
**Trigger:** candidate release or materially completed product increment.
**Inputs:** acceptance criteria, implementation evidence, test results, dependency status, rollout controls, metrics.
**Stages:** Independent acceptance verification + release-risk review in parallel -> Product Owner consolidation -> human approval where required -> release decision -> post-release observation -> outcome review.
**Checkpoints:** no critical failed criterion; dependencies closed; rollback/disable plan for material risk; metrics active.
**Decisions:** Accept/Ramp, Hold, Reject/Rework, Rollback.
**Retry:** at most two evidence/rework cycles before escalation.
**Failure learning:** Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention.
**DoD:** decision recorded, evidence linked, owners and review date set.