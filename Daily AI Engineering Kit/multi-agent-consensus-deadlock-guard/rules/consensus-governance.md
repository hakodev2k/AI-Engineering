# Consensus Governance Rules

## MUST
- Represent every material disagreement as a structured disagreement record.
- Separate claims, evidence, decisions, and unresolved questions.
- Require a new evidence delta after round 1 before another debate round is allowed.
- Preserve previous round evidence and fingerprints.
- Stop autonomous debate at `max_rounds` from `config/consensus-policy.json`.
- Use deterministic policy rules before requesting another LLM opinion.
- Require an independent verifier for high/critical risk resolutions.
- Bind high-risk reviews to the exact disagreement fingerprint.
- Escalate unresolved high-risk conflicts to `human-decision-required`.
- Preserve blocking failures and rejected alternatives in the final evidence bundle.

## MUST NOT
- Treat silence, timeout, missing response, or tool failure as agreement.
- Retry semantic disagreement without new evidence.
- Let the same agent be sole planner and verifier for high-risk work.
- Invent evidence, approvals, votes, or consensus.
- Change the disputed scope during debate without creating a new revision.
- Continue after a human-decision-required or blocked status.
- Use majority vote to override a deterministic safety or repository policy.
- Increase permissions to resolve disagreement.

## SHOULD
- Reduce disagreements to the smallest falsifiable claims.
- Prefer repository/tests/logs/API outputs over agent confidence scores.
- Resolve independent claims separately rather than coupling unrelated disputes.
- Record why rejected positions were rejected.
- Re-run only the tests/tools capable of producing relevant evidence.
