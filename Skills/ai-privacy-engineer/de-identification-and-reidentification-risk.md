# De-identification and Re-identification Risk

## Purpose
Evaluate whether a dataset can be safely shared or reused with reduced identity exposure by measuring residual re-identification risk rather than relying on superficial identifier removal.

## When to use
Use before releasing datasets, sharing data with vendors or researchers, building analytics extracts, or claiming that AI data is anonymized or de-identified.

## Inputs
- Candidate dataset and schema
- Population context
- External data likely available to attackers
- Intended recipients and controls
- Utility requirements

## Context to inspect
Inspect direct identifiers, quasi-identifiers, rare values, free text, timestamps, location, longitudinal patterns, images/audio, embeddings, and metadata.

## Core knowledge
Re-identification can occur through uniqueness, linkage, inference, or reconstruction. Risk is contextual: the same fields may be low-risk in one population and identifying in another. K-anonymity-style measures can expose structural risk but do not cover all inference attacks; stronger transformations or formal privacy may be required.

## Procedure
1. Define the release context, recipient, and attacker capabilities.
2. Remove unnecessary direct identifiers.
3. Identify quasi-identifiers and rare combinations.
4. Measure uniqueness and group sizes.
5. Test linkage against realistic auxiliary information.
6. Review unstructured fields for hidden identifiers.
7. Generalize, suppress, bucket, perturb, or aggregate high-risk fields.
8. Recalculate risk after each transformation.
9. Measure utility loss against the intended use.
10. Add contractual and access controls when technical anonymization is insufficient.
11. Document whether the result is anonymous, pseudonymous, or merely reduced-risk.
12. Reassess when new external datasets or attack methods become relevant.

## Decision points
Use controlled-access sharing when useful data cannot meet acceptable public-release risk. Prefer aggregation or synthetic outputs over row-level release when individual records are unnecessary.

## Common failure patterns
- Removing names and declaring success
- Ignoring dates, location, and rare attributes
- Treating embeddings as anonymous
- Using a single numeric threshold as universal proof
- Ignoring the recipient's auxiliary knowledge

## Verification
Run independent linkage and uniqueness tests, inspect unstructured samples, and verify that the final release matches documented access and use restrictions.

## Expected output
A de-identification assessment with attack assumptions, measured risk, transformations, utility impact, release classification, and residual controls.

## Stop conditions
Escalate if re-identification risk remains material, the recipient context is unknown, or an anonymity claim cannot be supported by evidence.