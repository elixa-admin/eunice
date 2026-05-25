# Git Publish Recovery Note

## When to use this
Use this note when a normal `git commit` / `git push` sequence stops working because the repository metadata is stuck, the working tree will not publish, or Vercel is not seeing a newer branch head even though local edits exist.

## Symptoms we saw
- `git commit` hung or failed without advancing the branch.
- `git push` reported the remote branch had moved or could not lock the ref.
- `.git/index` became unreadable or zero-byte.
- Stale lock files appeared under `.git/` and `.git/worktrees/...`.
- The main checkout kept showing the old remote head even after local edits.

## What fixed it
1. Stop trying to force the broken checkout.
2. Create a clean temporary worktree from the current HEAD.
3. Copy only the intended docs/content into that clean worktree.
4. Commit from the clean worktree.
5. Push that commit to a temporary branch.
6. Push the temporary branch to the real project branch.
7. Verify the remote branch head changed.

## Recovery steps
- Check for stale git locks:
  - `.git/index.lock`
  - `.git/HEAD.lock`
  - `.git/refs/heads/*.lock`
  - `.git/worktrees/*/index.lock`
- Check whether the main index is broken:
  - a zero-byte `.git/index` is a strong sign the checkout is unhealthy
- Prefer a worktree-based recovery instead of trying to repair the broken checkout in place.

## Clean worktree pattern
- Create a temporary branch from the current HEAD in a fresh worktree.
- Make the minimal required change there.
- Commit and push from the clean worktree.
- If the real project branch needs the update, fast-forward or push the clean branch commit to the project branch.

## What to remember next time
- Do not keep retrying commit/push against a corrupted index.
- Do not assume local edits are publishable until the remote branch head changes.
- If the repo metadata is unstable, use a temporary worktree as the safe publishing path.
