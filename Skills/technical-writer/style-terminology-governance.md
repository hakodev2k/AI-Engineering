# Style and Terminology Governance

## Purpose
Maintain consistent language, terminology, tone, formatting, and technical conventions across a documentation system.
## When to use
Use when multiple contributors or products create documentation at scale.
## Inputs
Brand/style guidance, domain vocabulary, accessibility needs, localization constraints, existing corpus.
## Context to inspect
Frequent review issues, inconsistent terms, UI labels, code conventions, search vocabulary.
## Core knowledge
A style guide should reduce reader friction and reviewer debate, not enforce arbitrary preferences. Terminology accuracy outranks cosmetic uniformity.
## Procedure
1. Identify recurring inconsistencies that affect comprehension.
2. Define canonical terms and prohibited ambiguous alternatives.
3. Establish concise rules for voice, headings, procedures, code, UI references, dates/numbers, and inclusive language.
4. Include examples and rationale for non-obvious rules.
5. Automate objective rules with linters where practical.
6. Define exception and update process.
7. Train reviewers to focus on user impact.
8. Review rules periodically against product language and localization.
## Decision points
Automate high-signal deterministic rules; avoid lint rules that create noisy false positives.
## Common failure patterns
Huge unused guides, personal preference as policy, terminology diverging from UI/API, and inaccessible language.
## Verification
Sample content from different authors reads consistently and lint/review guidance resolves recurring issues.
## Expected output
Practical style and terminology standards with governance.
## Stop conditions
Escalate terminology conflicts that reflect unresolved product/domain decisions.