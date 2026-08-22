# Dependency Management Rules
## Purpose
Prevent external and internal dependencies from becoming invisible schedule or delivery failures.
## Scope
Cross-team, vendor, technical, approval, environment, data, and operational dependencies.
## MUST
- Record material dependencies with provider, consumer, required outcome, due date, status, and escalation path.
- Validate dependency commitments with the responsible owner rather than assuming availability.
- Assess downstream impact when a dependency changes.
- Escalate threatened critical dependencies early enough for mitigation.
## MUST NOT
- Mark a dependency resolved without evidence that the required outcome is available and usable.
- Hide dependency risk inside generic project status.
## SHOULD
- Reduce unnecessary critical dependencies through sequencing, decoupling, fallback, or early validation.
## Exceptions
Low-impact dependencies may be tracked within normal work items if ownership and impact remain visible.
## Verification
Review dependency register, owner confirmations, milestone links, blockers, and mitigation evidence.