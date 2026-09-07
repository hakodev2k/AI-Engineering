# Storage Incident Response Rules

## Purpose
Contain storage incidents without destroying evidence or amplifying data risk.

## Scope
Applies to outages, corruption, latency events, capacity emergencies, replica loss, and control-plane failures.

## MUST
- Establish incident severity, user impact, data-risk scope, and an accountable incident lead.
- Preserve logs, health state, topology, and relevant metadata before destructive remediation when feasible.
- Prefer reversible containment and continuously reassess durability exposure during mitigation.

## MUST NOT
- Delete, reformat, rebuild, or overwrite suspect storage solely to make health indicators green.
- Perform multiple high-risk remediations simultaneously without isolating their effects.
- Declare root cause without supporting evidence.

## SHOULD
- Separate containment, recovery, and root-cause workstreams.
- Capture decisions and timestamps for later reconstruction.

## Exceptions
Immediate destructive action is permitted only when authorized by emergency procedures and necessary to prevent greater harm.

## Verification
Review incident records, evidence preservation, command history, telemetry, recovery outcomes, and post-incident actions.