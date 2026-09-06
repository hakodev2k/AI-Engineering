# Storyblok connector workflows

## Inspect content

1. `storyblok.story.list` with `{ "textSearch": "pricing", "withSummary": true, "perPage": 25 }` — READ, no approval.
2. `storyblok.story.get` with the selected numeric `storyId` — READ, no approval.
3. `storyblok.component.list` to inspect available component schemas — READ, no approval.

Expected output is the provider JSON wrapped with connector metadata such as pagination headers.

## Prepare an edit

Call `storyblok.story.update` with a numeric `storyId` and only the fields to change. Risk: WRITE. When write approval is enabled, approve the exact fingerprint `storyblok.story.update:<storyId>` before execution.

## Publish reviewed content

After reading the target story, call `storyblok.story.publish`. Risk: HIGH_RISK. Explicitly approve `storyblok.story.publish:<storyId>`.

## Delete content

`storyblok.story.delete` is DESTRUCTIVE. It is blocked unless `STORYBLOK_ALLOW_DESTRUCTIVE=true` and the exact fingerprint `storyblok.story.delete:<storyId>` is pre-approved.
