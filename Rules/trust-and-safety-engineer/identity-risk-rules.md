# Identity Risk Rules

## Purpose
Use identity and account-integrity signals proportionately to detect abusive actors without treating identity uncertainty as proof of wrongdoing.

## Scope
Applies to account creation, account recovery, linked-account analysis, device or network signals, impersonation risk, and account reputation.

## MUST
- Identity-risk signals MUST have documented semantics, provenance, retention, and known failure modes.
- Account linkage used for enforcement MUST distinguish deterministic links from probabilistic or heuristic associations.
- High-impact actions based on linked-account evidence MUST require corroboration proportional to the consequence.
- Account recovery and ownership disputes MUST have controls against takeover, retaliation, and malicious reporting.
- Impersonation controls MUST separate deceptive representation from legitimate parody, commentary, shared names, or authorized delegation according to applicable policy.
- Identity-sensitive data MUST be access-controlled and collected only when justified by a documented safety purpose.

## MUST NOT
- MUST NOT equate shared IP, device family, location, or behavioral similarity with the same person without supporting evidence.
- MUST NOT require invasive identity verification for all users merely because it simplifies abuse enforcement.
- MUST NOT expose account-linking logic or hidden identity relationships to unauthorized users or reviewers.
- MUST NOT propagate an account penalty to associated entities when association confidence is insufficient for that action.

## SHOULD
- Identity controls SHOULD be risk-tiered by feature capability and potential harm.
- Reputation SHOULD decay or be reviewable when historical signals become stale.
- Recovery paths SHOULD use multiple independent evidence sources for high-value accounts.

## Exceptions
Certain regulated or high-risk features MAY require stronger identity assurance. The requirement MUST be explicitly authorized, purpose-limited, and reviewed for privacy impact.

## Verification
Inspect identity-signal documentation, linkage confidence, enforcement joins, recovery flows, access permissions, retention configuration, and sampled linked-account decisions. Confirm probabilistic identity evidence is not represented as certainty.