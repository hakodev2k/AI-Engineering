# Lifecycle Hooks

## before-task-start
**Trigger:** work item enters active execution. **Preconditions:** goal, audience, owner, deadline, desired output. **Action:** run work-item validation and identify missing blockers. **Command:** `python scripts/validate-work-item.py <work-item.json>`. **Expected:** exit 0. **Failure:** block execution for structural errors; record non-blocking unknowns explicitly.

## after-briefing
**Trigger:** brief completed. **Action:** verify audience/problem, primary message, evidence, CTA, reviewers, measurement, approvals. **Failure:** return to briefing; maximum three revision cycles. **Blocks:** yes for missing material facts or approvals.

## before-publication
**Trigger:** asset is marked approved. **Action:** verify claims, links, accessibility, destination, metadata, analytics identifiers, approvals and exact final version. **Failure:** block publication.

## after-publication
**Trigger:** publication succeeds. **Action:** capture URL/version/time/owner, verify reachable destination and analytics signal, schedule measurement/freshness checkpoint. **Failure:** escalate if destination or measurement is materially broken.

## after-failure
**Trigger:** repeated quality, tool, publication, or process failure. **Action:** record evidence, root cause, lesson, process improvement, owner, prevention control. **Failure:** never hide recurrence; do not change process from one unexplained anomaly.

## before-retirement
**Trigger:** destructive removal/redirect. **Action:** inspect inbound dependencies, canonical relationships, legal hold, analytics history, redirects and required approval. **Failure:** block retirement when impact is uncertain or irreversible.