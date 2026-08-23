# Secret-Zero Safety Rules

## MUST
- Establish how the workload obtains its first credential before changing authentication code.
- Prefer workload identity, OIDC federation, managed identity, or an approved local credential chain over stored long-lived credentials.
- Treat scanner findings as leads and verify the runtime path before changing code.
- Redact credential values from evidence, logs, prompts, commits, and reports.
- Run positive authentication tests and negative tests proving an untrusted identity cannot authenticate.
- Require explicit human approval before changing production identity bindings, trust relationships, secret stores, or permission grants.

## MUST NOT
- Commit client secrets, API keys, passwords, private keys, refresh tokens, or production access tokens.
- Ask a human to paste a production secret into agent context to unblock investigation.
- Disable certificate, issuer, audience, signature, or TLS validation to make bootstrap succeed.
- Broaden IAM permissions when the evidence only shows a credential-acquisition failure.
- Delete or rotate a credential as an automated remediation; rotation is an approval-controlled operational action.
- Print detected secret values. Evidence must contain only location, category, and redacted markers.

## SHOULD
- Use short-lived, automatically renewable credentials with an auditable identity.
- Keep provider-specific identity configuration isolated from core application logic.
- Test expired/unavailable identity-provider behavior and preserve bounded retry/backoff.
- Remove obsolete bootstrap-secret references only after proving the replacement path works.
