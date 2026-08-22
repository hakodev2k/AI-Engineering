# Secret Safety Rules

## MUST
- Scan the exact working-tree or staged diff before commit/PR completion.
- Treat scanner findings as unverified sensitive material until classified.
- Redact suspected values from logs and reports; use SHA-256 hashes for correlation.
- Keep credentials outside tracked source files.
- Preserve scanner output and test/build evidence when a gate fails.
- Require explicit human approval before rotating production credentials, modifying secret-store permissions, rewriting Git history, or force-pushing.

## MUST NOT
- Do not echo, paste, summarize, or transmit detected secret values.
- Do not add a finding to the allowlist merely to unblock the workflow.
- Do not weaken patterns, severity, or entropy thresholds without approval.
- Do not commit `.env`, private-key files, credential exports, or local secret-store artifacts.
- Do not assume a secret is safe because it is expired or test-only without evidence.
- Do not silently increase repository, cloud, CI, or vault permissions.

## SHOULD
- Prefer environment variables or an existing project secret provider.
- Prefer synthetic fixtures that cannot be mistaken for live credentials.
- Keep allowlist entries narrow by path, detector, and value hash.
- Let an independent verifier review high/critical findings and all allowlist exceptions.
