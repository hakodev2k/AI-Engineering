# Linux Capability Rules

## Purpose
Constrain kernel-level privileges granted to containers and prevent unnecessary expansion of process authority.

## Scope
Applies to Linux capabilities, privileged mode, setuid/setgid behavior, and runtime privilege configuration.

## MUST
- Containers MUST drop all capabilities not required by the workload.
- Added capabilities MUST have a documented functional requirement and security impact.
- Privileged mode MUST require explicit human approval and a documented alternative analysis.
- Capability requirements MUST be validated in the actual runtime environment because defaults vary by platform.
- Security-sensitive workloads MUST prevent privilege escalation where supported.

## MUST NOT
- MUST NOT grant broad capability sets to solve isolated permission failures.
- MUST NOT use privileged mode as a default debugging or compatibility mechanism.
- MUST NOT assume container namespace boundaries neutralize dangerous kernel capabilities.

## SHOULD
- Start from a drop-all posture and add the smallest capability set required.
- Remove setuid/setgid binaries from minimal runtime images when they are unnecessary.

## Exceptions
Exceptions require technical necessity, attack-surface analysis, compensating controls, bounded scope, and approval.

## Verification
Inspect runtime security contexts, effective capability sets, image contents, admission policies, and integration tests.