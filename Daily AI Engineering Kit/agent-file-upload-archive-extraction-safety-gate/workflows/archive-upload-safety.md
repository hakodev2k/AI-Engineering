# Archive Upload Safety Workflow

## Trigger
An untrusted ZIP is uploaded, downloaded by an agent, received as a CI artifact, or queued for import.

## Entry conditions
Archive bytes are present in quarantine and no extraction has occurred.

## Inputs
Archive path, `config/archive-policy.yaml`, intended destination/use.

## Stages
1. **Context** — Archive Inspector records source, trust level, byte size, intended use, destination.
2. **Structural gate** — Run `python scripts/archive_safety_gate.py <archive> --policy config/archive-policy.yaml --output scan-result.json`.
3. **Decision** — `block` stops; `error` is diagnosed; `pass` proceeds.
4. **Independent verification** — Verification Agent reproduces the result and checks policy consistency.
5. **Extraction** — For verified pass only, run the same script with `--extract-to <isolated-dir>`.
6. **Downstream inspection** — Validate expected file types/content before trusted ingestion.
7. **Complete** — Record evidence and remaining risks.

## Checkpoints
- CP1: No extraction before gate.
- CP2: Scanner status is `pass`.
- CP3: Independent verifier agrees.
- CP4: Extraction root containment holds.

## Retry rules
- Transient read/lock failure: maximum 1 retry after preserving error evidence.
- Tool/dependency failure: maximum 1 retry after environment repair.
- Policy violation, malformed archive, traversal, expansion limit, link violation: 0 retries.
- Repeated failure stops and escalates with the archive hash, scanner output, and error.

## Approval points
Human approval is required before weakening limits/security controls, trusting a blocked archive, production configuration changes, deleting active incident evidence, or changing upload behavior in a breaking way.

## Failure paths
- `block`: quarantine and report.
- `error`: preserve evidence; diagnose environment/format; do not extract.
- post-pass file-type/malware failure: quarantine extracted output and stop ingestion.

## Definition of Done
- Required context captured.
- Deterministic scan completed.
- Independent verification completed.
- No blocked content was extracted.
- If extracted, all targets remained inside isolated root.
- Tests/package verification pass for package changes.
- Required approvals are recorded.
- Remaining risks are documented.
