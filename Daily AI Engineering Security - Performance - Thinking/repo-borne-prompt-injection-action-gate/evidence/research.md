# Research — Repository-Borne Prompt Injection Action Gate

**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Repository files, names, issue/PR text, comments, build output, and screenshots can carry indirect prompt injection that an AI coding agent may mistake for trusted instructions.

## Problem
Coding agents intentionally ingest repository-controlled content and often also possess shell, repository-write, network, issue/PR, or credential-adjacent capabilities. When content provenance is lost, attacker-authored text can influence side-effecting actions not explicitly authorized by the user.

## Why it matters now
Current vendor guidance and 2026 vulnerabilities show this as an active engineering boundary rather than a theoretical prompt-hardening concern. OpenAI's Codex Action security documentation explicitly lists repository instruction files, PR content, commit messages and screenshots as untrusted prompt-injection surfaces. GitHub's Copilot cloud-agent guidance treats prompt injection as a built-in risk. Eclipse Theia patched a high-severity repository-name prompt-injection vulnerability in 2026.

## Affected users
Coding-agent users, CI/automation maintainers, repository bots, IDE-agent builders, platform security teams, and maintainers accepting contributions from untrusted users.

## Current public evidence
### Observed evidence
1. OpenAI `codex-action` security documentation warns that PR bodies, commit messages, repository instruction files such as `AGENTS.md`, and screenshots can carry prompt injection and should be treated as untrusted input.  
   https://github.com/openai/codex-action/blob/main/docs/security.md
2. GitHub documentation for Copilot cloud agent explicitly lists prompt injection among the risks of an autonomous agent that can access code and push changes.  
   https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations
3. GitHub Advisory GHSA-3jww-hxqj-wfq2 / CVE-2026-44688 describes a high-severity Eclipse Theia vulnerability where adversarial workspace file/directory names were processed into AI prompt context without a sufficient trust distinction; patched in 1.71.0.  
   https://github.com/advisories/GHSA-3jww-hxqj-wfq2
4. Gemini CLI issue #23114 requests stronger defenses because README files, tests, config and comments can contain indirect prompt injection interpreted as commands.  
   https://github.com/google-gemini/gemini-cli/issues/23114
5. RepoGuardBench, accepted at the ICML 2026 DL4C workshop, benchmarks repository-borne injections placed in README files, issue text, code comments, test logs and agent-rule files, measuring whether coding agents stay on the requested repair.  
   https://github.com/DaoyuanLi2816/RepoGuardBench

### Interpretation
The recurring weakness is a provenance-to-authorization gap. Scanning suspicious strings can help, but the critical control is whether an action is authorized by trusted user intent rather than by repository content.

## Existing approaches
- Prompt-hardening text telling the model to treat repository content as data.
- Sandboxes/containers and restricted network access.
- Human confirmation for side effects.
- Tool allowlists and least privilege.
- Pattern/injection scanners.
- Repository/project trust mechanisms.

## Remaining limitations
- Prompt instructions are probabilistic and may be overridden by complex or obfuscated content.
- Sandboxes reduce blast radius but do not establish whether a network/repository side effect is actually user-authorized.
- Broad approval prompts can cause fatigue and still hide which source requested the action.
- Tool allowlists cannot distinguish a legitimate `git_push` or issue comment from one induced by malicious repository text.
- Project trust usually governs configuration loading, not semantic trust of every file/comment/build log.
- Pattern scanners have false negatives and should not be the sole security boundary.

## Root-cause analysis
1. Provenance metadata is discarded when heterogeneous context is assembled.
2. Repository data and trusted user instructions share the same model context.
3. Side-effecting tool authorization is based on model intent rather than explicit user-authorized action classes.
4. Destinations/arguments can be derived directly from untrusted content.
5. Human approvals often lack source attribution.
6. Existing controls focus on text detection instead of authority binding.

## Improvement opportunity
Add a deterministic pre-side-effect action gate. Label repository-origin content as `untrusted_repository_data`, extract only supplemental risk signals, and require side-effecting action classes to be explicitly authorized by trusted user intent. Block destinations derived from untrusted content and forbid credential reads triggered by repository text. Keep content usable for analysis while preventing it from becoming authority.

## Goal
Preserve useful repository context while preventing repository-authored instructions from authorizing unrelated or dangerous side effects.

## Metrics
- Attack-fixture block rate.
- Benign data-only pass rate.
- Side-effect authorization coverage.
- Destination-from-untrusted-content block count.
- Credential-read blocks.
- False-positive review rate.
- Security regression rate across benchmark fixtures.

## Trigger
Before any repository-originated model decision invokes a side-effecting or sensitive tool.

## Inputs
Content source/provenance, path, content, proposed action class, explicit user-authorized action classes, and whether destination/arguments came from untrusted content.

## Outputs
`allow_data_only` or `block`, provenance label, risk signals and machine-readable reasons.

## Relevant sources
- https://github.com/openai/codex-action/blob/main/docs/security.md
- https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations
- https://github.com/advisories/GHSA-3jww-hxqj-wfq2
- https://github.com/google-gemini/gemini-cli/issues/23114
- https://github.com/DaoyuanLi2816/RepoGuardBench
