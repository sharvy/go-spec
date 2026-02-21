# /gs:update — Update go-spec

Check for and install updates to go-spec.

---

## Process

### Step 1: Check Current Version

Read the version from the installed go-spec command files (`.version` marker file
in the commands directory).

```
Current version: [version]
Checking for updates…
```

### Step 2: Check for Updates

Fetch the latest version from the npm registry:
```
npm show go-spec version
```

Or check the GitHub releases API if npm is unavailable.

### Step 3: Show Results

**Up to date:**
```
✓ go-spec is up to date (v[version])
```

**Update available:**
```
Update available: v[current] → v[latest]

Changes in v[latest]:
  [If changelog is accessible, show relevant changes]

Update now?
```

### Step 4: Install Update

If user confirms, run:
```
npx go-spec@latest --claude --global
```

(Or `--local` if the current installation is local — detect from the commands directory path.)

### Step 5: Verify

After update, read the new version marker and confirm:
```
✓ go-spec updated to v[latest]
```

---

## Notes

- Updating replaces command, agent, and hook files only
- Your `.spec/` directory and project data are never touched by updates
- Config (`config.json`) is preserved across updates
- If an update introduces breaking changes to config schema, a migration note will be shown
