# Research — Head-Branch Review Context Poisoning Guard

## Topic
Head-Branch Review Context Poisoning Guard

## Category
Security

## Problem
AI-assisted code review can consume reviewer instructions, agent skills, repository guidance, and PR metadata controlled by the pull-request head branch. When those inputs are attacker-controlled or merely biased, they can steer the review away from vulnerabilities, weaken scrutiny, or cause a reviewer agent to trust claims made by the change it is supposed to evaluate.

## Why it matters now
GitHub changed Copilot code review in July 2026 to read custom instructions from the head branch. That improves testability of instructions, but also makes review behavior depend on content introduced by the branch under review. Independent 2026 research shows LLM security reviewers are susceptible to confirmation-bias framing and adversarial PR metadata, including materially higher false-negative rates.

## Affected users
Teams using AI code review on external/internal pull requests, open-source maintainers, security reviewers, repository administrators, and agent-platform teams that load branch-local instructions or skills into reviewer context.

## Current public evidence
### Observed evidence
1. GitHub's July 17, 2026 changelog states Copilot code review now reads `copilot-instructions.md`, `*.instructions.md`, agent skills, and `AGENTS.md` from the PR head branch: https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/
2. Current GitHub documentation reiterates that code review reads repository custom instructions, agent instructions, and agent skills from the head branch rather than the base branch: https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/copilot-code-review
3. *Measuring and Exploiting Confirmation Bias in LLM-Assisted Security Code Review* (Mar 19, 2026) reports that framing a change as bug-free reduced vulnerability detection rates by 16–93%; adversarial framing succeeded in 35% of one-shot GitHub Copilot cases and 88% of iterative Claude Code cases, while metadata redaction plus explicit debiasing substantially restored detection: https://arxiv.org/abs/2603.18740
4. GitHub's cloud-agent risk guidance emphasizes that AI prompts are vulnerable to injection and maintains human review, branch protections, restricted workflows, and security validation as layered controls: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations

## Existing approaches
- Trust repository custom instructions from the branch being reviewed.
- Use built-in AI review plus human review.
- Run CodeQL/secret/dependency scanning independently of the LLM.
- Ask the model to ignore misleading content.
- Disable custom instructions entirely.

## Remaining limitations
Human review and static analysis are valuable but may not cover all logic/security failures. Model-only debiasing is probabilistic. Disabling all custom instructions loses useful repository-specific rules. Most workflows do not explicitly separate base-branch trusted review policy from head-branch untrusted review hints, nor do they detect when a PR modifies its own reviewer instructions.

## Root-cause analysis
- Review-policy inputs and change-under-review inputs can share the same natural-language authority.
- Head-branch instructions can be modified in the same PR they influence.
- PR title/body and branch-local guidance can frame conclusions before evidence collection.
- Reviewer agents may use repository skills without provenance/trust classification.
- Independent security checks may run, but their results are not always required before an AI reviewer declares the change safe.

## Improvement opportunity
Introduce a deterministic review-context trust gate. Treat base-branch review policy as trusted, head-branch instruction changes as untrusted evidence, redact or quarantine persuasive metadata during the first-pass security review, detect instruction-file changes, and require independent deterministic/static evidence before a security-safe conclusion. Allow head-branch guidance only as explicitly labeled supplemental context after the baseline review.

## Goal
Prevent pull requests from silently modifying or biasing the AI reviewer policy that judges them while retaining useful branch-local context in a lower-trust channel.

## Metrics
- 100% review instruction sources receive provenance labels.
- 100% modifications to reviewer-instruction/skill files trigger the gate.
- 0 head-branch instruction changes are promoted to trusted reviewer policy without explicit approval.
- Security conclusions require independent scan/test evidence when configured.
- Adversarial framing fixtures do not suppress expected findings.

## Trigger
AI review of a pull request, especially when the PR changes instruction files, agent skills, review workflows, security policy, or persuasive PR metadata.

## Inputs
Base/head refs, changed paths, trusted instruction path patterns, head-branch instruction content hashes, PR metadata, scan/test status, policy.

## Outputs
Trusted/supplemental/quarantined context sets, allow/review-required/block decision, reasons, changed instruction files, and required verification evidence.

## Interpretation
The GitHub feature is not itself proof of exploitation. The risk arises from combining branch-controlled reviewer context with empirically demonstrated framing sensitivity. The proposed package creates a deterministic trust boundary around those inputs.

## Proposed solution
A reusable pre-review gate, review-context policy, independent security verifier, bounded sanitize/review/verify workflow, and executable changed-path/context validator.