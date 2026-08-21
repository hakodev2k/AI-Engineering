# Archive Threat Assessment

## Purpose
Determine whether an uploaded archive is safe to inspect or extract before any file is written outside a quarantine area.

## When to use
Use for ZIP uploads, CI artifacts, customer imports, plugin bundles, agent-downloaded packages, or any untrusted archive.

## Inputs
- Archive path
- `config/archive-policy.yaml`
- Intended extraction destination
- Business requirement for accepted archive contents

## Preconditions
- Archive is stored outside production content roots.
- No extraction has occurred.
- Scanner has read permission only.

## Allowed tools
Read-only filesystem inspection, Python, repository search, antivirus/malware scanner if separately available.

## Constraints
Do not execute archive content. Do not follow links. Do not weaken policy to make a failing archive pass.

## Procedure
1. Confirm archive format and byte size.
2. Run `python scripts/archive_safety_gate.py <archive> --policy config/archive-policy.yaml --output scan-result.json`.
3. Inspect status, entry count, total expanded size, normalized paths, link flags, per-entry size, and compression ratios.
4. Separate confirmed violations from hypotheses about malicious intent.
5. For `block`, preserve the archive hash and `scan-result.json`; do not extract.
6. For `error`, classify whether format, environment, dependency, or permissions caused the failure.
7. For `pass`, hand off to `safe-extraction.md`.

## Expected output
A scanner result with `pass`, `block`, or `error`, plus evidence for every blocked entry.

## Verification
Scanner exit code is 0 only for `pass`; blocked archives produce exit code 2; scanner failures produce exit code 3.

## Failure handling
Retry a transient filesystem read failure once. Do not retry malformed archives or deterministic policy violations.

## Stop conditions
Stop immediately when traversal, unsafe links, expansion limits, duplicate normalized paths, or policy limits are violated.
