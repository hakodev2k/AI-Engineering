# Side-Channel Rules

## Purpose
Reduce leakage through timing, memory access, power, cache behavior, errors, and related channels.

## Scope
Secret-dependent cryptographic operations and high-value key handling.

## MUST
- Use implementations designed to resist relevant side channels for the deployment environment.
- Identify secret-dependent branches, memory access, comparison, and error behavior during review.
- Treat side-channel resistance as an end-to-end property including compiler, runtime, hardware, and deployment context.

## MUST NOT
- Implement custom constant-time primitives without specialist review and evidence.
- Claim constant-time behavior from source inspection alone when compilation or runtime behavior can invalidate it.

## SHOULD
- Isolate high-value operations in hardened modules or hardware where justified.

## Exceptions
Require threat analysis, exposure bounds, measurement evidence, and security approval.

## Verification
Use vetted libraries, generated-code review where relevant, timing/statistical tests, platform analysis, and specialist review.