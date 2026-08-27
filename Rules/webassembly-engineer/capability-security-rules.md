# Capability Security Rules

## Purpose
Ensure WebAssembly workloads receive only the host capabilities they require.

## Scope
Applies to filesystem, network, clocks, randomness, environment, process, secrets, devices, and custom host functions.

## MUST
- Every granted capability MUST map to a documented workload requirement.
- Capability grants MUST follow least privilege in scope, operation, and lifetime.
- Sensitive host functions MUST enforce authorization at the host boundary.
- Capability policy MUST default to deny when no explicit grant exists.
- Changes that expand production capabilities MUST receive human approval and security review.

## MUST NOT
- A module MUST NOT receive unrestricted filesystem, network, environment, or secret access merely for implementation convenience.
- Security controls MUST NOT rely on a module voluntarily avoiding capabilities it has been granted.
- Host functions MUST NOT expose ambient authority through indirect handles or mutable global state.

## SHOULD
- Use scoped handles and preopened resources rather than broad namespace access.
- Separate capability policy from application code where the runtime permits.
- Log security-relevant capability denials without logging sensitive payloads.

## Exceptions
Broader capabilities require documented necessity, threat analysis, blast radius, compensating controls, expiry/review conditions, and explicit approval.

## Verification
Inspect runtime capability configuration, host-function registration, deployment policy, and integration tests that prove denied operations fail. Security review should trace each capability from requirement to grant and verify no undocumented authority is reachable.