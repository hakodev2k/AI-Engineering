# Workflow: Flaky Test Quarantine
## Trigger
Repeated nondeterministic CI failure or expiring quarantine.
## Stages
1. Pre-quarantine validation.
2. Flaky Test Investigator gathers evidence.
3. Quarantine Reviewer classifies and chooses scope.
4. Fix immediately if safe and practical; otherwise create bounded registry entry.
5. Approval checkpoint for renewal or broad coverage reduction.
6. Run relevant tests/build.
7. Run `scripts/quarantine_gate.py`.
8. Independent Verification Agent reviews diff and evidence.
9. Complete only on verified status.
## Produced artifacts
Investigation evidence, registry diff, gate output, CI logs, approval record when required, verification result.
## Retry rules
Transient CI/tool collection: max 2. Investigation/fix cycles: max 2. Policy/approval failure: no blind retry.
## Failure paths
If evidence is insufficient, do not quarantine. If expiry is exceeded, CI blocks. If fix causes new failures after two cycles, preserve evidence and escalate.
## Definition of Done
Minimal bounded quarantine or verified fix; owner/evidence present; gate and host CI pass; independent verification complete; no pending approval.
