# Rulesets

Source of truth for the repository rulesets. Each file is the payload accepted by the
[GitHub Rulesets API](https://docs.github.com/en/rest/repos/rules).

| File           | Ruleset          | Target               | Merge methods |
| -------------- | ---------------- | -------------------- | ------------- |
| `main.json`    | Proteger Main    | default branch       | merge         |
| `homolog.json` | Proteger homolog | `refs/heads/homolog` | squash, merge |

Both branches block deletion and force pushes and only accept changes through pull requests
with every review conversation resolved.

## Branch flow

```
feat/*, fix/*, chore/*  --squash-->  homolog  --merge commit-->  main
```

- Feature branches start from `homolog` and are squash-merged into it.
- Releases are a `homolog -> main` pull request merged with a merge commit, so both branches
  keep the same history. `main` only allows merge commits to enforce this.

## Required approvals

`required_approving_review_count` is `0` while the repository has a single maintainer, since
GitHub does not let authors approve their own pull requests. Once more collaborators join,
raise it to `1` in both files and apply the change.

## Applying changes

Editing these files does not change GitHub by itself. After the change is merged, apply it:

```sh
REPO=anacarlapaiva/fiap-mobile-challenge

# list rulesets and their ids
gh api repos/$REPO/rulesets

# create
gh api -X POST repos/$REPO/rulesets --input .github/rulesets/<file>.json

# update an existing ruleset
gh api -X PUT repos/$REPO/rulesets/<id> --input .github/rulesets/<file>.json
```
