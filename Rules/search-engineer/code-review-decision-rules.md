# Code Review and Senior Decisions

## Purpose
Ensure search changes receive evidence-based review proportional to their blast radius.

## Scope
Pull requests, design decisions, risk assessment, technical debt, and approvals.

## MUST
- Explain user-visible relevance, correctness, latency, security, freshness, and operational impact for material changes.
- Provide reproducible evidence for claims that influence approval.
- Escalate ambiguous requirements when different interpretations can materially change search behavior.
- Require independent review for high-risk ranking, security, migration, and production-control changes.
- Record significant trade-offs and rejected alternatives when future maintainers would otherwise lose decision context.

## MUST NOT
- Treat agent confidence, intuition, or a few hand-picked queries as sufficient evidence.
- merge known critical regressions merely to meet a deadline without explicit risk acceptance.
- hide operational debt introduced by temporary search workarounds.

## SHOULD
- Keep pull requests scoped so relevance and operational effects are reviewable.
- Prefer reversible decisions under high uncertainty.

## Exceptions
Exceptions require reason, evidence, risk, owner, verification, and approval proportional to impact.

## Verification
Review PR descriptions, evaluation artifacts, test results, architecture decisions, approvals, and follow-up tracking.