# Flag Taxonomy Rules

## Purpose
Ensure flag semantics determine governance, defaults, permissions, and lifecycle.

## Scope
Classification of release, experiment, operational, permission, migration, and kill-switch flags.

## MUST
- Every flag MUST be assigned a documented type before production use.
- Type MUST determine expected lifetime, allowed operators, telemetry, default behavior, and approval requirements.
- Permission or entitlement controls MUST be treated as authorization-sensitive and reviewed with security ownership.
- Kill switches MUST define safe activation and recovery behavior.

## MUST NOT
- Experiment flags MUST NOT be reused as durable authorization controls.
- Release flags MUST NOT be repurposed for unrelated features.
- A flag's meaning MUST NOT change without impact review.

## SHOULD
- Taxonomy SHOULD be enforced by templates or schema validation.
- Specialized flag types SHOULD use dedicated workflows when their risk differs.

## Exceptions
Nonstandard classifications require documented semantics, risks, and governance owner.

## Verification
Review registry schema, creation templates, access policies, code references, and flag-management configuration.