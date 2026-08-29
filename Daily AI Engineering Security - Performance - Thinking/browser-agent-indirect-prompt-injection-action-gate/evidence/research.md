# Research Evidence

## Topic
Browser-Agent Indirect Prompt Injection Action Gate

## Category
Security

## Problem
Browser agents consume hostile or merely untrusted content and can operate inside authenticated sessions. If page text, accessibility metadata, tool output, email/calendar content, or downloaded files influence tool selection, an attacker may redirect the agent toward data access, exfiltration, navigation, or side effects the user did not authorize.

## Why it matters now
Browser/computer-use agents now combine broad observation with authenticated authority. Recent 2026 research and engineering issues continue to show indirect prompt injection succeeding across different agents and input channels, while maintainers are adding explicit guardrails at navigation and action boundaries.

## Affected users
Users of browser agents, developers integrating browser/MCP tools, platform builders exposing authenticated sessions, and security teams responsible for agent authorization and data-loss prevention.

## Current public evidence
### Observed evidence
1. **Google Gemini CLI #15963 — January 6, 2026.** A browser-agent security task calls for URL navigation restrictions, sensitive-action confirmation, per-action rate limiting, session warnings, and prompt-injection defenses around dynamically discovered browser MCP tools.  
   https://github.com/google-gemini/gemini-cli/issues/15963

2. **mcp-chrome #316 — March 21, 2026.** An open security issue highlights indirect prompt injection when an MCP server exposes a real browser with active cookies/login sessions; hostile page content could influence an agent with access to authenticated services.  
   https://github.com/hangwin/mcp-chrome/issues/316

3. **LivePI — May 2026.** A production-like benchmark evaluated indirect prompt injection across email, chat, web, files, repositories, and wallet interfaces. Reported total attack-success rates ranged from 10.7% to 29.6% across evaluated backbones. A two-layer defense combining prompt filtering with pre-execution tool-call authorization intercepted tested malicious-goal completions in one evaluated setting while preserving benign utility.  
   https://arxiv.org/abs/2605.17986

4. **Security Assessment of DeepSeek Harness with A.I.G — August 17, 2026.** The study reports 14,560 controlled executions over 16 indirect-content channels, with successful attacks including hidden-Unicode/file and skills-channel cases; it recommends controls between untrusted content and sensitive actions.  
   https://arxiv.org/abs/2608.16393

5. **MUZZLE — 2026.** Adaptive red-teaming of web agents discovered new attacks, including cross-application prompt injection and agent-tailored phishing, showing that static template-only evaluations are incomplete.  
   https://arxiv.org/abs/2602.09222

### Interpretation
The evidence does not imply every browser agent is equally vulnerable. It does show that model-level instruction following alone is not a sufficient authorization boundary. The reusable engineering opportunity is to decide whether an action is permitted independently from the model's interpretation of untrusted content.

## Existing approaches
- prompt instructions marking page content as untrusted;
- semantic injection classifiers;
- browser sandboxing and isolated profiles;
- navigation/domain allowlists;
- human confirmation for high-impact actions;
- provider/model safety training;
- network and data-loss-prevention controls.

## Remaining limitations
- Prompt and classifier defenses are probabilistic and can fail on adaptive attacks.
- A broad “confirm everything” policy causes approval fatigue.
- Domain allowlists alone do not prove the requested action matches user intent.
- Reading sensitive data before the approval boundary may expose it to the model/context even if later egress is blocked.
- Browser tools often carry ambient authenticated authority inherited from the session.

## Root-cause analysis
1. **Authority/data confusion:** untrusted content can influence the same planner that holds tool authority.
2. **Ambient credentials:** cookies/session tokens are available without per-action re-authorization.
3. **Late approval:** confirmation may occur after sensitive data has already entered context.
4. **Insufficient provenance:** tool calls often lack a machine-readable link to the user instruction that authorized them.
5. **Probabilistic enforcement:** natural-language warnings are treated as the security boundary instead of deterministic policy.

## Improvement opportunity
Place a deterministic gate immediately before browser actions and sensitive reads. Evaluate action class, content provenance, destination, data sensitivity, authenticated context, and explicit human approval. Default to blocking high-risk actions initiated from untrusted content, and log only redacted decision evidence.

## Goal
Reduce successful indirect-prompt-injection side effects and data exfiltration while preserving benign browser-task utility.

## Metrics
Attack success rate; unauthorized side-effect rate; sensitive-data egress rate; benign-task success; false-block rate; approval frequency; policy-decision latency; secrets in logs = 0.

## Trigger
Before every browser/tool action that navigates, reads protected data, changes state, uploads/downloads, submits, sends, or transfers data externally.

## Inputs
Action type, source provenance/trust, destination domain, sensitive-data flag, authenticated-session context, human-approval state, local path when relevant.

## Outputs
`allow`, `require_approval`, or `deny`, plus redacted reason codes.

## Proposed solution
See the deterministic action gate and workflow in this package. It complements rather than replaces browser isolation, model safety, and network controls.

## Relevant sources
- https://github.com/google-gemini/gemini-cli/issues/15963
- https://github.com/hangwin/mcp-chrome/issues/316
- https://arxiv.org/abs/2605.17986
- https://arxiv.org/abs/2608.16393
- https://arxiv.org/abs/2602.09222
