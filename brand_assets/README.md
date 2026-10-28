# brand_assets/

Everything that defines how the brand looks. Checked before any design work.

```
brand_assets/
  logo/         svg preferred, png fallback, light + dark variants
  photos/       real photography, already cropped and compressed
  palette.md    hex values with the role each one plays
  fonts.md      families, weights, where each is used
  style/        style guide pdf, moodboard, competitor refs
```

Rules:

- A real asset beats a placeholder. If a logo or photo lives here, use it.
- If `palette.md` defines colors, those exact values ship. Do not invent a shade.
- Empty folder is a valid state. It means: use numbered placeholders (see CLAUDE.md)
  and ask for the real assets.
- Reference screenshots to rebuild pixel-for-pixel go in `docs/design-references/`,
  not here. This folder is brand, that folder is spec.
