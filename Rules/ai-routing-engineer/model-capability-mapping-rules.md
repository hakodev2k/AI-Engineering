# Model Capability Mapping Rules

## Purpose
Keep routing decisions grounded in verified model capabilities rather than assumptions.

## Scope
Supported modalities, tool use, structured output, context limits, reasoning behavior, language support, and model-specific constraints.

## MUST
- Each routable model MUST have a maintained capability profile covering the properties used by routing logic.
- Capability claims MUST be supported by provider documentation, controlled evaluation, or production evidence.
- A model MUST be excluded from requests whose hard requirements it cannot satisfy.
- Capability profile changes MUST trigger compatibility review for affected routes.
- Experimental capabilities MUST be clearly distinguished from production-approved capabilities.

## MUST NOT
- MUST NOT infer capability from model naming, price tier, or release recency alone.
- MUST NOT advertise unsupported structured output, tool, modality, or context behavior to callers.
- MUST NOT treat agent confidence as capability evidence.

## SHOULD
- Maintain capability profiles as version-controlled data.
- Revalidate important capabilities after material provider or model revisions.

## Exceptions
Exceptions require explicit evidence, affected-route analysis, and owner approval.

## Verification
Review capability registry entries, evaluation results, provider documentation, compatibility tests, and route eligibility tests.