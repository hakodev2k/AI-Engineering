# Research Reproducibility Rules

## Purpose
Ensure security research can be independently validated and remains understandable after tools, systems, and personnel change.

## Scope
Applies to experiments, vulnerability reproduction, comparative testing, benchmarks used in security claims, reverse engineering, fuzzing, and mitigation validation.

## MUST
- Material conclusions MUST record the target version, relevant configuration, prerequisites, inputs, tools, and observable outputs needed for independent validation.
- Research procedures MUST distinguish deterministic requirements from incidental environmental details.
- Commands, scripts, harnesses, and configuration required for reproduction MUST be versioned or preserved when policy permits.
- Random seeds, timing assumptions, concurrency conditions, or external dependencies MUST be recorded when they materially affect outcomes.
- A researcher MUST identify when a result cannot currently be reproduced and downgrade confidence accordingly.
- Reproduction artifacts MUST avoid embedding secrets, private data, or unauthorized infrastructure details.
- Changes to the experiment after initial discovery MUST be traceable when they affect the conclusion.
- Independent reproduction SHOULD be sought for high-severity or surprising findings; when not performed, the report MUST not imply that it was.

## MUST NOT
- MUST NOT rely solely on screenshots when machine-readable or repeatable evidence is available.
- MUST NOT omit failed runs that reveal meaningful nondeterminism or contradict the reported conditions.
- MUST NOT describe a timing-dependent result as deterministic without evidence.
- MUST NOT require unauthorized third-party interaction to reproduce a finding when a controlled equivalent can be provided.
- MUST NOT treat researcher confidence as a substitute for reproducible evidence.

## SHOULD
- Prefer minimal fixtures, declarative environment descriptions, stable artifact hashes, and automated setup where they improve repeatability.
- Document known sources of nondeterminism and expected variance.
- Preserve enough context for another Senior researcher to repeat the experiment without relying on oral history.

## Exceptions
When legal, privacy, licensing, or safety constraints prevent sharing complete artifacts, provide sanitized substitutes or restricted evidence and document how those constraints affect reproducibility.

## Verification
Have an independent reviewer follow the documented procedure or inspect the preserved artifacts. Confirm target identity, environment, inputs, tool versions, expected outputs, nondeterministic factors, and any restricted evidence are accounted for.