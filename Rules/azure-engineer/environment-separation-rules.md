# Environment Separation Rules

## Purpose
Prevent development and test activity from creating unintended production impact.

## Scope
Subscriptions, resource groups, identities, networks, secrets, data, pipelines, and configuration across environments.

## MUST
- Establish clear production and non-production boundaries appropriate to risk.
- Separate privileged identities and deployment permissions where environment impact differs.
- Prevent non-production workloads from using production secrets or sensitive data by default.
- Make environment targeting explicit in automation and deployment commands.
- Validate configuration differences that affect security, scale, and reliability.

## MUST NOT
- Share production credentials with development or test environments.
- Copy sensitive production data into lower environments without approved protection and necessity.
- Infer the target environment solely from local defaults before destructive operations.

## SHOULD
- Use separate subscriptions for materially different security or governance boundaries.
- Keep infrastructure patterns consistent while parameterizing legitimate differences.

## Exceptions
Shared resources require documented dependency, access controls, blast-radius analysis, and ownership.

## Verification
Inspect subscription boundaries, identities, secret stores, network paths, pipeline scopes, data sources, and configuration.