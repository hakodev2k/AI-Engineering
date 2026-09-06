# MCP Public Cache Authorization-Context Guard

**Category:** Security

## Problem
MCP 2026-07-28 cache metadata allows responses to be marked `cacheScope: public` and reused across authorization contexts. That optimization becomes a security boundary when the response is personalized, permission-filtered, malformed, attacker-controlled, or contains model-visible instructions. A syntactically valid public hint is not proof that cross-user reuse is safe.

## Evidence
Current public evidence is documented in `evidence/research.md`. The strongest signals are MCP issues #3207 (public-cache poisoning, opened 2026-08-06) and #3213 (server instruction prompt injection amplified by shared caching, opened 2026-08-07), plus independent validator/library guidance and a late-August real-world malformed `cacheScope` interoperability report.

## Existing approach
The protocol supplies `ttlMs` and `cacheScope`; servers apply authorization; gateways/clients may cache responses. Existing validators can flag suspicious public scope, and some cache libraries isolate private entries by authorization context.

## Existing limitations
The cache hint is server-authored, authorization-dependent lists may still look valid, malformed hints need safe fallback, and a shared intermediary can omit identity from its effective cache key. Model-visible metadata can also be security-sensitive without containing a conventional secret.

## Proposed improvement
Insert a fail-closed cache-admission guard that makes public reuse a proof obligation. Auth-dependent results default to private/no-cache; private keys bind to a non-secret authorization-context digest; untrusted model-visible instructions cannot be globally cached; and cross-context replay is independently verified.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, gaps, and root causes.
- `rules/cache-boundary.md` — observable MUST/MUST NOT/SHOULD policy.
- `skills/cache-threat-assessment.md` — repeatable assessment procedure.
- `subagents/security-verifier.md` — independent verifier contract.
- `workflows/harden-and-verify.md` — bounded observe/measure/diagnose/implement/retest workflow.
- `hooks/preflight.md` — deterministic blocking hook contract.
- `scripts/verify_cache_scope.py` — dependency-free admission validator.
- `tests/test_verify_cache_scope.py` — executable regression tests.

## Package tree
```text
mcp-public-cache-auth-context-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── preflight.md
├── rules/
│   └── cache-boundary.md
├── scripts/
│   └── verify_cache_scope.py
├── skills/
│   └── cache-threat-assessment.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_verify_cache_scope.py
└── workflows/
    └── harden-and-verify.md
```

## Installation
Requires Python 3.9+ only; the script uses the standard library. Copy this directory intact into the engineering controls repository or CI workspace.

## Configuration
Create an assessment JSON containing a non-empty `responses` array. Each response declares `method`, `authenticated`, `personalized`, `cacheScope`, `cache_key_fields`, and when relevant `contains_model_instructions`, `server_trust`, and `public_invariance_verified`. Never place raw credentials in this file.

## Usage
Run the admission gate:

```bash
python scripts/verify_cache_scope.py assessment.json
```

Run tests:

```bash
python -m unittest tests/test_verify_cache_scope.py
```

Exit codes are `0` pass, `1` malformed input/runtime failure, and `2` blocking policy violation.

## Workflow
Follow `workflows/harden-and-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement isolation → Measure again → Independent verification → Complete. The same synthetic contexts and metrics must be used before and after the change.

## Metrics
- Private cross-context cache hits: target `0`.
- Unsafe public candidates: target `0`.
- Malformed metadata safely rejected: target `100%`.
- Public candidates with invariance evidence and approval: target `100%`.
- Regression test pass rate: target `100%`.

## Verification
**Implemented** means admission policy and authorization-bound keys exist. **Measured** means before/after hit behavior has been captured. **Verified** means the independent verifier has replayed at least two synthetic authorization contexts, the deterministic validator exits 0, all unit tests pass, and no private cross-context hit occurs.

## Safety
This package never asks an agent to bypass authorization, exercise destructive tools, or store credentials. Public-scope promotion requires independent review and explicit human approval. Availability or cache-hit rate is never a reason to weaken the boundary.

## Failure handling
Detection: blocking validator finding, cross-context hit, malformed metadata, secret-bearing cache key, or untrusted instructions in a public candidate. Evidence: preserve non-secret request labels, scope/key configuration and fingerprints. Retry: maximum two remediation cycles. Fallback: private/no-cache plus suspect-entry invalidation. Escalation: security owner/human reviewer. Stop: after two failed cycles or any ambiguity requiring broader privileges.

## Definition of Done
- Evidence documented and current.
- Existing approach and limitation identified.
- Baseline captured.
- Admission guard implemented.
- Private cache keys authorization-bound without secrets.
- Cross-context security tests pass.
- Metrics collected before and after.
- Public promotions, if any, explicitly approved.
- Independent verification complete.
- No blocking issue remains.

## Customization
Organizations may add tenant/repository/workspace dimensions to the private key and stricter trust classes. Do not remove `auth_context_hash`, fail-closed handling, independent verification, or public-invariance evidence requirements without a security review.
