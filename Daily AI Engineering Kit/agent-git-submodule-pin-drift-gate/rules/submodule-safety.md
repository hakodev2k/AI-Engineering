# Submodule Safety Rules

## MUST

- Run the scanner whenever `.gitmodules` or any 160000-mode gitlink changes.
- Review the referenced commit range for every gitlink movement, not only the parent repository diff.
- Treat submodule URL and branch-tracking changes as security-sensitive dependency changes.
- Preserve scanner output with PR/release evidence.
- Resolve dirty and uninitialized submodules before claiming verification success.
- Re-run the scanner after rebases, merges, or baseline changes.

## MUST NOT

- Accept a submodule pin solely because the parent diff shows one SHA line changed.
- Auto-initialize submodules from untrusted or newly changed URLs without human review.
- Use `git submodule update --remote` as an unbounded autonomous dependency update.
- Rewrite history, force push, delete data, deploy production, or weaken security controls as part of remediation without explicit approval.
- Discard dirty submodule work automatically.
- Report success when the referenced commit cannot be inspected.

## SHOULD

- Pin immutable commits rather than tracking floating branches.
- Prefer HTTPS/SSH URLs controlled by approved organizations.
- Record upstream release notes, commit range, tests, and provenance for pin updates.
- Keep implementing and verifying agents separate for security-sensitive submodule changes.