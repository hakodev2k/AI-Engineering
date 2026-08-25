# CI/CD Secrets Rules

## Purpose
Prevent build and deployment automation from becoming a durable credential-exfiltration path.

## Scope
CI runners, deployment jobs, build logs, artifacts, workflow definitions, package publishing, and release automation.

## MUST
- Pipelines MUST use scoped identities or secrets limited to required repository, environment, action, and duration.
- Protected-environment credentials MUST be gated from untrusted pull-request or fork execution.
- Logs and artifacts MUST be configured to prevent secret disclosure and scanned where practical.
- Production credential use MUST be attributable to a specific workflow execution and revision.

## MUST NOT
- Broad long-lived credentials MUST NOT be embedded in workflow files, runner images, or repository variables accessible to untrusted jobs.
- Secret masking MUST NOT be treated as the primary security boundary.
- Unreviewed third-party pipeline code MUST NOT receive privileged secrets.

## SHOULD
- Prefer OIDC/workload federation and ephemeral runners.
- Separate build identities from deployment identities.

## Exceptions
Static CI credentials require owner, narrow scope, rotation, monitoring, expiry, and documented reason federation is unavailable.

## Verification
Review workflow permissions, fork behavior, environment protections, runner isolation, credential lifetime, audit events, secret scans, and representative logs/artifacts.