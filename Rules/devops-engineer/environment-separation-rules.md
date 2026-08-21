# Environment Separation Rules

## Purpose
Prevent accidental cross-environment impact and preserve trustworthy promotion paths.

## Scope
Applies to development, test, staging, production, accounts/subscriptions, networks, data, and credentials.

## MUST
- Production resources MUST be clearly separated from non-production resources by account, subscription, project, namespace, or equivalent boundary appropriate to risk.
- Credentials and service identities MUST be environment-specific.
- Lower environments MUST NOT depend on production data or services unless explicitly approved and protected.
- Promotion paths MUST identify which artifacts and configuration move between environments.
- Production access controls MUST be stricter than development access where risk warrants it.

## MUST NOT
- MUST NOT share unrestricted production credentials with development automation.
- MUST NOT test destructive changes against production as the first validation step.
- MUST NOT copy sensitive production data into lower environments without approved protection and minimization.

## SHOULD
- Prefer structurally similar environments while allowing cost-appropriate scale differences.
- Prefer automated environment provisioning.

## Exceptions
Shared services require documented trust boundaries, access controls, and blast-radius analysis.

## Verification
Review account boundaries, IAM, network topology, credentials, data flows, deployment targets, and environment-specific policy checks.