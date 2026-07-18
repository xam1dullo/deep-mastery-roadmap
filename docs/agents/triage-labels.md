# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's beads tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

In beads, apply these with `bd label add <id> <label>` and remove with `bd label remove <id> <label>`. Since these are mutually-exclusive states, remove the old role label when adding the new one. (If you later want an audited state machine, `bd set-state <id> triage=<value>` records an event and manages a `triage:<value>` label for you — but the flat strings above are what the skills apply by default.)

Edit the right-hand column to match whatever vocabulary you actually use.
