# Workflow: Usability Incident Response

**Trigger:** production UX issue causes severe abandonment, repeated user error, unsafe action, accessibility blocker, or major support escalation.
**Goal:** contain harm, identify root cause, restore task success, and prevent recurrence.
**Inputs:** user reports, telemetry, screenshots/session evidence, affected versions, known changes.

1. Triage severity by task impact, affected users, safety/accessibility/privacy exposure, and recoverability.
2. If severe, coordinate immediate containment with Product/Engineering/Support; UX Designer does not directly change production unless authorized.
3. Preserve evidence and identify affected flow/version.
4. Run parallel lanes: usability-risk review, accessibility review, evidence review, change-history review.
5. Consolidate root-cause hypotheses and test cheapest discriminating evidence.
6. Recommend reversible mitigation and durable fix options.
7. Apply human approval gates for critical risk acceptance or irreversible change.
8. Verify fix with task-success evidence and regression review.
9. Record Failure → Root Cause → Lesson → Process Improvement → Future Prevention.

**Retry:** two materially different failed mitigation attempts maximum before escalation.
**DoD:** harm contained, cause supported by evidence, fix verified, prevention control owned and dated.
