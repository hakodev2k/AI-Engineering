# Skill: Audit, Triage & Remediation

**Purpose:** turn accessibility evidence into an actionable, prioritized remediation queue.

**Inputs:** automated scan output, manual test notes, user reports, release scope, component ownership.

**Procedure:** normalize duplicates; reproduce; classify affected users and journeys; assign severity; identify systemic vs local cause; propose smallest safe fix; define regression coverage; route to owner; verify fix; capture residual risk.

**Priority model:** Impact + Severity + Deadline/Dependency + Cost of Delay + Confidence + Reversibility, with critical-path blockers first.

**Output:** defect record, remediation recommendation, evidence, owner, target milestone, retest status.

**Quality gate:** no finding closes from code inspection alone when behavior is user-observable; retest the actual interaction.

**Failure loop:** Failure → Root Cause → Lesson → Process Improvement → Future Prevention.

**Stop condition:** verified fixed, explicitly accepted by authorized human risk owner, or escalated with evidence.