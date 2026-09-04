# CI/CD Hardening Rules

## Purpose
Reduce the attack surface of continuous integration and delivery systems that can modify, build, sign, or deploy software.

## Scope
Applies to CI/CD platforms, workflows, runners, service accounts, plugins, reusable actions, deployment automation, and release gates.

## MUST
- CI/CD identities MUST use least privilege and environment-scoped authorization.
- Workflow changes affecting privileged jobs MUST require protected review.
- Third-party pipeline actions or plugins MUST be pinned to immutable trusted versions where supported.
- Privileged deployment or signing jobs MUST be isolated from untrusted code paths.
- CI/CD audit logs MUST be retained sufficiently to investigate suspicious workflow or credential activity.

## MUST NOT
- Fork or untrusted pull-request workflows MUST NOT receive production secrets by default.
- Pipeline definitions MUST NOT download and execute unauthenticated mutable code on privileged runners.
- Security gates MUST NOT be disabled merely to unblock a release without explicit approval.

## SHOULD
- Self-hosted runners SHOULD be ephemeral when practical.
- Administrative access SHOULD require strong authentication and separate operational identities.

## Exceptions
Exceptions require scope, business reason, threat analysis, compensating controls, expiry, and accountable approval.

## Verification
Inspect workflow permissions, branch protections, action pinning, runner isolation, secret exposure tests, audit logs, and deployment authorization settings.