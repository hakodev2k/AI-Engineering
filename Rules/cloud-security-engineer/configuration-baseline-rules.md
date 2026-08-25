# Configuration Baselines

## Purpose
Establish secure, reviewable cloud configuration defaults.

## Scope
Accounts, subscriptions, projects, organizations, regions, managed services, and workload configuration.

## MUST
- Security-critical baseline settings MUST be defined as policy or version-controlled configuration where practical.
- Baselines MUST specify required controls, prohibited states, and documented exceptions.
- Drift from critical baselines MUST be detectable and assigned for remediation.
- Production configuration changes that weaken security MUST require human approval.

## MUST NOT
- MUST NOT disable baseline enforcement merely to make deployment succeed.
- MUST NOT rely on undocumented console changes for persistent security controls.

## SHOULD
- Apply preventive policy for high-confidence unsafe states and detective policy where prevention risks disruption.
- Stage baseline changes before broad rollout.

## Exceptions
Require business or technical reason, risk analysis, compensating controls, owner, expiry, and approval.

## Verification
Inspect policy definitions, infrastructure configuration, compliance results, drift reports, exception records, and representative effective settings.