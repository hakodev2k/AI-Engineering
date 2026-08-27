# Attribution Rules

## Purpose
Prevent forensic evidence from being stretched into unsupported claims about actors, identities, or intent.

## Scope
Applies to attribution of actions to users, accounts, devices, malware families, organizations, or external actors.

## MUST
- Attribution MUST state the level being attributed: artifact, process, device, account, session, person, or actor group.
- Identity claims MUST account for shared accounts, credential theft, automation, delegation, remote access, and spoofing.
- Material attribution MUST cite independent corroborating evidence where available.
- Confidence and unresolved alternatives MUST be explicit.
- Intent claims MUST require evidence beyond technical execution alone.

## MUST NOT
- MUST NOT equate account use with human identity without corroboration.
- MUST NOT infer geopolitical or organizational attribution from commodity indicators alone.
- MUST NOT present probabilistic attribution as certainty.

## SHOULD
- Separate technical attribution from intelligence assessment.
- Prefer narrow claims that match evidentiary strength.

## Exceptions
Single-source attribution may be reported when uniquely identifying evidence exists, provided limitations and validation are documented.

## Verification
Review identity mappings, authentication evidence, device ownership, session data, alternate-access paths, and independent corroboration.