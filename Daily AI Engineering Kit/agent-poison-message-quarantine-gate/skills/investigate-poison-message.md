# Investigate Poison Message

## Purpose / when to use
Determine why one logical queue message repeatedly fails and whether it is transient, contract-invalid, business-invalid, or an environment/tool failure.

## Inputs and preconditions
Message ID/source, attempt count, sanitized payload or hash/reference, error evidence, consumer version, queue retry policy. Read access is sufficient.

## Allowed tools
Repository/file search, logs, tests, local commands, read-only queue metadata. No production mutation.

## Procedure
1. Record message ID, source, attempt, timestamps, consumer version, and exact error.
2. Trace the consumer entry point and deserialization/validation/business side effects.
3. Compare payload shape with the accepted contract and nearby passing messages without exposing secrets.
4. Classify facts, hypotheses, and open questions separately.
5. Reproduce locally/test with the smallest sanitized fixture when possible.
6. Classify failure as `timeout`, `rate-limit`, `temporary-unavailable`, `validation`, `deserialization`, `business-rule`, or `unknown-contract`.
7. For transient categories, prove the attempt is within/outside the configured retry budget.
8. For non-transient or exhausted failures, create a quarantine envelope with `scripts/quarantine_gate.py`.
9. Verify envelope integrity and hand it to the verifier.

## Output
Finding, evidence, confidence, affected consumer, category, recommended correction, quarantine path, unresolved risks.

## Verification / failure handling
A classification requires cited log/test/repository evidence. If evidence conflicts, use `unknown-contract` and stop. Tool/permission/environment failures are not message failures; preserve evidence and escalate. Never retry beyond policy.

## Stop conditions
Stop when classification is evidence-backed and envelope verified, or when missing access/evidence prevents safe classification.
