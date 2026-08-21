# Pre-Commit Secret Scan Hook

## Trigger
Before commit, before PR preparation, and after an AI agent modifies repository files.

## Preconditions
Python 3.10+ is available and the repository can be read.

## Action
Run from the package root:

```bash
python scripts/scan-secrets.py --root . --config config/secret-scan.json --output .secret-scan-report.json
```

For repositories that vendor this package under a subdirectory, pass the repository root explicitly and keep the config path absolute or repository-relative.

## Expected result
Exit code `0` means no finding at a configured blocking severity was detected. Exit code `2` means blocking findings exist. Exit code `3` means scanner/configuration failure.

## Failure behavior
- Exit `2`: block commit/PR preparation, preserve the redacted report, and invoke `skills/secret-exposure-triage.md`.
- Exit `3`: block execution after at most 2 transient retries; do not bypass the scan automatically.

## Blocking
Yes. Bypass requires explicit human decision and documented evidence; do not add an allowlist entry automatically.
