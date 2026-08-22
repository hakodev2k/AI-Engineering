# Skill: Stakeholder Communication

## Purpose
Provide accurate, audience-appropriate incident communication that is useful for decisions without overstating certainty or distracting responders.

## Trigger
Use for internal status updates, executive summaries, customer-facing drafts, support handoffs, vendor escalations, and recovery announcements.

## Inputs
- Current incident brief
- Verified facts and impact
- Severity and timeline
- Active mitigation and its state
- Known unknowns
- Next checkpoint
- Audience and communication channel

## Procedure
1. Identify audience and decision need.
2. Use verified incident state as the source of truth; do not rewrite technical speculation as fact.
3. Lead with impact and current status, not implementation detail.
4. State what changed since the previous update.
5. State mitigation/work in progress and the next expected checkpoint.
6. Include uncertainty only when it affects decisions; label it explicitly.
7. Avoid estimated recovery time unless an accountable owner has evidence for it.
8. Route public, legal, contractual, regulatory, or security-sensitive statements to required human approvers.
9. Keep cadence proportional to severity and rate of change.
10. Store sent updates with timestamps for later timeline reconstruction.

## Update contract
Every operational status update should answer:
- What is affected?
- How severe is it?
- What is confirmed?
- What changed since last update?
- What are responders doing now?
- What should the audience do, if anything?
- When is the next update?

## Audience adaptation
### Engineering responders
Include evidence, task owners, blockers, hypotheses, and exact next actions.

### Executives/business leaders
Include user/business impact, containment status, key risk, decision/approval requests, and recovery confidence.

### Support/customer success
Include symptoms customers may report, workarounds, affected scope, safe wording, and escalation path.

### Customer/public draft
Use approved facts only. Avoid internal blame, unverified root cause, confidential architecture, or unsupported recovery promises.

## Quality criteria
- No unverified root cause is presented as final.
- Dates, times, regions, products, and severity match the authoritative incident state.
- The update contains a next checkpoint or explicitly states why none is appropriate.
- The message is short enough for the target channel while preserving material risks.

## Failure handling
If state is unclear, send a factual holding update rather than silence. If two sources disagree, do not choose one silently; resolve or disclose the uncertainty internally before public communication.

## Stop conditions
Communication transitions from active incident cadence to closure/post-incident communication after recovery is verified and the Incident Commander declares the active phase complete.