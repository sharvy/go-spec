# Debug Session: [YYYY-MM-DD-slug]

**Status:** Active / Resolved / Blocked
**Opened:** [timestamp]
**Resolved:** [timestamp or —]

## Bug Report

**Symptom:** [Exact error message or wrong behavior — copy verbatim, don't paraphrase]
**Expected:** [What should happen instead]
**Reproducible:** Yes / No / Intermittent

**Reproduction steps:**
1. [Step]
2. [Step]
3. [Observe: exact error or wrong output]

**Environment:** [branch, OS, browser, anything relevant]

---

## Investigation Log

<!-- Add a new hypothesis block for each investigation step.
     Never modify code without a confirmed root cause. -->

### Hypothesis 1: [Specific claim about root cause]

**Test:** [What I'll do to check this — read a file, run a command, add a log]
**Result:** [Exactly what happened]
**Conclusion:** CONFIRMED / REFUTED / PARTIAL
**Next:** [What this means for the investigation]

---

### Hypothesis 2: [Next claim]

**Test:** [...]
**Result:** [...]
**Conclusion:** [...]
**Next:** [...]

---

## Root Cause

<!-- Fill in only after a hypothesis is CONFIRMED -->

[Precise explanation of what was wrong and why. Not "the token expired" but
"the refresh interceptor fires but uses the old token from closure scope because
it captures `token` at mount time rather than reading from the store."]

## Fix Applied

**Commit:** [sha] — [commit message]
**Files changed:** [list]
**Explanation:** [Why this fix addresses the root cause, not just the symptom]

## Regression Prevention

[Test added, assertion added, or check added to prevent this from recurring]
[Or: "No test added — reason: [intermittent/environment-specific/etc.]"]
