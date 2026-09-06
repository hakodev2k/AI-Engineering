# Research Ethics, Consent, and Privacy

## Purpose
Design human-AI research that respects participant autonomy, minimizes harm, limits sensitive-data exposure, and maintains defensible consent and data handling.

## When to use
Use for every study involving people or identifiable interaction data, with additional rigor for sensitive domains, vulnerable populations, workplace studies, and production logs.

## Inputs
Study protocol, data types, participant population, recording plan, retention needs, incentives, risks, recruitment method, and organizational policies.

## Context to inspect
Inspect what data the AI receives, third-party processing, logging defaults, retention, access controls, research tooling, model training policies, and whether participation could affect employment or services.

## Core knowledge
Consent must be informed, voluntary, comprehensible, and specific enough for material risks. Data minimization reduces risk. AI research can accidentally expose prompts, generated sensitive content, proprietary material, or bystander data.

## Procedure
1. Inventory every data type collected, generated, transmitted, or inferred.
2. Identify plausible participant, bystander, organizational, and downstream harms.
3. Remove data that is not necessary for the research question.
4. Define lawful and organizationally approved collection and processing paths.
5. Write consent information in clear language, including AI-specific processing where material.
6. Define recording, access, retention, deletion, and de-identification procedures.
7. Plan handling for accidental sensitive disclosures.
8. Ensure incentives and recruitment do not create undue pressure.
9. Add withdrawal and escalation procedures.
10. Conduct required ethics, privacy, security, or legal review before collection.
11. Audit actual practice against the approved protocol during execution.

## Decision points
Prefer synthetic or redacted data when real sensitive content is unnecessary. Avoid recording screens or prompts when observation notes answer the question. Escalate higher-risk research to appropriate specialists.

## Common failure patterns
Broad consent for undefined future use, unnecessary transcript retention, uploading research data to unapproved AI tools, capturing bystander data, weak access controls, and assuming de-identification is trivial.

## Verification
Confirm collection matches consent, access is limited, retention rules are implemented, and all tools and processors are approved for the data classification.

## Expected output
An approved research data and ethics plan with consent materials, risk mitigations, handling procedures, and escalation ownership.

## Stop conditions
Stop immediately when consent is invalid, data is being processed by an unauthorized system, unexpected serious harm emerges, or required ethics/privacy approval is absent.