# Production Incident Rules

## Purpose
Guide evidence-based diagnosis and safe mitigation of Android production failures.

## Scope
Applies to crashes, ANRs, regressions, bad releases, backend incompatibility, security incidents, and severe user-impact defects.

## MUST
- Establish impact, affected versions/populations, timeline, and available evidence before broad corrective action where time permits.
- Prefer reversible mitigation such as rollout halt, feature disablement, or server compatibility fix when it reduces risk faster than a blind client patch.
- Preserve diagnostic evidence and distinguish confirmed facts from hypotheses.
- Validate emergency fixes against the original failure mode and critical regressions.
- Escalate suspected security/privacy incidents through the applicable incident process.

## MUST NOT
- Delete or alter evidence to make metrics appear healthy.
- Ship speculative high-risk fixes without testing when a safer mitigation exists.
- Exceed authorization by changing production configuration, rollout, credentials, or data without required human approval.

## SHOULD
- Produce a root-cause analysis for material incidents and convert findings into durable prevention.
- Track recovery through user-impact metrics, not deployment completion alone.

## Exceptions
Immediate containment may precede full diagnosis when ongoing harm is significant; actions must remain authorized and documented.

## Verification
Use crash/ANR data, logs, metrics, release history, reproduction evidence, incident records, post-fix telemetry, and approval trails.