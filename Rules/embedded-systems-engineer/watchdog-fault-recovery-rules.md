# Watchdog and Fault Recovery Rules

## Purpose
Detect loss of progress and recover without masking systemic faults.

## Scope
Hardware/software watchdogs, fault handlers, health checks, retries, degraded modes, and reset escalation.

## MUST
- Feed watchdogs only after evidence of required system progress.
- Bound retries and define escalation for persistent faults.
- Preserve actionable fault context before reset when safely possible.

## MUST NOT
- Feed a watchdog unconditionally from an independent timer.
- Retry indefinitely when repeated action can damage hardware, corrupt data, or violate safety constraints.

## SHOULD
- Design degraded modes for recoverable subsystem failures when system requirements justify them.

## Exceptions
Automatic recovery from safety-critical faults requires documented hazard analysis and approval.

## Verification
Inject hangs, peripheral failures, communication loss, corrupted state, and repeated faults; verify detection, evidence, and recovery.