# Core Skills

## Skill 1 — Nested Trust-Root Discovery

**Purpose**  
Find repository/configuration roots where parent security assumptions may stop applying.

**Trigger**  
Before task start, before delegation into a child directory, after dependency/submodule/vendor changes, and before final verification.

**Inputs**  
Workspace root, `config/policy.json`, optional previous trust report.

**Preconditions**  
Workspace is locally readable; scanner runs read-only.

**Required context**  
Parent workspace root, expected sandbox/permission policy, approved nested roots.

**Tools**  
`scripts/nested_trust_guard.py`, filesystem metadata, Git metadata paths.

**Procedure**
1. Capture the parent root and policy hash/version.
2. Run the scanner from the parent root.
3. Enumerate nested Git markers and nested `.claude`, `.codex`, `.agents` roots.
4. Record active non-sample Git hooks without reading secrets.
5. Compare each root with the explicit allowlist.
6. Classify unknown/changed roots as untrusted.
7. Persist only the sanitized JSON report.

**Decisions**  
- Unknown nested root → block write/delegation until classified.
- Active nested hook → require review/approval before any operation that could trigger it.
- Nested agent settings → prove policy equivalence/strengthening or block re-rooting.

**Constraints**  
Never modify metadata, execute hooks, source config files, or follow directory symlinks.

**Expected output**  
Trust-root inventory, violation list, metrics and pass/block status.

**Metrics**  
Nested roots discovered, config roots discovered, active hooks found, unknown roots, violations.

**Verification**  
Run against fixtures containing nested repo + nested settings; all must be detected.

**Failure handling**  
Scanner error or unreadable path is treated as unknown boundary and blocks high-risk operations.

**Stop conditions**  
Stop when all roots are classified or an unresolved violation requires human decision.

---

## Skill 2 — Parent/Child Policy Attestation

**Purpose**  
Prevent silent security weakening when an agent/subagent re-roots into a nested project.

**Trigger**  
Before spawning a subagent or changing project root/cwd into a nested root.

**Inputs**  
Parent policy contract, child config paths, trust report.

**Procedure**
1. Identify the exact child root.
2. Verify it exists in the current trust report.
3. Determine whether child settings introduce or omit sandbox, network, filesystem, approval, hooks, or tool restrictions.
4. Normalize comparison into `same`, `stronger`, `weaker`, or `unknown`.
5. Permit only `same`/`stronger` automatically.
6. Send `weaker`/`unknown` to human approval; do not delegate first and inspect later.
7. Re-attest after child settings change.

**Constraints**  
No policy field may be assumed inherited merely because it is absent in the child file.

**Expected output**  
Attestation containing parent contract ID, child root, comparison result, evidence paths, approval requirement.

**Verification**  
A fixture where child settings omit the parent sandbox must classify as `unknown`/`weaker`, never `same`.

**Failure handling / stop**  
Ambiguous merge semantics → fail closed and require host-specific confirmation.

---

## Skill 3 — Nested Metadata Change Review

**Purpose**  
Control persistence-capable changes to nested `.git` and agent-control metadata.

**Trigger**  
Planned writes affecting nested `.git/**`, `.claude/**`, `.codex/**`, `.agents/**`.

**Inputs**  
Change plan, target path, trust report, approval record.

**Procedure**
1. Resolve the target path relative to parent workspace.
2. Determine owning nested trust root.
3. Classify action: hook/config/policy/ordinary source.
4. For hook/config/policy changes, capture intended exact paths and reason.
5. Require explicit human approval scoped to those paths/actions.
6. Apply change only after approval.
7. Re-run trust scanner and independently verify diff.
8. Reject unexpected metadata files or privilege expansion.

**Metrics**  
Unapproved metadata writes = 0; post-change scans passing = 100%.

**Stop conditions**  
Unexpected path expansion, approval mismatch, or new root discovered → stop immediately.
