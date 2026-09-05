# Reproducibility Rules

## Purpose
Ensure important training results can be reconstructed and independently audited.

## Scope
Code, data, environment, configuration, randomness, hardware assumptions, and evaluation artifacts.

## MUST
- Decision-driving runs MUST capture code revision, resolved config, data versions, tokenizer, environment image, seeds, hardware topology, and checkpoint identifiers.
- Reproduction expectations MUST state tolerated numerical and metric variance rather than promising impossible bitwise identity.
- Critical preprocessing and evaluation artifacts MUST be versioned with the run.
- A release candidate MUST be reconstructible from recorded artifacts without relying on undocumented operator actions.
- Known nondeterministic components MUST be identified when they can affect conclusions.

## MUST NOT
- MUST NOT call a result reproducible when required data, code, or configuration is unavailable.
- MUST NOT overwrite experiment metadata after the fact without preserving history.
- MUST NOT use untracked local patches for release-relevant training.

## SHOULD
- Important methods SHOULD be reproduced at smaller scale or by an independent run before major commitments.
- Run manifests SHOULD be generated automatically.

## Exceptions
Third-party dependencies that cannot be archived require a pinned external identifier and documented availability risk.

## Verification
Attempt manifest-based reconstruction, compare resolved configs and artifact hashes, inspect environment digests and code revisions, and quantify repeat-run variance.