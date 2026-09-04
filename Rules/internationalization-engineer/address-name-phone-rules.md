# Address, Name, and Phone Rules

## Purpose
Prevent data-model assumptions that exclude legitimate international identities and contact information.

## Scope
Applies to person names, organization names, postal addresses, phone numbers, display ordering, and contact-data interchange.

## MUST
- Data models MUST preserve the user-provided full form of names and addresses when downstream semantics require faithful reproduction.
- Required address fields MUST be determined by destination or business policy rather than one country's form template.
- Phone numbers MUST preserve enough information to represent international dialing semantics and MUST separate extension data when needed.
- Display formatting MUST support locale- or destination-appropriate ordering without corrupting stored canonical data.
- External-provider restrictions MUST be documented where they narrow accepted values.

## MUST NOT
- Systems MUST NOT require first/middle/last-name structures unless the business domain genuinely requires those components.
- Postal codes, administrative areas, and street numbers MUST NOT be universally required or constrained to one national format.
- Phone numbers MUST NOT be validated by fixed string length alone.

## SHOULD
- Forms SHOULD reveal country-dependent fields progressively after destination selection.
- Canonical storage SHOULD remain separate from presentation formatting.

## Exceptions
Exceptions require a documented external or legal requirement, impacted populations, mitigation, and verification evidence.

## Verification
Test countries with and without postal codes, varied address order, mononyms, multi-part names, non-Latin scripts, international phone formats, extensions, and round-trip display/storage behavior.