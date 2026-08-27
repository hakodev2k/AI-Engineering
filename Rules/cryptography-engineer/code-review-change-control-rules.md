# Code Review and Change Control Rules

## Purpose
Apply senior scrutiny to changes that can alter cryptographic security properties.

## Scope
Cryptographic code, configuration, dependencies, key policy, protocols, formats, and infrastructure.

## MUST
- Require qualified review for changes affecting algorithms, key handling, trust, verification, randomness, serialization, or protocol state.
- Make security-property changes explicit in the change description with tests and migration impact.
- Review generated configuration and infrastructure changes, not only application source.

## MUST NOT
- Merge security-critical cryptographic changes solely on passing generic unit tests.
- Bypass review, branch protection, or required checks to expedite routine delivery.
- Force-push shared protected history without explicit authorization.

## SHOULD
- Keep cryptographic changes small enough for reviewers to reason about independently.

## Exceptions
Emergency changes require accountable approval and retrospective review with evidence.

## Verification
Pull-request history, required-review settings, CI results, diffs, security tests, and approval records.