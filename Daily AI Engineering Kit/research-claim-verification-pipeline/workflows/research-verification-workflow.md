# Workflow: Research Claim Verification

## Entry condition
A research result will materially influence code, architecture, operations, QA, security, product choice, or a published recommendation.

## Required inputs
- research question / decision
- scope and constraints
- available sources or permission to retrieve them
- claim matrix output path

## Stages

### 1. Scope
Owner: Claim Analyst

Define decision, versions/environments, freshness needs, and high-impact claim categories.

Artifact: decision scope.

Checkpoint: ambiguous scope must be marked unresolved rather than guessed.

### 2. Claim decomposition
Owner: Claim Analyst

Create atomic claims using `skills/claim-decomposition.md`.

Artifact: claim list with stable IDs.

### 3. Evidence collection and assessment
Owner: Claim Analyst

Gather evidence, prefer primary sources, map evidence relationships, search for disconfirming evidence, and record contradictions.

Artifact: claim-evidence matrix.

### 4. Deterministic validation
Owner: host workflow / script

Run:
```bash
python scripts/validate-claim-matrix.py research/claim-matrix.json
```

Failure: return to Claim Analyst for mechanical correction. Maximum two corrections; then stop with validation evidence.

### 5. Independent verification review
Owner: Verification Reviewer

Inspect entailment, source authority, source independence, freshness, qualifiers, confidence, and contradictions.

Output: `pass`, `revise`, or `blocked` plus findings.

### 6. Revision loop
If `revise`, Claim Analyst changes only the affected claims/evidence and re-runs validation.

Maximum: two review revisions.

Stop early when the same blocker/high finding persists or authoritative sources conflict materially.

### 7. Final verification gate
Owner: host workflow / deterministic script

Run:
```bash
python scripts/check-verification-gate.py research/claim-matrix.json
```

The matrix should include reviewer status before this stage.

### 8. Decision handoff
Verified findings may inform downstream work. They do not authorize dangerous actions.

## Human approval points
Explicit approval is required before downstream execution involving database schema changes, production deploy/config, infrastructure, secrets, security-control changes, breaking public APIs, destructive Git/file operations, or large dependency upgrades.

## Failure and recovery
- transient source/tool failure: retry at most twice
- unavailable source after retries: record unavailable; reduce confidence
- stale source for changing fact: seek fresher evidence; otherwise provisional/block
- conflicting authoritative sources: block claim and escalate
- repeated reviewer finding after two revisions: stop
- deterministic script error: operational failure, never pass

## Definition of Done
Task completed when the matrix and reviewer output exist.

Task verified only when:
- schema/mechanical validation passes
- all high-impact claims have evidence
- all claims marked `verified` meet confidence/evidence rules
- no blocking contradiction exists
- reviewer status is `pass`
- final gate exits 0
- unresolved claims are explicitly excluded from asserted conclusions.