# Rulesets

Source of truth for the repository rulesets. Each file is the payload accepted by the
[GitHub Rulesets API](https://docs.github.com/en/rest/repos/rules).

| File           | Ruleset          | Target                |
| -------------- | ---------------- | --------------------- |
| `main.json`    | Proteger Main    | default branch        |
| `homolog.json` | Proteger homolog | `refs/heads/homolog`  |

`homolog.json` lets repository admins (`actor_id: 5`) bypass only through pull requests, so a
solo maintainer can still merge PRs while direct pushes stay blocked.

## Applying changes

```sh
REPO=anacarlapaiva/fiap-mobile-challenge

# list rulesets and their ids
gh api repos/$REPO/rulesets

# create
gh api -X POST repos/$REPO/rulesets --input .github/rulesets/<file>.json

# update an existing ruleset
gh api -X PUT repos/$REPO/rulesets/<id> --input .github/rulesets/<file>.json
```
