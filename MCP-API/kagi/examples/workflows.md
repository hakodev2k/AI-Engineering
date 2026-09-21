# Kagi connector workflows

## Research
`kagi.search.web` input: `{"query":"Model Context Protocol security","limit":10}`. Permission: READ. Approval: no. Output: Kagi JSON search envelope.

## Small-web discovery
`kagi.enrich.web` input: `{"query":"local-first software"}`. Permission: READ. Approval: no.

## News discovery
`kagi.enrich.news` input: `{"query":"database reliability"}`. Permission: READ. Approval: no.

## Grounded answer
`kagi.answer.fastgpt` input includes `query`, optional `cache`, and a runtime-injected `approvalToken`. Permission: WRITE (billable). Approval: yes. The approval token must never be placed in an LLM prompt.

## Summarization
`kagi.summarize.url` accepts an HTTPS `url`, optional engine/language/cache fields, and runtime approval. `kagi.summarize.text` accepts text instead. Permission: WRITE (billable). Approval: yes.
