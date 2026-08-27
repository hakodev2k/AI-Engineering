# Debugging and Investigation

## Purpose
Make eBPF failures diagnosable through evidence rather than speculation.

## Scope
Verifier failures, load/attach errors, missing events, wrong data, crashes, overhead regressions, and kernel differences.

## MUST
- Investigations MUST preserve kernel version/configuration, architecture, program artifact, loader version, attach state, and relevant verifier logs.
- Hypotheses MUST be tested against observable evidence before broad corrective changes.
- Missing telemetry MUST distinguish producer absence, attach failure, filtering, transport loss, and consumer loss.
- Production incidents MUST record exact active program/link/map state when feasible.

## MUST NOT
- MUST NOT treat agent or engineer confidence as evidence.
- MUST NOT suppress verifier diagnostics needed for root cause.
- MUST NOT make high-risk kernel or security changes solely to test a hypothesis without approval.

## SHOULD
- Minimize reproductions while preserving the failing kernel/context.
- Compare working and failing targets systematically.

## Exceptions
When evidence cannot be captured, document what is missing and bound conclusions accordingly.

## Verification
Review incident artifacts, reproduction steps, verifier output, bpftool/kernel-object state, traces, metrics, and hypothesis-to-evidence linkage.