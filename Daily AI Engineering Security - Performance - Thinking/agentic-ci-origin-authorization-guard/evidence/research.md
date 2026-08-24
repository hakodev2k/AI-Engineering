# Research — Agentic CI Origin Authorization Guard

## Topic
Preserve originating-user authorization across AI/bot relays in CI workflows.

## Category
Security

## Problem
A low-trust issue, pull request, comment, label, or agent can cause a trusted bot to emit a command that a downstream privileged workflow authorizes based on the bot's repository identity. The workflow sees a collaborator/bot actor and loses the originating untrusted principal.

## Why it matters now
In August 2026, Google removed three ADK workflows after research showed a public-facing triage agent could be prompt-injected into posting a command accepted by a privileged fixer workflow because the bot was a collaborator. Independent 2026 research and CVEs show agentic GitHub workflows repeatedly bridge untrusted repository events into secret-bearing/write-capable jobs.

## Affected users
Public repositories, AI-assisted CI/CD, agentic issue triage, code-fixing bots, workflow maintainers, platform/security teams.

## Current public evidence

### Observed evidence
1. The Hacker News, 2026-08-04: Google ADK public issue content could steer `adk-bot` to post `/adk-issue-fix`; the privileged workflow accepted the bot because it was a collaborator, enabling CI runner code execution and credential exposure in the demonstrated chain. https://thehackernews.com/2026/08/google-deletes-3-adk-ai-workflows-after.html
2. Microsoft Security, 2026-06-05: untrusted GitHub issue/PR content can steer agentic CI tools; Microsoft recommends treating AI workflows that combine untrusted content with secrets, file-read tools, or external communication as high risk. https://www.microsoft.com/en-us/security/blog/2026/06/05/securing-ci-cd-in-agentic-world-claude-code-github-action-case/
3. TaintAWI research (May 2026) analyzed 13,392 agentic workflows and reported 496 exploitable workflow-injection cases under its threat model, including flows from untrusted event context to agent-derived privileged sinks. https://arxiv.org/abs/2605.07135
4. NVD CVE-2026-48168, published 2026-08-05: PraisonAI's bundled agent workflow allowed untrusted triggering and command injection in a job holding write/OIDC privileges, illustrating the recurring authorization boundary problem in agentic CI. https://nvd.nist.gov/vuln/detail/CVE-2026-48168

### Interpretation
The durable control is not prompt filtering alone. Authorization must remain bound to the origin principal and event provenance across every agent/bot relay. A bot's trusted identity must not automatically upgrade attacker-controlled intent.

## Existing approaches
- `author_association`/actor checks on the immediate triggering event.
- Branch protection and required review.
- Reduced GitHub token permissions.
- Prompt-injection filtering and hidden-character stripping.
- Separate public triage and privileged fixer workflows.

## Remaining limitations
- Immediate actor checks can validate the relay bot while ignoring the original user/event.
- Agent-generated comments/labels can become implicit capability tokens.
- Workflow chains often do not carry signed, immutable provenance from source event to privileged sink.
- Prompt defenses are probabilistic and cannot prove authorization.
- Branch protection may limit merge impact but does not prevent secret exposure, runner execution, issue/PR mutation, or OIDC abuse.

## Root-cause analysis
1. Identity and intent provenance are conflated.
2. Authorization is re-evaluated from the current bot actor rather than the initiating principal.
3. Natural-language commands and labels are treated as sufficient authorization signals.
4. Secret-bearing/write jobs are reachable from event graphs whose trust level is not propagated.
5. Least privilege is incomplete when the wrong principal can still activate the privileged job.

## Improvement opportunity
Introduce a deterministic provenance envelope and policy gate before privileged AI/CI actions. The gate records origin actor, origin association, source event, relay actor, requested capability, repository/ref, and a hash of the authorization context. Privileged workflows fail closed unless the origin itself satisfies policy or a human approval record explicitly delegates the capability.

## Goal
Prevent privilege elevation through trusted bot relays while preserving useful low-trust triage automation.

## Metrics
- privileged jobs blocked due to untrusted origin
- privileged jobs with complete provenance / total privileged jobs
- bot-relay requests requiring human approval
- authorization false-positive rate
- security test pass rate for forged/modified provenance

## Trigger
Before any agentic workflow step with repository write, secret access, deployment, OIDC, package publication, or production mutation capability.

## Inputs
Normalized event JSON plus policy configuration.

## Outputs
Allow/deny/require-approval decision, reason, normalized provenance record, stable evidence hash.

## Relevant sources
See the four public sources above. Source claims are summarized, not copied.
