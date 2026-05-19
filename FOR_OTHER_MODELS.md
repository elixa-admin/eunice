# Instructions for Sonnet, Gemini, and Other AI Models

You've been sent here to help build the Eunice admissions platform. Here's everything you need.

---

## 📖 Step 1: Read the Context

Copy and paste this into your prompt:

📄 **`/MASTER_PROMPT.md`** (Full project context: what we're building, tech stack, current status, phases, design system)

That's it. You have everything needed to work independently.

---

## 🛠️ Step 2: Do Your Work

You might be asked to:
- Design the parent portal (wireframes + Figma prototype)
- Build the admin dashboard (React component + API)
- Create API endpoints (Supabase + Next.js)
- Design email templates
- Write tests
- Anything else on the roadmap

**Just follow the MASTER_PROMPT context.** All decisions, architecture, and philosophy are documented there.

---

## 📤 Step 3: Commit Your Work

**When you're done, commit to GitHub with this format:**

```bash
# YOUR MODEL NAME in the commit message
git commit -m "[YourModelName] feat/fix/docs: what you did"

# Examples:
git commit -m "[Sonnet] feat: implement parent signup and email verification"
git commit -m "[Gemini] fix: admin dashboard filter performance"
git commit -m "[Claude] docs: update architecture documentation"

# Then push
git push origin main
```

**That's it.** I (Claude) will automatically detect your work when I resume this session. No extra steps needed.

---

## ✅ Example: What I'll See

When I resume development, I'll see:

```
git log --oneline -5

a1b2c3d [Sonnet] feat: implement parent signup and email verification
d4e5f6g [Sonnet] test: add auth flow unit tests
h7i8j9k [Gemini] fix: admin dashboard filter performance
i9j0k1l [Claude] docs: update MASTER_PROMPT
```

I'll automatically:
1. ✅ See what you built
2. ✅ Review the code changes
3. ✅ Run tests if you added them
4. ✅ Continue from where you left off
5. ✅ Note any blockers or tech decisions

---

## 🎯 Context You Have

Everything is in **`MASTER_PROMPT.md`**:

- ✅ Mission & strategic goals
- ✅ Current Phase 0 status
- ✅ Tech stack (Next.js, Supabase, Vercel, Gmail SMTP)
- ✅ Project structure & URLs
- ✅ Form schema (102 fields, database table structure)
- ✅ Phase 1-4 plans with detailed sprints
- ✅ Design system philosophy & specs
- ✅ Deployment pipeline (git → Vercel auto-deploy)
- ✅ Success metrics & gates
- ✅ Risk register & mitigations

**No context is hidden. No surprises.**

---

## 🚀 What's Ready to Work On

**Immediate (Phase 1, starting May 20):**
- [ ] Figma design system (colors, typography, 10+ components)
- [ ] Parent portal wireframes (auth, app creation, upload, tracking)
- [ ] Admin dashboard wireframes (list, detail, status, notes)
- [ ] Design system finalization (component specs for dev)

**Next (Phase 2, starting Jun 1):**
- [ ] Parent portal development (Next.js, Supabase auth)
- [ ] Admin dashboard development (React components, API)
- [ ] API endpoints (all CRUD operations)
- [ ] Email automation & notifications
- [ ] Testing & QA

**Pick a task, check the MASTER_PROMPT for context, go.**

---

## ❓ Questions?

Everything is documented in:
- `/MASTER_PROMPT.md` (this session's full context)
- `/docs/PHASES.md` (phase breakdown)
- `/docs/REQUIREMENTS.md` (detailed user flows)
- `/docs/ARCHITECTURE.md` (tech decisions)

If you can't find an answer, add a question comment to the relevant doc and Claude will see it when the session resumes.

---

## 🎓 Key Principles

1. **Scope discipline** — This is an admissions MVP, not a full ERP. Say "no" to scope creep.
2. **Mobile-first** — Design for 375px, then expand. Test on old Android devices.
3. **Simple over clever** — Prefer obvious code over optimized-but-confusing code.
4. **One commit per feature** — Atomic commits with clear messages. Makes history readable.
5. **Test as you go** — Don't write 1000 lines then test. Write, test, commit.

---

## 📝 Commit Message Examples

Good:
```
[Sonnet] feat: implement parent signup with email verification
[Gemini] fix: admin dashboard filter performance regression
[Claude] docs: add database schema diagram to architecture
[Sonnet] test: add integration tests for application submission
```

Bad:
```
updates
fixed stuff
changes
work in progress
```

---

**Ready to go?** Read MASTER_PROMPT.md, pick a task, build it, commit with your model name tag, push. Done.

See you when Claude resumes. 👋
