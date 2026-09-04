# Locale Architecture Rules

## Purpose
Define stable locale boundaries so internationalized products can add languages and regions without coupling business behavior to presentation assumptions.

## Scope
Applies to locale resolution, locale propagation, regional variants, fallback behavior, and locale-aware application boundaries.

## MUST
- The system MUST distinguish user language, content locale, formatting locale, timezone, and market/region when they represent different concepts.
- Locale resolution MUST have a documented precedence order and deterministic fallback path.
- Locale context MUST be explicit at boundaries where rendering, formatting, content selection, or localized validation occurs.
- Unsupported locales MUST resolve predictably without producing mixed-language or partially formatted output.
- Locale identifiers MUST use a documented canonical representation and normalization strategy.

## MUST NOT
- Business rules MUST NOT infer legal, tax, currency, entitlement, or residency behavior solely from UI language.
- Locale selection MUST NOT depend on mutable process-global state in concurrent request handling.
- A missing translation MUST NOT silently change business meaning.

## SHOULD
- Locale negotiation SHOULD preserve user preference when compatible with product policy.
- Domain data SHOULD remain locale-neutral unless localization is intrinsic to the data itself.

## Exceptions
Exceptions require documented rationale, affected locales, fallback behavior, compatibility risk, and verification evidence.

## Verification
Review locale resolution tests, request/session boundaries, fallback tests, concurrent execution tests, and configuration. Verify behavior for supported, partially supported, malformed, and unknown locale identifiers.