# End-to-End Temporal Boundary Workflow

## Trigger
A feature, bug, incident, review, or migration touches timestamps, dates, durations, time zones, recurrence, expiry, or scheduler boundaries.

## Entry conditions
Repository is available and task scope is identifiable.

## Inputs
Requirements/incident evidence, business-zone configuration, repository, test commands.

## Stages
1. **Preflight — workflow owner**: run repository validation and temporal scan. Block on invalid config.
2. **Investigate — Temporal Investigator**: classify values and trace conversions; output evidence-backed findings.
3. **Plan — workflow owner**: choose smallest change; flag approval boundaries.
4. **Approval checkpoint**: stop before schema/storage representation, public contract, production scheduler/config, infrastructure, destructive data, or security-control changes.
5. **Implement — Temporal Implementation Agent**: add boundary tests and implement approved change.
6. **Test-fix-retest**: run targeted tests. At most 2 implementation retries for deterministic build/test failures caused by the current diff. Preserve each failure output. Do not retry permission/business-rule failures.
7. **Independent verification — Independent Temporal Verifier**: run configured verification and inspect diff.
8. **Complete**: emit verified report and unresolved non-blocking risks.

## Tools
Repository search/read/write, `scripts/temporal_scan.py`, `scripts/verify_temporal_gate.py`, project build/test commands.

## Produced artifacts
`.ai-temporal/scan.json`, `.ai-temporal/verification.json`, source/test diff.

## Failure paths
- Transient tool failure: retry at most 2 times, preserving error.
- Validation failure: fix config/input once, then stop if still invalid.
- Build/test failure: maximum 2 implementation retries; then `failed`.
- Permission/environment failure: no retry unless evidence indicates transient; otherwise `blocked`.
- Unknown business semantics: `blocked`; do not guess.

## Definition of Done
- Temporal inventory covers affected path.
- Relevant boundaries are tested.
- Configured scan/build/test checks pass.
- No unapproved dangerous change exists.
- Verification report is schema-valid and status is `verified`.
- Remaining risks are documented.