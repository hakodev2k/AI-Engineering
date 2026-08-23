# Game UI and Accessibility

## Purpose
Build game interfaces that remain readable, navigable, responsive, and usable across devices, input methods, display conditions, and player abilities.

## When to use
Use for HUDs, menus, inventory, dialogue, controller navigation, subtitles, remapping, scalable UI, or accessibility reviews.

## Inputs
UX flows, supported resolutions/aspect ratios, input devices, localization, accessibility goals, platform guidelines, and performance budgets.

## Context to inspect
Inspect focus/navigation graph, text scaling, safe areas, color usage, input prompts, subtitle settings, animation, screen-reader/platform support where relevant, and UI update frequency.

## Core knowledge
Accessibility is a system property, not a final polish pass. Do not encode meaning only through color, sound, or precise motor actions. Game UI must handle device switching, localization expansion, overscan/safe areas, and controller-first navigation.

## Procedure
1. Map critical player tasks and information hierarchy.
2. Validate keyboard/controller/touch navigation as applicable.
3. Support scalable text and adaptable layouts.
4. Provide configurable subtitles, contrast, motion, and input options relevant to the game.
5. Avoid color-only or audio-only critical signals.
6. Ensure focus is visible and restored predictably.
7. Test localization expansion and bidirectional text if supported.
8. Validate safe areas and aspect ratios.
9. Profile frequently updated HUD elements.
10. Test with representative accessibility settings and devices.

## Decision points
Prioritize options that remove barriers without changing competitive integrity; when a setting affects competitive play, document policy rather than silently restricting accessibility.

## Common failure patterns
Mouse-only menus, fixed pixel text, controller focus traps, inaccessible hold/mash actions, uncaptioned critical dialogue, flashing/motion without controls, and rebuilding whole UI trees every frame.

## Verification
Complete critical flows using each supported input method, test scaling/localization/safe areas, run accessibility checks, and profile dynamic HUD screens.

## Expected output
Responsive, accessible game UI with validated navigation and presentation across supported configurations.

## Stop conditions
Stop when platform accessibility requirements, competitive constraints, or localization scope require product/legal decisions not yet made.