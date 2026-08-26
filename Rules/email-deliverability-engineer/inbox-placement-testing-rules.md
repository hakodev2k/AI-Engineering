# Inbox Placement Testing Rules

## Purpose
Evaluate mailbox placement with controlled evidence rather than equating SMTP acceptance with inbox success.

## Scope
Seed tests, panel data, test accounts, production cohorts, rendering, spam-folder checks, and experiments.

## MUST
- Placement claims MUST identify the evidence source, recipient providers, sample limitations, and observation period.
- Tests MUST control material variables when comparing sender, content, audience, or infrastructure changes.
- Production conclusions MUST prioritize representative recipient behavior over synthetic seed results alone.
- Experiments that can affect reputation MUST define stop conditions and bounded exposure.
- Receiver-specific findings MUST not be generalized beyond available evidence without qualification.

## MUST NOT
- MUST NOT report a universal inbox rate from a small or unrepresentative seed set.
- MUST NOT manipulate engagement or synthetic traffic to deceive mailbox-provider systems.
- MUST NOT claim improvement from a before/after comparison that changed multiple uncontrolled variables without stating the limitation.

## SHOULD
- Combine seed, production, complaint, reputation, and engagement evidence.
- Repeat important tests to bound natural variability.

## Exceptions
Limited-evidence decisions require explicit uncertainty, risk, reversibility, and monitoring.

## Verification
Review experimental design, cohorts, raw placement observations, provider distribution, confounders, statistical uncertainty where applicable, and production follow-up metrics.