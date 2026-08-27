# Networking, XDP, and TC

## Purpose
Protect packet correctness, availability, and predictable behavior in eBPF networking paths.

## Scope
XDP, TC, socket/cgroup networking hooks, redirects, drops, parsing, checksums, MTU, and multi-program chains.

## MUST
- Packet parsing MUST bounds-check every variable-length access before dereference.
- Drop, redirect, and rewrite policies MUST define fail-open/fail-closed behavior explicitly.
- Packet mutations MUST preserve protocol validity, including checksums and length semantics where applicable.
- Multi-program ordering and ownership MUST be deterministic.
- Enforcement changes MUST have rollback and bypass procedures.

## MUST NOT
- MUST NOT assume headers are contiguous, present, or fixed-length without validation.
- MUST NOT introduce unconditional packet drops as an error fallback unless explicitly required and approved.
- MUST NOT deploy policy changes without representative traffic validation.

## SHOULD
- Keep parsing minimal and protocol-aware.
- Expose reason-coded counters for drop/redirect decisions.

## Exceptions
High-risk behavior requires documented threat/availability trade-off, tests, monitoring, and human approval.

## Verification
Use packet fixtures, malformed/truncated traffic, replay tests, load tests, counters, and staged deployment validation.