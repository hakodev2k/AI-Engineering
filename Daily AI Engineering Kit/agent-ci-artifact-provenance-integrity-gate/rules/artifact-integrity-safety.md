# Artifact Integrity Safety Rules

## MUST

- Bind every generated artifact manifest to the exact repository commit SHA used to build it.
- Compute SHA-256 for every artifact included in the configured artifact roots.
- Fail verification when an artifact is missing, added unexpectedly, or its size/hash differs from the recorded manifest.
- Preserve verification evidence in `provenance-result.json`.
- Treat release-signature verification as an approval boundary when policy requires it.
- Stop before publishing, deploying, signing, or replacing release artifacts unless required approval already exists.
- Use least-privilege credentials and never print secrets, signing keys, tokens, or certificate private material.

## MUST NOT

- Do not regenerate a manifest after detecting tampering and then call the artifact verified.
- Do not silently ignore files under configured artifact roots.
- Do not accept a build whose expected commit differs from `git rev-parse HEAD`.
- Do not weaken signature, provenance, or artifact-root policies to make a failing build pass.
- Do not perform release publication, production deployment, force push, history rewrite, secret rotation, or destructive cleanup without explicit human approval.

## SHOULD

- Generate the manifest immediately after deterministic build output is produced.
- Verify the manifest again in the release/publish stage using a clean checkout or isolated runner.
- Store verification outputs alongside CI logs for auditability.
- Keep ignored artifact patterns narrow and review changes to them as security-sensitive configuration.
