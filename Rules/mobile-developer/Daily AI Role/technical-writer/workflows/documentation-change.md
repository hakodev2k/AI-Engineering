# Workflow: Documentation Change

**Trigger:** product or doc change request.
**Goal:** safely update affected documentation.
**Inputs:** request, diff/evidence, current docs, owner.
**Preconditions:** impacted versions and source identified.
**Stages:** impact scan → audience/task check → source-map update → draft → parallel technical/example/terminology review → consolidate → bounded corrections (max 2 per failed validation stage) → approvals → publish → post-publish verification.
**Parallel work:** example verification, terminology review, link checks, and audience review when independent.
**Dependencies:** unresolved product behavior blocks affected wording.
**Checkpoint:** high-risk content requires human approval.
**Outputs:** updated docs, source map, review evidence, ownership metadata.
**Failure:** stale or contradictory source → stop and escalate.
**Definition of Done:** checklist satisfied and rendered publication verified.