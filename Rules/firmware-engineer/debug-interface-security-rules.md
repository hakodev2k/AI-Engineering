# Debug Interface Security

## Purpose
Prevent production debug capabilities from bypassing security boundaries.

## Scope
JTAG, SWD, UART consoles, boot consoles, manufacturing commands, and diagnostic ports.

## MUST
- Production debug policy MUST be explicit per device lifecycle state.
- Privileged diagnostic commands MUST require appropriate authorization or be disabled in production.
- Debug locking MUST be verified after provisioning when required by the threat model.
- Recovery and manufacturing access MUST have bounded privileges and auditable procedures.

## MUST NOT
- Production devices MUST NOT expose unauthenticated memory read/write or arbitrary code execution through debug interfaces unless explicitly approved.
- Secrets MUST NOT be printed through diagnostic consoles.

## SHOULD
- Lifecycle transitions SHOULD be irreversible when reversing them would compromise device trust, subject to serviceability requirements.

## Exceptions
Service/debug exceptions require documented access controls, physical assumptions, and security approval.

## Verification
Inspect fuse/configuration state and attempt unauthorized debug, console, and manufacturing operations on production-equivalent devices.