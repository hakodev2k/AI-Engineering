# Host Function Rules

## Purpose
Keep host functions safe, bounded, observable, and semantically stable.

## Scope
Applies to custom imports exposed by a host runtime to WebAssembly guests.

## MUST
- Every host function MUST validate guest-controlled arguments before privileged work.
- Authorization MUST be enforced in the host for security-sensitive operations.
- Blocking, fallible, and side-effecting behavior MUST be documented in the interface contract.
- Host functions MUST define cancellation, timeout, and resource ownership where applicable.
- Failures MUST map to stable guest-visible errors while retaining host-side diagnostics.

## MUST NOT
- Host functions MUST NOT trust a guest because the module was validated successfully.
- Secrets, raw credentials, privileged object references, or unrestricted host pointers MUST NOT cross the boundary unnecessarily.
- Panics or native exceptions MUST NOT be allowed to corrupt host process state when they can be contained.
- Host functions MUST NOT perform hidden network or filesystem operations contrary to declared capability policy.

## SHOULD
- Keep host functions narrow and composable.
- Instrument latency and failures for expensive calls.
- Prefer handles with scoped authority over ambient global access.

## Exceptions
A broad host function requires threat analysis, explicit ownership, operational limits, and security approval.

## Verification
Review registration tables and implementations, fuzz argument decoding, test unauthorized and cancelled calls, inspect telemetry, and confirm declared capabilities match actual side effects.