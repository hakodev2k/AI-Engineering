# Credentials and Secrets Handling Rules

## Purpose
Prevent security research from creating additional compromise through careless discovery, use, storage, or disclosure of credentials and secrets.

## Scope
Applies to passwords, API keys, tokens, cookies, private keys, certificates, recovery codes, connection strings, signing material, and temporary credentials encountered during research.

## MUST
- Discovered secrets MUST be treated as sensitive immediately, regardless of whether validity is confirmed.
- Validation MUST use the minimum action necessary to establish security relevance and MUST remain within authorized scope.
- Reports, screenshots, logs, and tickets MUST redact reusable secret material while retaining enough metadata to identify the affected credential.
- Secret values required for evidence MUST be stored only in approved restricted systems.
- The researcher MUST identify exposure path, privilege, scope, lifetime, and rotation or revocation status when known.
- Production secret rotation or revocation MUST be performed only by an authorized owner or with explicit approval and an operational plan.
- Temporary research credentials MUST use least privilege and be removed or expired after use.
- Tooling MUST be configured to avoid echoing secrets into command history, debug logs, telemetry, or generated artifacts.

## MUST NOT
- MUST NOT test discovered credentials against unrelated systems, accounts, or tenants.
- MUST NOT copy complete secrets into public issues, source repositories, chat messages, or ordinary documentation.
- MUST NOT rotate, revoke, or alter production credentials merely to prove control.
- MUST NOT retain valid secrets after the legitimate evidence or remediation need ends.
- MUST NOT infer broad compromise from one secret without validating its actual scope.

## SHOULD
- Prefer metadata, fingerprints, or partial identifiers in routine communication.
- Coordinate high-impact secret findings with incident response when exposure may indicate active compromise.
- Use dedicated secret scanning for research workspaces before publication or handoff.

## Exceptions
Full secret handling is permitted only when technically necessary, explicitly authorized, access-restricted, and documented with a retention and disposal plan.

## Verification
Inspect research artifacts, repository history, tickets, logs, storage permissions, and test accounts for leaked secrets. Confirm any production rotation had explicit approval and that temporary credentials are no longer active.