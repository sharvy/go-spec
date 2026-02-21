# /gs:profile [name] — Switch Model Profile

Switch between model profiles that balance quality vs. speed vs. cost.
Profiles control which Claude model is used for each workflow step.

---

## Usage

```
/gs:profile quality
/gs:profile balanced
/gs:profile budget
```

---

## Profiles

| Profile | Planning/Research | Execution | Verification | Use When |
|---------|-------------------|-----------|--------------|----------|
| `quality` | Claude Opus | Claude Opus | Claude Sonnet | Maximum quality, complex projects |
| `balanced` | Claude Opus | Claude Sonnet | Claude Sonnet | Best overall (default) |
| `budget` | Claude Sonnet | Claude Sonnet | Claude Haiku | Fast iteration, cost-sensitive |

---

## Process

### Step 1: Show Current Profile

Read `.spec/config.json`.

```
Current profile: balanced

  Planning/Research: Claude Opus
  Execution:         Claude Sonnet
  Verification:      Claude Sonnet
```

### Step 2: Change Profile

If a profile name was provided as argument: apply it directly.

If not: show options and ask.

### Step 3: Apply

Update `config.json → models.profile`.

Print:
```
✓ Profile changed to: [name]

  Planning/Research: [model]
  Execution:         [model]
  Verification:      [model]

Takes effect on the next command.
```

Commit:
```
git add .spec/config.json
git commit -m "go-spec: switch to [name] model profile"
```

---

## When to Change Profiles

**Switch to `quality` when:**
- Starting a complex, high-stakes feature
- Research is critical (unfamiliar domain, novel architecture)
- You've had quality issues and want more thorough planning

**Switch to `budget` when:**
- Rapid prototyping and iteration
- Working on well-understood, mechanical tasks
- Exploring an idea before committing to full planning

**Switch back to `balanced` when:**
- Normal development velocity
- Mixed complexity work
