# Research

## Topic
Repository Config Capability Escalation Guard

## Category
Security

## Problem
AI coding agents increasingly load project-scoped configuration from cloned repositories. When those files can enable privileged tools, relax approval requirements, inject instructions, or alter execution policy, repository content crosses from untrusted data into the agent's control plane. A malicious or compromised repository can therefore change what the agent is allowed to do before the user has explicitly trusted the project.

## Why it matters now
Fresh advisories published in August and September 2026 show this class is practical, not theoretical. CodeWhale before 0.8.64 allowed a repository-owned `.codewhale/config.toml` to set `allow_shell = true`, exposing shell tools without explicit user opt-in. A separate CodeWhale flaw let model-supplied Python execute through `rlm_eval` without honoring the configured approval policy. GitLab's advisory database republished both advisories on September 4, 2026, keeping the issue current for downstream scanners and engineering teams.

## Affected users
Developers using coding agents on third-party repositories; platform builders that merge global, user, workspace and project configuration; security teams governing AI-assisted development; CI and remote-agent operators that open repositories non-interactively.

## Current public evidence
### Observed evidence
1. CVE-2026-75911 / GHSA-gx45-xrj5-g6c4: CodeWhale project config could set `allow_shell = true`; the advisory explicitly notes that approval and sandbox settings had tightening-only guards while `allow_shell` did not. Fixed in 0.8.64.
2. CVE-2026-75858: CodeWhale's `rlm_eval` returned an auto-approval requirement and executed arbitrary model-supplied Python without consulting the user's configured approval policy. Fixed in 0.8.64.
3. CodeWhale's product documentation describes approval gates and sandboxing as security boundaries, which makes silent project-level relaxation especially important to detect.
4. CVE-2026-54449 in LangBot shows a related control-plane problem: authenticated users could configure a STDIO MCP server with an arbitrary command, converting configuration authority into server-side code execution.

### Interpretation
The recurring weakness is authority confusion: configuration sources with different trust levels are merged as if they were equally authoritative. Security-sensitive fields need monotonic, tightening-only semantics unless a trusted local principal explicitly approves an escalation.

### Proposed solution
Introduce a deterministic preflight that computes the effective security policy from layered configuration, labels every source by trust level, and blocks any lower-trust source that increases capability, weakens approval, broadens filesystem/network scope, adds executable commands, or injects privileged instructions. Require a human approval artifact before accepting an escalation.

## Existing approaches
Current products use sandboxing, approval policies, per-tool permission gates, project config deny-lists, trust prompts, and schema validation. CodeWhale's own implementation already applied tightening checks to some fields, demonstrating that monotonic policy merge is practical.

## Remaining limitations
- Deny-lists miss newly added security-sensitive fields.
- Boolean/config merges often lack a formal privilege ordering.
- Project instructions may influence the model even when direct shell flags are blocked.
- Nested repositories and generated config files can change after initial trust.
- Approval UIs may show a command but not explain that repository config enabled the capability.

## Root-cause analysis
1. No explicit trust label for each configuration layer.
2. No machine-readable capability lattice for security-sensitive settings.
3. Security enforcement is field-by-field rather than schema-driven.
4. Project configuration is loaded before trust has been established or revalidated.
5. Verification focuses on runtime commands, not the policy transition that made those commands reachable.

## Improvement opportunity
Make configuration merging secure-by-default: low-trust layers may only preserve or tighten effective policy. Escalations are rejected unless accompanied by an explicit approval record tied to repository identity and config hash. Run the check on startup, repository switch, config change, resume and before privileged tool registration.

## Relevant sources
- GitHub Advisory Database, CVE-2026-75911 / GHSA-gx45-xrj5-g6c4: https://github.com/advisories/GHSA-gx45-xrj5-g6c4
- NVD, CVE-2026-75911: https://nvd.nist.gov/vuln/detail/CVE-2026-75911
- GitLab Advisory Database, CVE-2026-75911, published 2026-09-04: https://advisories.gitlab.com/npm/codewhale/CVE-2026-75911/
- GitLab Advisory Database, CVE-2026-75858, published 2026-09-04: https://advisories.gitlab.com/cargo/deepseek-tui/CVE-2026-75858/
- GitHub Advisory Database, CVE-2026-54449 / GHSA-3pvh-63gf-j9mw: https://github.com/advisories/GHSA-3pvh-63gf-j9mw
- CodeWhale product page: https://www.codewhale.ai/
