# Research

## Topic
Agentic Workflow Shell Interpolation Gate

## Category
Security

## Problem
AI-enabled GitHub Actions workflows often consume attacker-controlled issue, pull-request, branch, comment, or repository content. Even when the AI agent itself is permission-scoped, the surrounding workflow can still interpolate untrusted `${{ ... }}` expressions directly into shell `run:` blocks or pass attacker-controlled repository state into command-capable agents. This creates a deterministic command-injection path outside the model's safety behavior.

## Why it matters now
GitHub Agentic Workflows are in public preview and agent-driven repository automation is expanding. Recent 2026 advisories continue to document exploitable Actions shell injection, including public-fork and issue/comment-controlled paths. OpenAI's Codex Action security guidance explicitly warns against shell interpolation of untrusted GitHub context and treats pull-request-controlled repository instructions as untrusted input.

## Affected users
Repositories using coding agents in GitHub Actions, maintainers of public repositories, teams running issue triage/review/fix agents, self-hosted runner operators, and organizations exposing agent workflows to external contributors.

## Current public evidence
### Observed evidence
1. GitHub documents that attacker-controlled values such as PR titles, issue bodies, branch names, and other `github` context fields can become shell injection when expanded directly inside `run:` scripts. Source: https://docs.github.com/en/actions/concepts/security/script-injections
2. OpenAI's Codex Action security guidance warns not to splice untrusted GitHub values directly into shell scripts and recommends passing them through `env:` with quoted shell variables. It also treats PR-controlled repository instruction files as untrusted input. Source: https://github.com/openai/codex-action/blob/main/docs/security.md
3. Wazuh disclosed GHSA-95w2-gpvr-q4jh on 2026-07-16: public-fork-controlled data flowed through GitHub Actions into shell execution, with many injection points across workflow/action files. Source: https://github.com/wazuh/wazuh/security/advisories/GHSA-95w2-gpvr-q4jh
4. GitHub Security Lab published GHSL-2025-093 on 2026-04-03 describing code injection in a Claude-code GitHub Action from issue-controlled title/body interpolation. Source: https://securitylab.github.com/advisories/GHSL-2025-093_PraisonAI/
5. An agentic issue-triage workflow advisory documented attacker-controlled issue content reaching a command-capable Claude agent with authenticated issue actions. Source: https://github.com/MIC-DKFZ/nnUNet/security/advisories/GHSA-63mx-j37w-gh59

## Existing approaches
- Restrict workflow permissions with `permissions:` and environment protection.
- Use GitHub Actions secret isolation and fork restrictions.
- Rely on agent allowlists or user allowlists.
- Pass untrusted values through `env:` instead of embedding expressions in `run:`.
- Review agent prompts and repository instruction files as untrusted input.
- Use code scanning/security review for workflow files.

## Remaining limitations
Permission reduction limits blast radius but does not prevent arbitrary execution within the granted runner context. Agent-level prompt defenses do not address shell injection that happens before or after the model call. Manual review is inconsistent, and generic YAML validation does not specifically track trust flow from attacker-controlled GitHub context into shell interpolation or command-capable agent inputs.

## Root-cause analysis
- GitHub expressions are expanded before the shell executes, so shell quoting inside the script may not protect interpolated attacker content.
- Workflow authors conflate GitHub expression evaluation with ordinary argument passing.
- Agent security and workflow security are reviewed separately even though both share the same trust boundary.
- Public-event triggers can grant external users a path into privileged automation.
- Self-hosted runners and repository tokens increase the impact of a successful workflow injection.

## Improvement opportunity
Add a deterministic pre-merge scanner and review workflow that identifies attacker-controlled GitHub expressions inside `run:` blocks, risky command-capable agent exposure, dangerous `pull_request_target` checkout patterns, wildcard agent-user authorization, and missing explicit permission boundaries. Require remediation or an explicit reviewed exception before merge.

## Interpretation
The evidence does not imply that every agentic workflow is exploitable. It shows that workflow-level command injection remains a recurring structural risk and that AI-enabled workflows add another high-value consumer of untrusted repository content.

## Proposed solution
A reusable static gate plus evidence-driven review procedure. The gate is intentionally conservative: deterministic findings block high-confidence unsafe interpolation; lower-confidence agent exposure findings require human review rather than pretending they can be solved by model-side filtering.

## Goal
Prevent attacker-controlled repository/event content from being interpreted as privileged shell code or silently expanding the authority of command-capable agents.

## Metrics
- 100% workflow YAML files scanned before merge.
- 0 direct high-risk `github.event.*` / `github.head_ref` interpolations inside `run:` blocks without an approved exception.
- 100% agentic workflows declare explicit `permissions:`.
- 100% `pull_request_target` workflows that checkout code are reviewed for head/base trust.
- Security fixtures pass with expected blocking/non-blocking decisions.

## Trigger
Any creation or modification of `.github/workflows/*.yml`, `.github/workflows/*.yaml`, reusable composite actions, or agent-action configuration.

## Inputs
Repository path, workflow YAML files, policy configuration, optional exception file, event trigger, permissions, checkout refs, and agent-action configuration.

## Outputs
Machine-readable findings, blocking exit code, remediation guidance, and review evidence.

## Relevant sources
- https://docs.github.com/en/actions/concepts/security/script-injections
- https://docs.github.com/en/actions/reference/security/secure-use
- https://github.com/openai/codex-action/blob/main/docs/security.md
- https://github.com/wazuh/wazuh/security/advisories/GHSA-95w2-gpvr-q4jh
- https://securitylab.github.com/advisories/GHSL-2025-093_PraisonAI/
- https://github.com/MIC-DKFZ/nnUNet/security/advisories/GHSA-63mx-j37w-gh59
- https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows
