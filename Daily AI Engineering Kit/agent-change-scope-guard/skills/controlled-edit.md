# Controlled edit skill
**Trigger:** An AI agent is asked to implement or refactor repository code.
**Inputs:** Task, acceptance criteria, base commit, path policy.
**Preconditions:** Git, Node.js 20+, repository checkout; approved policy.
**Tools:** Read/search files, Git read operations, editor, local tests, scope guard.
1. Record `git rev-parse HEAD` and `git status --porcelain`; stop on unexplained pre-existing changes.
2. Locate entry points, dependencies, and relevant tests; identify candidate paths.
3. Plan file changes; flag blocked paths for approval before edits.
4. Implement smallest patch, avoiding unrelated formatting churn.
5. Run relevant build/tests; capture commands, exit codes and logs.
6. Run `node scripts/scope-guard.mjs --mode working --base <baseline> --policy config/policy.json --report artifacts/scope-report.json`.
7. Review diff and report both test status and guard status.
**Output:** Patch, test evidence, scope report, remaining risks.
**Failure:** Guard exit 2: stop and request approval or narrow patch. Exit 3: fix environment/config once, then escalate.
**Stop:** Approval required, unknown baseline, failing checks, or verified completion.
