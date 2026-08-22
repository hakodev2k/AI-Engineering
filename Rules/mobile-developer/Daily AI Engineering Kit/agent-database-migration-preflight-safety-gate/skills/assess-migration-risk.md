# Assess Migration Risk

## Purpose
Convert migration evidence into explicit, testable risk findings and a preflight decision.

## Inputs
Generated SQL, evidence summary, `config/policy.yaml`.

## Process
1. Run `python scripts/preflight.py --input <sql> --policy config/policy.yaml --output preflight-result.json`.
2. Inspect every deterministic finding in source context.
3. Classify affected objects, expected data volume if repository evidence exists, reversibility, locking/rewrite risk, and compatibility with old/new application versions.
4. For new `NOT NULL` columns, verify a safe default/backfill sequence; otherwise require approval and remediation.
5. For UPDATE/DELETE, verify predicates and intended cardinality; predicate absence is blocking.
6. For drops/truncation, require explicit evidence that data loss is intended. Never downgrade configured `block` findings automatically.
7. Check whether schema and data transformations are safely staged.
8. Produce facts, hypotheses, findings, recommended remediation, approval requirements, and verification status.

## Expected output
A `pass`, `approval_required`, or `block` decision plus evidence for each finding.

## Verification
A pass is valid only if the deterministic scan ran successfully and all warnings were reviewed. Approval does not convert a blocking policy result to pass; the artifact must be remediated or handled outside this workflow.

## Failure handling
One remediation/test cycle is allowed for deterministic validation failures. Tool failures may be retried twice. Stop after the bound is reached.
