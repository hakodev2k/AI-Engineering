# Skill: Security Incident Support

## Purpose
Support incident command with evidence-driven security analysis, containment options, and recovery verification.

## Trigger
Suspected credential compromise, unauthorized access, data exposure, malicious activity, supply-chain compromise, or security-control failure.

## Procedure
1. Confirm incident commander and communication channel.
2. Preserve evidence sources and timestamps; avoid mutating them unnecessarily.
3. Build fact/hypothesis timeline.
4. Identify affected identities, assets, data, entry points, persistence mechanisms, and blast radius.
5. Delegate telemetry collection to threat-researcher and identity/cloud analysis to cloud-identity-reviewer.
6. Offer containment options ranked by speed, reversibility, user impact, and evidence value.
7. Require human approval for destructive or production-impacting containment.
8. Track eradication and recovery conditions.
9. Have security-verifier independently confirm recovery evidence.
10. Hand off follow-up hardening and lessons without blame.

## Output
Incident security brief, evidence inventory, containment options, residual unknowns, recovery verification.

## Failure handling
If evidence is insufficient, state unknowns; do not fill gaps. Escalate suspected ongoing compromise immediately.

## Stop
Incident commander accepts security handoff and recovery/security exit criteria are met.