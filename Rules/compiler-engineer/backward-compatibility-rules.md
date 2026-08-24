# Backward Compatibility Rules

## Purpose
Manage language, flag, diagnostic, ABI, IR, and artifact evolution deliberately.

## Scope
User-visible compiler behavior and supported interoperability contracts.

## MUST
- User-visible breaking changes MUST be identified before release and assigned a migration strategy.
- Deprecated behavior MUST have documented replacement and removal policy where practical.
- Stable command-line and machine-readable interfaces MUST be compatibility-tested.
- Compatibility fixes MUST distinguish source, binary, behavioral, and tooling impact.

## MUST NOT
- MUST NOT repurpose an established option with incompatible meaning silently.
- MUST NOT remove accepted syntax or ABI behavior accidentally.
- MUST NOT treat internal implementation changes as harmless when outputs are contractual.

## SHOULD
- Breaking changes SHOULD provide staged diagnostics or feature gates.
- Compatibility policy SHOULD define which outputs are stable versus intentionally unspecified.

## Exceptions
Emergency breaks require documented risk, affected users, mitigation, and human approval.

## Verification
Use previous-version corpora, ABI tests, CLI snapshots, artifact compatibility tests, and release-diff review.