# Testing and Verification

## Purpose
Require evidence that eBPF behavior is correct across verifier, kernel, userspace, and failure boundaries.

## Scope
Unit, integration, kernel-matrix, packet, load, regression, negative, and upgrade testing.

## MUST
- Critical program logic MUST have deterministic regression coverage.
- CI MUST verify loadability on representative supported kernels or equivalent kernel test environments.
- Failure paths MUST include verifier rejection, missing capability, attach failure, map exhaustion, event loss, and consumer failure where relevant.
- Enforcement programs MUST test both allowed and denied behavior.
- Bugs with material impact MUST gain regression protection before closure when reproducible.

## MUST NOT
- MUST NOT rely solely on compilation or static inspection as runtime correctness evidence.
- MUST NOT hide flaky kernel tests by unconditional retries.
- MUST NOT claim support for untested kernel classes without explicit risk acceptance.

## SHOULD
- Use fixtures and golden event/packet cases for stable semantics.
- Separate environment failures from product failures in CI evidence.

## Exceptions
Missing automation requires documented manual evidence, owner, risk, and remediation plan.

## Verification
Inspect CI matrix, test reports, failure-injection coverage, regression links, and reproducibility of test environments.