# Child Safety Rules

## Purpose
Apply heightened safeguards to systems that may expose minors to exploitation, grooming, sexualization, predatory contact, coercion, or other severe harm.

## Scope
Applies to age-sensitive features, messaging, discovery, content, reporting, moderation, escalation, and evidence handling involving minors.

## MUST
- Child-safety risks MUST be treated as high severity and receive dedicated escalation paths.
- Features enabling contact, discovery, payments, media exchange, or location sharing MUST assess how minors could be targeted or exposed.
- Detection and review workflows MUST use specialized policy guidance for child-safety cases.
- Evidence handling MUST minimize unnecessary exposure and comply with applicable legal preservation and reporting obligations.
- Imminent-risk indicators MUST have clear escalation procedures to trained human responders.
- Product controls MUST support rapid containment of accounts, content, or interactions when evidence indicates serious child-safety risk.

## MUST NOT
- MUST NOT require reviewers without appropriate authorization to inspect highly sensitive child-safety evidence.
- MUST NOT reuse sensitive child-safety material for generic model training or demonstrations without explicit legal, privacy, and safety approval.
- MUST NOT delay containment of credible severe harm solely to gather additional engagement or experimentation data.
- MUST NOT expose internal detection methods in ways that materially aid predatory evasion.

## SHOULD
- Child-facing or mixed-age surfaces SHOULD use safer defaults and stronger contact controls.
- Age-assurance mechanisms SHOULD be proportionate, privacy-preserving, and evaluated for bypass risk.
- Teams SHOULD test grooming and migration-to-off-platform abuse patterns when relevant.

## Exceptions
Any exception to standard controls MUST be reviewed by the responsible child-safety, legal, and privacy owners when applicable, with documented rationale and compensating safeguards.

## Verification
Inspect threat models, age-sensitive feature reviews, escalation procedures, reviewer permissions, retention rules, incident samples, and emergency-response tests. Confirm severe cases can be contained and escalated without exposing sensitive evidence broadly.