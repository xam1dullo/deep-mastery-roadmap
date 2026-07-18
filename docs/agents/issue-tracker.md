# Issue tracker: beads (`bd`)

Issues and PRDs for this repo live in **beads** — a git-native issue tracker with
first-class dependency support. Data lives in `.beads/` (JSONL synced through git,
SQLite/Dolt cache). Use the `bd` CLI for all operations.

> Not initialized yet: run `git init && bd init` once before the first `bd create`.
> `bd where` shows the resolved workspace; `bd doctor` fixes a broken install.

## Conventions

- **Create an issue**: `bd create "<title>" -d "<body>" [-t task|bug|feature|epic] [-l label1,label2] [-p 0-3]`.
  Use `--body-file -` to pipe a multi-line body from stdin. `bd q "<title>"` quick-captures and prints only the new ID.
- **Read an issue**: `bd show <id>` (alias `bd view`). Add `--children` for an epic's children; `bd comments <id>` for the thread.
- **List issues**: `bd list` (open issues, tree view). Filter with `-l <label>` (AND), `--label-any`, `-a <assignee>`, `--status`, `--all` (include closed). `bd list --ready` shows claimable work (see Wayfinding).
- **Search**: `bd search "<text>"`, or `bd query "<expr>"` for the query language.
- **Comment**: `bd comment <id> "<text>"` (or `--stdin` / `--file`).
- **Apply / remove labels**: `bd label add <id> <label>` / `bd label remove <id> <label>`. `bd label list-all` lists every label in use. See `triage-labels.md` for the triage role strings.
- **Assign**: `bd assign <id> <who>` (or `--assignee` on `create`).
- **Close / reopen**: `bd close <id> [--reason "..."]` / `bd reopen <id>`.

The issue ID prefix (e.g. `bd-`) is set at `bd init`.

## Pull requests as a triage surface

**PRs as a request surface: no.** beads is not tied to a forge, so PRs are not part of
the triage queue. If that changes, record the workflow here.

## When a skill says "publish to the issue tracker"

Create a beads issue: `bd create "<title>" -d "<body>"`. For a PRD, create an `epic`
(`-t epic`) and hang implementation issues off it with `--parent <epic-id>`.

## When a skill says "fetch the relevant ticket"

`bd show <id>` for the issue, `bd comments <id>` for the conversation. The user will
normally pass the `bd-NN` id directly.

## Wayfinding operations

Used by `/wayfinder`. Beads maps onto the map/child model natively.

- **Map**: an `epic` issue (`bd create "<effort>" -t epic -l wayfinder:map`) holding the
  Notes / Decisions-so-far / Fog body (edit via `bd edit <id>` or append with `bd note <id> "..."`).
- **Child ticket**: an issue created with `--parent <map-id>`, labelled `wayfinder:<type>`
  (`research`/`prototype`/`grilling`/`task`). The question goes in the description.
  `bd children <map-id>` lists them.
- **Blocking**: native dependencies — `bd dep <blocker-id> --blocks <blocked-id>`
  (or `bd dep add <blocked-id> <blocker-id>`). `bd dep list <id>` shows edges;
  `bd dep cycles` guards against loops. A ticket is unblocked when every blocker is closed.
- **Frontier query**: `bd ready` (alias `bd list --ready`) returns open, unblocked,
  unclaimed issues — blocker-aware by construction. Scope to the map with `bd ready --mol <map-id>`
  where applicable; first in list order wins.
- **Claim**: `bd assign <id> @me` (or `bd update <id> --status in_progress`) — the session's first write.
- **Resolve**: `bd comment <id> "<answer>"`, then `bd close <id>`, then append a context
  pointer (gist + link) to the map's Decisions-so-far via `bd note <map-id> "..."`.
