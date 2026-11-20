# Changesets

Every pull request that changes a published package adds a changeset:

```bash
npx changeset
```

Pick the packages (they are versioned together), the bump and a one-line summary. New icons are a minor bump; renaming or removing an icon is a major bump; redrawing one is a patch.

Write the summary as the changelog line users will read, for example "Add 7 two-tone icons: terminal, code and brackets." The full rules are in [docs/releasing.md](../docs/releasing.md).
