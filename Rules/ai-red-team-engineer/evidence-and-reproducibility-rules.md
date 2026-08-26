# Evidence and Reproducibility

## Purpose
Ensure findings can be independently validated and distinguished from model variability.

## Scope
Test inputs, outputs, system state, model versions, tool calls, configurations, logs, and screenshots.

## MUST
- Preserve enough context to reproduce each material finding without relying on memory.
- Record model and application versions, relevant settings, timestamps, prerequisites, and repeated-trial behavior.
- Redact evidence according to data classification without removing security-relevant facts.

## MUST NOT
- Treat tester confidence as evidence.
- Fabricate missing traces or silently reconstruct evidence after the fact.

## SHOULD
Automate capture of deterministic metadata and retain minimal safe reproductions.

## Exceptions
If exact reproduction is unsafe, document bounded evidence, reason, and safer validation method.

## Verification
A reviewer should be able to follow the record, recreate authorized conditions, and reach a materially equivalent result.