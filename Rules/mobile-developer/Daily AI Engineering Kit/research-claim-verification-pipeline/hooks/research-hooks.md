# Research Hooks

## PreResearch
**Trigger:** before evidence collection.

**Action:** confirm decision scope, claim-matrix path, and freshness requirements.

**Command:** no LLM hook required; adapter should assert required inputs exist.

**Failure behavior:** stop if scope or output path is missing.

## PostMatrixUpdate
**Trigger:** after Claim Analyst writes or revises the matrix.

**Action:** run deterministic schema/completeness validation.

**Command:**
```bash
python scripts/validate-claim-matrix.py research/claim-matrix.json
```

**Failure behavior:** block reviewer handoff and return validation errors.

## PreVerificationReview
**Trigger:** before independent review.

**Action:** verify that evidence references are present for all medium/high-impact claims.

**Command:** use the same validator; semantic entailment remains reviewer-owned.

**Failure behavior:** block review if mechanical requirements fail.

## PreDecisionHandoff
**Trigger:** before research conclusions are consumed by implementation, architecture, or publication.

**Action:** run final verification gate.

**Command:**
```bash
python scripts/check-verification-gate.py research/claim-matrix.json
```

**Failure behavior:** do not label findings verified. Surface `partially-verified` or `blocked` state.

## DangerousActionBoundary
**Trigger:** downstream action touches production, database schema, infrastructure, secrets, security controls, breaking public API changes, destructive Git/files, or large dependency upgrades.

**Action:** require explicit human approval outside this kit.

**Failure behavior:** stop. Verified research never substitutes for authorization.