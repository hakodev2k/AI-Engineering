# Cryptographic Agility Rules

## Purpose
Enable controlled migration when algorithms, parameters, or libraries become unsuitable.

## Scope
Signature algorithms, key algorithms, hashes, protocol dependencies, and relying-party compatibility.

## MUST
- Approved cryptographic baselines MUST identify prohibited, transitional, and preferred algorithms.
- Algorithm migration MUST inventory issuers, subscribers, relying parties, hardware, and protocol constraints.
- Material algorithm changes MUST be tested against representative consumers before broad rollout.
- Emergency deprecation plans MUST define containment, migration order, and decision authority.

## MUST NOT
- MUST NOT introduce deprecated algorithms for new compatibility shortcuts without approved exception.
- MUST NOT assume algorithm support from documentation alone when production compatibility is consequential.
- MUST NOT claim migration readiness without dependency evidence.

## SHOULD
- Designs SHOULD avoid hard-coding a single algorithm where standards permit agility.

## Exceptions
Require bounded scope, compatibility evidence, risk acceptance, and retirement date.

## Verification
Scan certificate populations, inspect profiles, test clients, and review cryptographic inventories.