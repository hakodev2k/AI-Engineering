# Repository-Borne Prompt Injection Action Gate

**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Problem
AI coding agents ingest repository-controlled content while also holding write, shell, network, issue/PR, deployment, and sometimes credential-adjacent capabilities. If source provenance is lost, repository text can be misinterpreted as trusted authority for side effects.

## Evidence
`evidence/research.md` documents current OpenAI Codex Action guidance, GitHub Copilot cloud-agent risk guidance, CVE-2026-44688 / GHSA-3jww-hxqj-wfq2, Gemini CLI issue #23114, and RepoGuardBench.

## Existing approach
Prompt hardening, sandboxes, project trust, tool allowlists, human approvals, and injection scanners are all useful defenses.

## Existing limitations
Those defenses do not by themselves bind a sensitive action to trusted user intent. A permitted tool can still be invoked for the wrong reason, a sandboxed agent can still publish to an allowed endpoint, and pattern scanners can miss semantic/obfuscated injections.

## Proposed improvement
Keep repository-origin material available as data but add a deterministic pre-side-effect gate that preserves provenance and requires explicit user authorization for sensitive action classes. Block destinations derived from untrusted content and forbid credential reads triggered by repository content.

## Architecture
Authorization is separated from content interpretation. The model may analyze repository text, but repository text cannot grant authority. The gate complements rather than replaces sandboxing, least privilege, and human review.

## Actual package tree
```text
repo-borne-prompt-injection-action-gate/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-side-effect.md
├── rules/
│   └── untrusted-repository-content.md
├── scripts/
│   └── repo_provenance_guard.py
├── skills/
│   └── repository-content-threat-model.md
├── subagents/
│   └── security-reviewer.md
├── tests/
│   └── test_repo_provenance_guard.py
└── workflows/
    ├── action-verification.md
    └── research-diagnose.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/policy.json` to map local tool names to the normalized side-effect action classes. Keep trusted instruction sources narrow. Do not add repository sources to `trusted_instruction_sources` merely to suppress blocks.

## Event contract
Each event contains `source`, `path`, `content`, `requested_action`, and `user_authorized_actions`. Set `destination_from_content=true` when the endpoint/path/account/destination originates from repository-controlled material.

## Usage
```bash
python scripts/repo_provenance_guard.py --event event.json --policy config/policy.json
```
Exit codes: `0` allow data-only use under existing permissions, `2` invalid evidence/configuration, `3` block.

## Workflow
Use `workflows/research-diagnose.md` to establish the trust boundary and `workflows/action-verification.md` at execution time. `hooks/pre-side-effect.md` is the blocking integration point.

## Metrics
- Adversarial fixture block rate.
- Benign repository-data pass rate.
- Explicit side-effect authorization coverage.
- Untrusted-destination block count.
- Untrusted-triggered credential-read block count.
- False-positive review count.
- Security regression rate.

## Verification
Run:
```bash
python -m unittest tests/test_repo_provenance_guard.py
```
The suite covers an injection-driven network write, benign repository content, untrusted-derived destinations, credential reads, and missing-field fail-closed behavior.

## Safety
Never place real secrets in fixtures. Preserve sandbox and least-privilege controls. A blocked action must not be retried by asking the model to paraphrase the same untrusted instruction. High-risk changes require independent verification.

## Failure handling
**Detection:** guard exit `2` or `3`, failed fixture, missing provenance, or authorization ambiguity.  
**Evidence:** preserve event, policy, source attribution and secret-free reason codes.  
**Retry policy:** one integration/policy correction and one full rerun.  
**Fallback:** disable side-effecting tools while untrusted repository context is active.  
**Escalation:** any secret exposure, production write, or persistent authority ambiguity.  
**Stop condition:** attack fixture remains possible or security reviewer cannot verify the boundary.

## Definition of Done
- **Implemented:** provenance survives to tool-call time and the pre-side-effect gate is enforced.
- **Measured:** attack/benign fixture metrics and authorization coverage are captured.
- **Verified:** adversarial fixtures are blocked, benign data remains usable, no secrets are exposed, permissions are preserved, and an independent reviewer passes the package.

## Customization
Add normalized action classes for local platforms and extend supplemental risk patterns if useful. Never make pattern matching the primary authority boundary; explicit provenance plus trusted action authorization is the required control.
