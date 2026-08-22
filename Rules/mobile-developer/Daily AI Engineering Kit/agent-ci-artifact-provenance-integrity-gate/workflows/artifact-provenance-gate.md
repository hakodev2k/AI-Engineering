# Artifact Provenance Gate Workflow

## Trigger
Run after CI build output is produced, before release publication, or when artifact provenance is questioned.

## Entry conditions
Repository checkout, Git metadata, configured artifact roots, Python 3.9+, and build outputs are available.

## Inputs
Expected commit SHA, policy, artifact roots, optional existing manifest, CI logs.

## Stages
1. **Context** — identify the exact commit, build command, artifact roots, and release intent.
2. **Generate manifest** — only immediately after a trusted build: `python scripts/provenance_gate.py --write-manifest --expected-commit <sha>`.
3. **Checkpoint** — preserve `artifact-manifest.json` with the CI run evidence.
4. **Verify** — run `python scripts/provenance_gate.py --expected-commit <sha>` in a later isolated stage.
5. **Investigate** — Provenance Investigator handles mismatches without altering evidence.
6. **Retest** — after a legitimate rebuild/remediation, verification may be retried at most 2 times.
7. **Independent verification** — Verification Agent confirms commit binding, artifact hashes, manifest completeness, and policy.
8. **Approval** — release signing/publication stops for explicit human approval when required.
9. **Complete** — only `verified` satisfies automated Definition of Done.

## Tools
Git read commands, CI logs, Python gate, package tests, JSON/schema validation.

## Produced artifacts
`artifact-manifest.json`, `provenance-result.json`, investigation evidence when needed.

## Retry rules
Maximum 2 retries. Retry only transient tool/environment failures or after a concrete rebuild/remediation. Preserve prior manifests, results, hashes, and logs. Hash/commit mismatches themselves are not transient.

## Stop conditions
Permission failure, unexplained commit mismatch, tampering evidence, invalid manifest, policy failure after 2 retries, or approval-required release signing.

## Failure paths
Transient tool failure → preserve evidence → retry up to 2 times. Deterministic mismatch → investigate → approved rebuild/remediation → verify. Permission/environment failure → stop and escalate. Approval boundary → `needs-approval` and stop.

## Definition of Done
The expected commit equals HEAD, every configured artifact has a matching SHA-256 and size in the manifest, no unexpected/missing artifact remains, verification output is valid, package tests pass, and any required release approval/signature evidence exists.
