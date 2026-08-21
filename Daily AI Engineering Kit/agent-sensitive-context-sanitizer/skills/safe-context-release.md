# Safe Context Release Skill

## Purpose

Prepare and verify the exact artifact that an AI model, tool, or subagent is allowed to receive. This skill converts a classified candidate context into a release artifact with evidence.

## When to use

Use after sensitivity classification and before any boundary-crossing transmission.

## Inputs

- candidate context file;
- sanitization report;
- destination and purpose;
- sensitivity policy;
- approval record if policy requires one.

## Preconditions

- Candidate context has already been minimized.
- The current report was produced from the current candidate artifact.
- Destination and purpose have not changed since classification.
- Any deny finding has been removed or the workflow has stopped.

## Process

1. Confirm the candidate hash or identifier still matches the report.
2. Confirm every finding has a disposition.
3. For `redact` findings, generate a new release artifact using `scripts/redact-context.py`.
4. For `deny` findings, stop; do not create a releasable artifact containing them.
5. For `approval-required` findings, prefer removing the data. If removal makes the task impossible, require an exact human approval tied to destination, purpose, and artifact hash.
6. Inspect the sanitized artifact semantically for sensitive meaning that deterministic redaction may not capture.
7. Run `scripts/verify-sanitization-report.py` against the released artifact.
8. Confirm the destination adapter is configured to send the released artifact, not the candidate input.
9. Record release metadata: source hash, release hash, destination, purpose, decision, approval reference, verification status.
10. Send only after verification passes.
11. Mark the workflow `released` only after the destination operation succeeds.
12. Mark the workflow `verified` only after both sanitization verification and destination confirmation are available.

## Allowed tools

- deterministic redaction and verification scripts;
- file hashing/read-only inspection;
- destination metadata inspection;
- approved destination adapter after the gate passes.

## Constraints

- Never modify the original candidate in place.
- Never put raw sensitive values in evidence logs.
- Never reuse an approval after destination, purpose, or artifact changes.
- Never treat transport encryption as permission to disclose data.
- Never send the report as a substitute for the sanitized context if the report itself contains restricted metadata.

## Expected output

- sanitized release artifact;
- valid sanitization report;
- release decision;
- release metadata containing hashes and verification status;
- explicit status: `prepared`, `released`, or `verified`.

## Verification

Release is verified when:

1. report validation passes;
2. redaction spans are absent from the released artifact;
3. required approval exists and matches the exact release;
4. no denied category is intentionally disclosed;
5. adapter input points to the released artifact;
6. transmission outcome is recorded separately from sanitization outcome.

## Failure handling

- Redaction script failure: retry once from the original candidate; stop on repeat failure.
- Verification mismatch: regenerate once; stop if mismatch remains.
- Destination transmission transient failure: retry at most twice if the operation is idempotent and the artifact is unchanged.
- Destination changed during retry: invalidate prior release and restart classification.
- Approval missing or mismatched: stop and request exact approval.

## Stop conditions

Stop immediately when:

- policy denies disclosure;
- verification fails twice;
- candidate or destination changed after the report was produced;
- approval is broader or different from the exact release request;
- the only way to continue would require weakening policy or disabling a detector.