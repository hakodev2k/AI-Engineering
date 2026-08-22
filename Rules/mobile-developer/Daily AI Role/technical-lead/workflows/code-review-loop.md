# Code Review Loop

## Trigger
A workstream enters review-ready state.

## Flow
Author handoff -> Independent review -> classify findings -> author fix -> targeted verification -> reviewer close/reject.

## Finding severity
- P0: data loss/security/major production failure risk
- P1: incorrect behavior or broken contract
- P2: meaningful reliability/maintainability/test gap
- P3: optional improvement

## Rules
- P0/P1 block completion.
- Reviewer must include impact and evidence, not only preference.
- Author must address root cause or explain a technically supported alternative.
- After two unsuccessful loops, Technical Lead decides redesign, pairing, scope reduction, or escalation.

## Output
Resolved findings, open findings, accepted debt, verification evidence, final recommendation.