# Watchdog and Fault Recovery

## Purpose
Recover predictably from hangs and bounded fault classes.

## Scope
Watchdogs, fault handlers, resets, safe states, and recovery escalation.

## MUST
- Watchdog servicing MUST prove that required system progress occurred, not merely that one loop executed.
- Watchdog timeout MUST exceed validated worst-case healthy execution while remaining useful for recovery.
- Fault handlers MUST preserve actionable diagnostics when safe and feasible.
- Repeated reset loops MUST have detection or escalation behavior for production-critical systems.
- Safety-critical faults MUST transition to a defined safe state.

## MUST NOT
- Watchdogs MUST NOT be disabled to hide timing or deadlock defects in production.
- Fatal faults MUST NOT resume normal execution unless recovery correctness is established.

## SHOULD
- Reset cause and fault signatures SHOULD persist across reboot for investigation.

## Exceptions
Exceptions require failure-mode analysis and explicit approval.

## Verification
Inject hangs, deadlocks, hard faults, stack failures, repeated resets, and delayed tasks; confirm recovery and diagnostics.