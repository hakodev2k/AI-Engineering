# Privacy Requirements Rules

## Purpose
Ensure privacy obligations are translated into explicit, testable engineering requirements before implementation.

## Scope
Applies to systems that collect, process, store, transmit, derive, or expose personal or sensitive data.

## MUST
- Privacy requirements MUST identify the data subjects, data categories, processing purposes, legal or policy basis, recipients, retention expectations, and jurisdictional constraints relevant to the feature.
- Requirements MUST distinguish mandatory obligations from product preferences and assumptions.
- Privacy-sensitive acceptance criteria MUST be testable and traceable to implementation controls.
- Material ambiguity about purpose, legal basis, data ownership, or retention MUST be escalated before production release.

## MUST NOT
- Teams MUST NOT infer permission to process data solely because the data is technically accessible.
- Privacy requirements MUST NOT be reduced to a generic statement such as "comply with privacy laws."
- Engineering MUST NOT silently expand the processing purpose beyond approved scope.

## SHOULD
- Requirements SHOULD state expected failure behavior when consent, authorization, or policy prerequisites are absent.
- High-risk processing SHOULD receive documented privacy review before design is finalized.

## Exceptions
Exceptions require documented rationale, affected data, risk, controls, verification evidence, and approval from the accountable privacy or security authority when applicable.

## Verification
Review requirements, architecture decisions, data-flow diagrams, tickets, acceptance tests, and approval records. Confirm each material privacy obligation maps to an observable control.