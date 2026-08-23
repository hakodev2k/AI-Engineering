# CI/CD Trust Boundary Rules

## Purpose
Protect build and delivery pipelines from privilege escalation, tampering, and unauthorized artifact production.

## Scope
CI/CD runners, workflows, credentials, deployment gates, artifacts, and automation identities.

## MUST
- Pipeline trust boundaries MUST be documented for untrusted code, pull requests, protected branches, release jobs, and production deployment.
- Untrusted contributions MUST execute without access to production secrets or privileged release credentials.
- Privileged jobs MUST run only from approved source states and protected workflow definitions.
- Runner permissions MUST follow least privilege and be isolated according to workload risk.
- Pipeline configuration changes that affect trust boundaries MUST be reviewed as security-sensitive changes.

## MUST NOT
- MUST NOT expose privileged credentials to forked or otherwise untrusted code execution.
- MUST NOT allow mutable external scripts to execute with release privileges without integrity controls.
- MUST NOT use broad repository or cloud permissions merely for pipeline convenience.

## SHOULD
- Ephemeral runners SHOULD be used for high-risk or privileged workloads.
- Security-sensitive workflows SHOULD pin external actions or tools to immutable versions or digests.

## Exceptions
Exceptions require threat analysis, explicit approval, compensating isolation controls, monitoring, and expiry.

## Verification
Inspect workflow permissions, runner configuration, secret exposure paths, branch protections, external action pins, and privileged-job conditions.