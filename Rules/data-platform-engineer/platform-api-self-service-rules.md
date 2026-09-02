# Platform API and Self-Service Rules

## Purpose
Provide safe, stable self-service interfaces that let teams use the data platform without bypassing governance or relying on operator intervention.

## Scope
Applies to platform APIs, CLIs, templates, portals, SDKs, provisioning workflows, and reusable self-service abstractions.

## MUST
- Self-service interfaces MUST validate requests before creating or changing platform resources.
- Public platform contracts MUST define supported inputs, outputs, errors, authorization, idempotency, lifecycle state, and compatibility expectations.
- Provisioned resources MUST inherit required security, ownership, tagging, observability, retention, and quota controls by default.
- Long-running operations MUST expose durable status and failure information rather than relying on client connection lifetime.
- Breaking interface changes MUST follow an explicit versioning and migration process.

## MUST NOT
- MUST NOT expose privileged backend capabilities through a self-service path without equivalent authorization and policy enforcement.
- MUST NOT require consumers to depend on undocumented implementation details.
- MUST NOT silently change defaults that can alter cost, security, retention, or data correctness for existing workloads.

## SHOULD
- Prefer paved-road workflows with secure defaults and escape hatches that require explicit justification.
- SHOULD make common failure states actionable and observable to consumers.

## Exceptions
Exceptions require documented consumer need, risk, compatibility impact, safeguards, and accountable platform approval.

## Verification
Use contract tests, authorization tests, idempotency tests, policy checks, generated-resource inspection, compatibility testing, and consumer acceptance evidence.