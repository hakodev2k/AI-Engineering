# Verify Cross-Agent Handoff

## Purpose
Independently verify that a received handoff is internally consistent, evidence-backed, current enough for action, and safe to consume.

## When to use
Use before acting on a handoff that claims work is ready, completed, or verified; always use for high-risk tags.

## Inputs
- Handoff envelope.
- Repository state and referenced artifacts.
- Test/build/log evidence when cited.
- Required approvals for high-risk decisions.

## Preconditions
The verifier did not produce the high-risk implementation being verified.

## Allowed tools
Read/search repository, inspect diffs, hash files, run non-destructive tests/builds, inspect logs, and use read-only external systems needed to reproduce evidence.

## Constraints
Do not infer missing evidence. Do not mark `verified` merely because the JSON validates. Do not perform approval-required actions.

## Procedure
1. Run `python scripts/handoff_gate.py <handoff.json> --verify-files` when local artifacts are referenced.
2. Confirm producer and consumer roles are appropriate for the workflow stage.
3. Resolve every evidence reference used by a confirmed fact.
4. Re-check volatile evidence if repository, logs, APIs, or environment could have changed.
5. Recompute hashes for local artifacts and compare them with the envelope.
6. Check that hypotheses are labeled and not presented as facts.
7. Confirm decisions do not hide pending approval requirements.
8. Re-run the smallest deterministic checks needed to substantiate the claimed result.
9. For high-risk work, verify under a distinct verifier identity.
10. If all required checks pass, set verification status to `passed` and status to `verified`; otherwise set `failed` or `blocked` with evidence.
11. Re-run the deterministic gate with `--independent-verifier <name>` for high-risk verified handoffs.

## Expected output
A validated handoff with verification status matching reproduced evidence, plus explicit failed or blocked checks when applicable.

## Verification
All required checks have concrete evidence; local artifact hashes match; independent-verifier rule passes for high-risk tags.

## Failure handling
Transient test/tool failures may be retried at most twice after collecting the first failure output. Deterministic validation failures are not retryable without changing the envelope. Permission failures stop verification and produce `blocked` status.

## Stop conditions
Stop after two transient retries, on required approval absence, on evidence contradiction, on artifact hash mismatch, or when the repository state no longer matches the evidence context.
