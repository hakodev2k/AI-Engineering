# CI/CD Security Rules

## Purpose
Protect source-to-production delivery from unauthorized changes, credential theft, untrusted execution, and artifact tampering.

## Scope
Applies to repositories, CI runners, build workflows, deployment identities, artifacts, approvals, and release automation.

## MUST
- CI/CD identities MUST have least privilege and be separated by environment or deployment authority where compromise impact differs.
- Untrusted pull-request or fork code MUST NOT receive production secrets or equivalent privileged credentials.
- Security-relevant workflow changes MUST receive review appropriate to the privileges they can exercise.
- Production artifacts MUST be traceable to reviewed source and a controlled build process.
- Deployment pipelines MUST preserve required approval, test, and security gates; bypasses MUST be explicit and auditable.
- CI logs and artifacts MUST protect credentials and sensitive build outputs.

## MUST NOT
- MUST NOT execute attacker-controlled build steps on privileged persistent runners without isolation appropriate to the threat.
- MUST NOT use broad long-lived cloud credentials when short-lived scoped federation is available and suitable.
- MUST NOT disable failing security checks simply to complete a release without approved risk handling.

## SHOULD
- SHOULD pin or verify high-risk workflow actions and build tooling.
- SHOULD use ephemeral runners for untrusted workloads where practical.
- SHOULD generate provenance or equivalent artifact traceability for critical releases.

## Exceptions
Exceptions require explicit scope, reason, compensating controls, time bound, owner, and security/release approval.

## Verification
Review workflow diffs, runner trust, identity permissions, secret exposure paths, artifact provenance, branch protections, gate behavior, and deployment audit logs.