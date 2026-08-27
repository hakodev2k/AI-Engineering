# Kernel Security Boundary Rules

## Purpose
Preserve privilege boundaries and reduce unnecessary kernel exposure.

## Scope
User/kernel boundaries, privilege checks, capabilities, device access, namespaces, parsers, and privileged control paths.

## MUST
- Authorization MUST be checked at the authoritative operation boundary, not only in callers.
- Inputs crossing trust boundaries MUST be validated for size, range, state, encoding, and arithmetic overflow where relevant.
- Privileged operations MUST use least privilege and narrowly scoped authority.
- Security-sensitive state transitions MUST provide appropriate diagnostics without exposing secrets.
- Security claims MUST be supported by tests, configuration inspection, static analysis, or equivalent evidence.

## MUST NOT
- MUST NOT weaken permission checks, isolation, memory protections, or security mitigations solely to unblock functionality.
- MUST NOT trust user space, devices, firmware, filesystems, or network input based on origin alone.
- MUST NOT expose kernel addresses, secrets, credentials, or sensitive memory contents unnecessarily.

## SHOULD
- Privileged interface surface SHOULD be minimized.
- Parsers SHOULD use bounded, overflow-safe operations.
- Security-sensitive interfaces SHOULD receive robust malformed-input testing.

## Exceptions
Weakening a security control requires explicit human approval, documented risk analysis, compensating controls, duration, and validation plan.

## Verification
Use boundary tests, static analysis, security tests, privilege tests, sanitizer builds, configuration review, and focused human review.