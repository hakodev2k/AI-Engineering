# Internationalization Security Rules

## Purpose
Prevent localization and Unicode features from creating injection, spoofing, authorization, or data-exposure vulnerabilities.

## Scope
Applies to localized rendering, Unicode identifiers, translation content, locale parameters, resource loading, and language-dependent input handling.

## MUST
- Localized output MUST preserve the same contextual escaping, sanitization, and content-security boundaries as source-locale output.
- Locale identifiers and resource paths derived from requests MUST be allowlisted or safely canonicalized before file, template, or resource access.
- Security-sensitive identifiers MUST use documented comparison and normalization semantics resistant to visually confusable or mixed-script ambiguity where relevant.
- Translation suppliers, repositories, and delivery pipelines MUST have access controls appropriate to their ability to change production-visible content.
- Security warnings, consent text, and authorization-related messages MUST preserve their reviewed meaning across supported locales.

## MUST NOT
- Translation content MUST NOT be trusted as executable markup, script, format code, or privileged configuration merely because it comes from a localization system.
- Locale switching MUST NOT bypass authorization, tenancy, consent, or content-entitlement checks.
- Unicode normalization or case folding MUST NOT silently change authentication or authorization identifiers without a reviewed identity policy.

## SHOULD
- Security testing SHOULD include mixed-script spoofing, bidi controls, malicious placeholders, malformed locale tags, and translation-resource tampering scenarios.
- High-risk localized content SHOULD require traceable review and controlled promotion.

## Exceptions
Exceptions require threat analysis, affected locales, compensating controls, evidence, and approval from the accountable security owner.

## Verification
Run security tests, resource-permission inspection, locale-parameter fuzzing, output-encoding tests, Unicode confusable review, authorization tests across locales, and translation-pipeline audit checks.