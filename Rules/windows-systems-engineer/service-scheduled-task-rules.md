# Services and Scheduled Tasks

## Purpose
Keep unattended workloads secure, observable, and recoverable.

## Scope
Windows services, scheduled tasks, startup behavior, service accounts, dependencies, and recovery actions.

## MUST
- Every production service/task MUST have documented owner, purpose, identity, dependencies, trigger/start behavior, and failure handling.
- Service identities MUST receive only required rights and filesystem/network permissions.
- Restart/recovery policies MUST avoid unbounded loops and cascading load.
- Material changes to critical service startup or identity MUST include rollback and approval appropriate to impact.

## MUST NOT
- MUST NOT run workloads as LocalSystem or highly privileged domain identities without demonstrated need.
- MUST NOT embed reusable credentials in task definitions, scripts, or command lines.
- MUST NOT hide repeated failures through automatic restart without alerting.

## SHOULD
- Use managed service identities where supported.
- Make tasks idempotent and observable.

## Exceptions
Require justification, risk, compensating controls, owner, and review date.

## Verification
Inspect service/task configuration, effective privileges, event logs, failure/recovery behavior, dependency health, and credential exposure.