# Platform Compatibility Rules

## Purpose
Ensure supported platforms behave correctly within their distinct hardware, OS, storefront, and lifecycle constraints.

## Scope
Console, PC, mobile, handheld, platform APIs, suspend/resume, storage, input, and certification-sensitive behavior.

## MUST
- Supported platforms MUST have explicit capability and limitation assumptions.
- Platform-specific code MUST be isolated behind clear boundaries where practical.
- Suspend/resume, storage loss, account changes, controller changes, and constrained memory MUST be handled according to platform requirements.
- Release candidates MUST be tested on representative real hardware.

## MUST NOT
- MUST NOT assume desktop filesystem, process, threading, display, or input behavior across all targets.
- MUST NOT bypass platform security or certification requirements to unblock development.

## SHOULD
- Capability detection SHOULD be preferred over brittle device-name branching where APIs permit it.

## Exceptions
Platform-exclusive builds may omit irrelevant abstractions but must preserve explicit platform assumptions.

## Verification
Use platform compliance checks, device matrices, lifecycle tests, hardware profiling, and release certification evidence.