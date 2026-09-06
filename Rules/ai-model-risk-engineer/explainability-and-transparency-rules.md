# Explainability and Transparency Rules

## Purpose
Ensure stakeholders receive explanations and disclosures appropriate to the risk, audience, and decision context.

## Scope
Applies to model documentation, user disclosures, decision explanations, limitations, confidence communication, and audit records.

## MUST
- High-impact model uses MUST document what information can and cannot be reliably explained about model behavior.
- User-facing disclosures MUST identify material automation where omission could mislead users about decision authority or provenance.
- Explanations used for consequential decisions MUST be tested for fidelity and usefulness in the intended context.
- Known model limitations and material uncertainty MUST be communicated to decision-makers who rely on outputs.
- Transparency artifacts MUST be updated after material changes to model behavior or deployment context.

## MUST NOT
- Generated explanations MUST NOT be presented as causal evidence unless validated as such.
- Teams MUST NOT claim a model is interpretable merely because its output is fluent or persuasive.

## SHOULD
- Explanations SHOULD be tailored to users, operators, reviewers, and auditors rather than using one generic format.
- Transparency documentation SHOULD distinguish observed evidence from assumptions and inferred reasoning.

## Exceptions
Where disclosure is constrained by security, privacy, or intellectual-property requirements, document the limitation, alternative transparency mechanism, residual risk, and approver.

## Verification
Review model cards, user interfaces, decision records, explanation tests, and change history. Confirm disclosures remain consistent with production behavior.