# Research

## Topic
Windows Sandbox Read-Boundary Attestation

## Category
Security

## Problem
A filesystem sandbox can report a restrictive read policy while the effective native-Windows ACL state does not actually block reads outside the intended root. The inverse failure also occurs: deny-read ACL setup can fail closed in a way that makes the sandbox unusable. Configuration intent alone is therefore insufficient evidence that the read boundary is both enforced and operational.

## Why it matters now
Fresh September 2026 Codex reports show that this boundary is still unstable. On 2026-09-02, an issue demonstrated that `:root = "deny"` with a single reopened read root still allowed reads elsewhere on native Windows. On 2026-09-05, another issue reported `apply deny-read ACLs` failures blocking Computer Use and CLI execution entirely. Earlier 2026 reports show the same subsystem can leave deny-read state empty, malformed after crashes, or inconsistent with effective execution placement.

## Affected users
Developers using native-Windows AI coding agents, platform teams embedding Codex-like sandboxes, security teams relying on filesystem read isolation, and agent operators protecting credentials, SSH material, source repositories, or other sensitive local files.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #42184, opened 2026-09-02, reports an elevated Windows sandbox accepting a documented restrictive permission profile while still allowing reads outside the explicitly reopened root.
2. OpenAI Codex issue #42958, opened 2026-09-05, reports the same deny-read ACL subsystem failing during setup and blocking Computer Use plus ordinary sandboxed CLI commands before the requested process starts.
3. OpenAI Codex issue #31265, opened 2026-07-06, reports valid `deny` filesystem rules not applying read denial while write denial still works; the deny-read ACL state remained empty.
4. OpenAI Codex issue #34841, opened 2026-07-22, reports `deny_read_acl_state.json` becoming malformed after a crash and causing persistent sandbox setup failure until the reconstructible state artifact is removed.
5. The public `deny_read_resolver.rs` implementation shows that Windows deny-read policies are resolved into concrete ACL targets, confirming that effective enforcement depends on translated runtime state rather than policy text alone.

### Interpretation
The recurring failure is a control-plane/data-plane mismatch. A policy can parse successfully yet fail to materialize into the expected ACLs, and corrupted or stale ACL state can also cause availability failures. A robust workflow needs runtime attestation that compares declared policy, canonical paths, probe outcomes, and sandbox health before sensitive agent work starts.

## Existing approaches
Current approaches include permission profiles, `:root` deny plus narrow re-open rules, elevated Windows sandbox users, ACL-based deny-read enforcement, sandbox logs, diagnostic state files, and manual reproduction with test reads. These are necessary controls but are usually inspected separately.

## Remaining limitations
- Policy parse success does not prove effective read denial.
- Write-deny success does not imply read-deny success.
- ACL state can be empty, stale, or malformed while configuration remains unchanged.
- Read-deny setup failures can block all normal work, creating pressure to disable protection.
- Manual probes are inconsistent and easy to omit after upgrades, crashes, or configuration changes.
- A single successful denied read is a confidentiality boundary failure even if most paths remain protected.

## Root-cause analysis
1. Effective Windows ACL state is derived from higher-level policy and can diverge from it.
2. Path canonicalization and special-scope expansion introduce translation complexity.
3. Persisted ACL state can outlive process failures and become inconsistent with expected policy.
4. Agent hosts often trust configuration status rather than executing negative read probes.
5. Health checks frequently validate workspace access but not sensitive out-of-bound paths.

## Improvement opportunity
Introduce an evidence-driven read-boundary attestation gate. The gate consumes a declared policy and probe observations from the sandbox harness, canonicalizes paths, verifies that every forbidden probe was denied, verifies allowed probes remain usable, rejects malformed or missing evidence, and emits a machine-readable attestation. Run it after installation/upgrades, sandbox state regeneration, permission-profile changes, crashes/reboots, and before any task that depends on local secret isolation.

## Relevant sources
- OpenAI Codex #42184, 2026-09-02: https://github.com/openai/codex/issues/42184
- OpenAI Codex #42958, 2026-09-05: https://github.com/openai/codex/issues/42958
- OpenAI Codex #31265, 2026-07-06: https://github.com/openai/codex/issues/31265
- OpenAI Codex #34841, 2026-07-22: https://github.com/openai/codex/issues/34841
- OpenAI Codex `deny_read_resolver.rs`: https://github.com/openai/codex/blob/main/codex-rs/windows-sandbox-rs/src/deny_read_resolver.rs

## Proposed solution
The package does not modify ACLs or weaken the sandbox. It provides a preflight attestation procedure, an enforceable rule set, a deterministic evidence validator, a bounded verification workflow, and regression tests. Any uncertainty blocks completion and requires operator review rather than silently falling back to broader access.
