# AGENTS.md

## Agent skills

### Issue tracker

Issues are tracked with **beads** (`bd` CLI) in `.beads/`. External PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), applied as beads labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

> Setup note: `bd init` has not been run yet — beads needs a database (and a git repo to sync it) before the tracker works. Run `git init && bd init` before the first `bd create`.
