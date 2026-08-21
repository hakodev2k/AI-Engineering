# Upgrade Workflow

## Stages
1. Trigger: dependency upgrade request.
2. Context: collect repository metadata.
3. Research: analyze compatibility.
4. Plan: define minimal changes.
5. Execute: apply approved changes.
6. Verify: build, tests, diff review.

## Retry Policy
- Maximum retries: 2
- Retry only transient tooling failures.
- Preserve logs and failed commands.
- Escalate repeated failures.

## Approval
Required for major upgrades, breaking migrations, production changes.
