# Research — Hook Source Provenance Trust Guard

## Topic
Source-scoped trust and provenance for AI coding-agent hooks.

## Category
Security

## Problem
Hook systems execute commands at privileged lifecycle points, but hook review can collapse multiple sources into one user configuration or present a broad `Trust all` choice. When provenance is missing, users cannot safely approve only the hooks installed by one plugin/integration.

## Why it matters now
On 2026-08-21, Codex issue #39826 described a profile with 19 pending hooks where only 3 came from a newly installed integration; compatibility installation into `~/.codex/hooks.json` caused those hooks to appear as generic user config. The requested safe operation is exact-hash, source-scoped approval. Current Claude Code documentation also treats plugin hooks as executable components and exposes their source because hooks run automatically in the user's environment.

## Affected users
Developers installing plugins/skills, enterprise coding-agent administrators, plugin authors and platform builders implementing hook review/trust stores.

## Current public evidence

### Observed evidence
1. **OpenAI Codex issue #39826, 2026-08-21.** A real profile mixed 3 new integration hooks with 16 unrelated pending hooks; `Trust all` was too broad, and compatibility installation caused the integration's hooks to appear as `User config`. The request proposes exact-hash, source-scoped trust. https://github.com/openai/codex/issues/39826
2. **Claude Code hooks documentation.** Hooks can come from managed policy, plugins, project/user/local/session sources; `/hooks` shows source, and `allowManagedHooksOnly` can restrict execution to managed hooks. https://code.claude.com/docs/en/hooks
3. **Aident, 2026-08-06.** Codex hook-trust troubleshooting warns not to retain `--dangerously-bypass-hook-trust` as a fix and documents review of the exact current hook/hash. https://aident.ai/blog/fix-codex-desktop-project-hooks-not-running-trust
4. **Anthropic advanced patterns guidance.** Hook guidance warns that hooks execute arbitrary shell commands with full user permissions and recommends using hooks only from trusted sources. https://resources.anthropic.com/hubfs/Claude%20Code%20Advanced%20Patterns_%20Subagents%2C%20MCP%2C%20and%20Scaling%20to%20Real%20Codebases.pdf

### Interpretation
Command hashing protects against silent command mutation but does not answer who supplied a hook. Source labels without exact content binding are also insufficient. Safe review requires both content identity and source provenance.

## Existing approaches
Per-hook command hash trust; workspace/project trust; read-only hook browsers showing source; managed-only enterprise policy; broad `trust all`; manual review of source path and command text.

## Remaining limitations
Compatibility installers can flatten plugin hooks into user config and erase origin. Broad approval spans unrelated pending hooks. Source labels may drift across plugin updates or storage migrations. Trusting a plugin name alone is unsafe if command content changes. Bypass flags eliminate the trust boundary.

## Root-cause analysis
1. Trust stores key command content but may not retain durable installer/source identity.
2. Configuration storage location is mistaken for provenance.
3. Review is batched by pending state rather than trust domain/source.
4. Plugin update invalidation is not always source-local.
5. Compatibility installers lack first-class provenance metadata.

## Improvement opportunity
Maintain a deterministic provenance ledger binding `source_id + source_version + hook_event + command_hash`. Review only exact hashes for one intended source; leave unrelated hooks unchanged. Any command/source mutation invalidates only the affected record.

## Goal
Preserve least-privilege human approval while making multi-hook plugin review practical and auditable.

## Metrics
Unattributed-hook rate; global approval events; changed hashes caught; unrelated hooks accidentally approved; review time per source.

## Trigger
Plugin/integration install or update, new/changed hook prompt, compatibility installer change, or provenance mismatch.

## Inputs
Current hook declarations, installer/plugin metadata, existing provenance ledger and policy.

## Outputs
Source-scoped trusted/pending/stale records and deterministic verification exit status.

## Relevant sources
- https://github.com/openai/codex/issues/39826
- https://code.claude.com/docs/en/hooks
- https://aident.ai/blog/fix-codex-desktop-project-hooks-not-running-trust
- https://resources.anthropic.com/hubfs/Claude%20Code%20Advanced%20Patterns_%20Subagents%2C%20MCP%2C%20and%20Scaling%20to%20Real%20Codebases.pdf
