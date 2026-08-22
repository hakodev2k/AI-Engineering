# Troubleshooting Documentation

## Purpose
Help users diagnose failures systematically from observable symptoms to safe corrective action.
## When to use
Use for recurring setup, runtime, integration, deployment, and configuration failures.
## Inputs
Support cases, logs/errors, known causes, diagnostics, remediation, escalation paths.
## Context to inspect
Error taxonomy, telemetry, platform differences, destructive fixes, product bugs, permissions.
## Core knowledge
Troubleshooting should branch on evidence, not provide random fix lists. Preserve diagnostic information before destructive remediation.
## Procedure
1. Define symptom and affected scope precisely.
2. List safe initial diagnostics and expected signals.
3. Map signals to likely causes in discriminating order.
4. Provide verification before each corrective action.
5. Start with reversible, low-risk fixes.
6. Explain side effects and backup/rollback for destructive actions.
7. Define when a known product defect applies.
8. Provide escalation evidence to collect.
9. Validate paths against real incidents.
## Decision points
Use decision trees for branching diagnosis; separate unrelated symptoms even if final fixes overlap.
## Common failure patterns
“Try these fixes,” deleting state first, commands requiring hidden privilege, outdated error text, and no escalation boundary.
## Verification
Reproduce representative failures and confirm documented diagnostics distinguish causes and fixes restore expected behavior.
## Expected output
Evidence-driven safe troubleshooting guide.
## Stop conditions
Escalate security incidents, potential data loss, or remediation requiring unauthorized production access.