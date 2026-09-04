# Skill: Review Finding Triage

## Purpose
Convert an AI-generated code-review finding into a confirmed, rejected, or human-review-required record backed by repository evidence.

## When to use
Use for AI review comments that may block merge, trigger remediation, or consume significant engineering time.

## Inputs
- finding claim and severity;
- repository and changed diff;
- relevant tests/specifications;
- `config/triage-policy.json`.

## Preconditions
- repository is readable;
- finding references code in the repository or a documented external contract;
- no dangerous action is required merely to investigate.

## Allowed tools
Read/search repository files, Git diff/history, test/build/static-analysis commands, local runtime reproduction, and official specifications already approved for use.

## Constraints
Follow `rules/triage-rules.md`. Treat LLM output as a hypothesis until independently evidenced.

## Procedure
1. Restate the claim as a falsifiable proposition.
2. Locate the exact changed code, call sites, tests, and nearby implementation.
3. Record repository facts separately from the reviewer's hypothesis.
4. Identify the smallest evidence source that can prove or disprove the claim.
5. Reproduce with a focused test, static analysis, runtime case, or direct repository proof.
6. If the claim is false, record the contradiction and set `status=rejected`.
7. If true, determine actual severity from reachable impact rather than reviewer wording.
8. If evidence is unavailable or depends on business/external intent, set `status=needs-human-review`.
9. For confirmed findings, propose the smallest safe remediation and required verification.
10. Hand the record to the Verification Agent before a blocking decision.

## Expected output
A finding record compatible with `schemas/finding.schema.json`.

## Verification
Run `scripts/validate-findings.py`. Blocking findings also require independent `verification.result=verified`.

## Failure handling
Retry evidence collection at most twice when failures are transient or caused by an incorrect reproduction setup. Preserve failed commands. Stop on permission failures, inaccessible required systems, or ambiguous business intent.

## Stop conditions
Stop when the finding is rejected with evidence, confirmed and independently verified, or classified `needs-human-review` with the missing decision/evidence identified.
