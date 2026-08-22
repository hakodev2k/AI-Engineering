# SEO Incident Response Rules
## Purpose
Restore search visibility safely when technical or content failures create material impact.
## Scope
Deindexing, crawl failures, migration regressions, manual actions, template defects, and traffic collapses.
## MUST
- Confirm scope, onset, affected segments, recent changes, and measurement integrity before broad remediation.
- Preserve evidence and identify the smallest reversible corrective action consistent with user safety.
- Escalate changes involving broad noindex, robots, redirects, domain configuration, or production rollback to authorized owners.
- Verify recovery through technical signals and search data after remediation.
## MUST NOT
- Make multiple untracked emergency SEO changes that prevent root-cause isolation.
- Claim recovery before leading and lagging indicators support it.
## SHOULD
- Maintain runbooks for high-impact recurring failure modes.
## Exceptions
Immediate rollback may precede full diagnosis when a known release clearly caused severe impact and rollback is approved.
## Verification
Timeline, diffs, logs, crawl/index evidence, incident notes, and recovery metrics.