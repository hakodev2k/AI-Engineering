# Incident Debugging Rules

## Purpose
Drive evidence-based diagnosis of realtime failures.

## Scope
Production incidents, call failures, quality regressions, packet analysis, logs, metrics, and root cause.

## MUST
- Investigation MUST establish a timeline and correlate signaling, transport, media, and infrastructure evidence.
- Hypotheses MUST be tested against observable data before broad corrective changes.
- Packet captures or sensitive diagnostics MUST follow approved privacy and access controls.
- Fixes MUST include regression evidence for the bounded root cause or failure mode.

## MUST NOT
- MUST NOT treat agent or engineer confidence as evidence.
- MUST NOT change multiple independent production variables during diagnosis without controlled reasoning.
- MUST NOT expose credentials or raw sensitive media in incident artifacts.

## SHOULD
- Distinguish root cause, contributing factors, trigger, and detection gap.

## Exceptions
During active severe incidents, mitigation may precede full root-cause proof with incident authority and rollback safeguards.

## Verification
Review incident timeline, traces, RTC stats, packet evidence, change history, hypothesis log, and regression tests.