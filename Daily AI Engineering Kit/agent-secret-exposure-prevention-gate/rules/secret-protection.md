# Secret Protection Rules

## MUST
- Treat any credential-like value found in tracked or untracked source files as sensitive until disproven.
- Record findings with file path, line number, detector, severity, confidence, and redacted evidence.
- Redact secret values in chat, logs, reports, commits, issues, and pull requests.
- Stop before rotating, revoking, deleting, or changing any production credential; those actions require explicit human approval.
- Preserve the original finding location and Git status before remediation.
- Re-scan the changed scope after remediation and run repository tests/build when source code changed.
- Use least privilege for any credential inspection tool.
- If a confirmed secret reached Git history, report that history exposure explicitly even after the working tree is cleaned.

## MUST NOT
- Never print a complete suspected secret to stdout or a report.
- Never copy a suspected secret into another file for testing.
- Never commit real secrets to examples or fixtures.
- Never auto-rewrite Git history, force-push, revoke credentials, alter secret stores, or deploy to production.
- Never weaken a detector merely to make a scan pass without documented evidence for the exception.
- Never silently add broad allowlist patterns.
- Never claim a secret is invalid solely because a local API call failed.

## SHOULD
- Prefer replacing embedded credentials with environment variables or the repository's existing secret provider.
- Prefer narrowly scoped allowlist entries tied to path, detector, and a stable non-secret fingerprint.
- Separate confirmed findings from heuristic findings.
- Minimize unrelated edits during remediation.
- Preserve scan reports as CI artifacts when repository policy permits.
