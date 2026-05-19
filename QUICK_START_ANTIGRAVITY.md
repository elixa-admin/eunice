# Quick Start — AntiGravity Session

**You're picking up on May 19, 2026.**  
**Assessment form is done. Local dev env is fixed. Sprint 3 design work starts now.**

---

## In 5 Minutes: What Happened

1. **Assessment form is LIVE** → http://localhost:3000
   - Eunice staff are completing their intake assessment
   - Form data saves to Supabase → you'll analyze it in Sprint 4

2. **Dev environment is now PERMANENT**
   - Port auto-finding (start-dev.sh calls dev-server.js)
   - Chrome extension allows localhost navigation
   - Survives context breaks

3. **Two Next.js apps exist:**
   - `assessment/` — Done, live on port 3000
   - `src/` — Needs setup, will be parent portal + admin dashboard

4. **You're in Sprint 3** (May 20–25 / 5 working days)
   - Focus: Design system, mock data, Figma scaffolding
   - Not coding features yet — just planning & prep

---

## Your First 30 Minutes

### Step 1: Verify Assessment Form Running
```bash
# Should already be running in a Terminal window from the session before
# If not, run:
node start-dev.sh
# Check: http://localhost:3000
```

### Step 2: Install Missing Deps in `src/`
```bash
npm install --prefix src @supabase/supabase-js clsx
# Takes ~2 min
```

### Step 3: Set Up `src/` Dev Server
Copy this to `/Users/brandondienar/Documents/Codex/Projects/Eunice/src/dev-server.js`:
```javascript
#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');

function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, 'localhost', () => {
      const port = server.address().port;
      server.close(() => {
        console.log(`✓ Found available port: ${port}`);
        resolve(port);
      });
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

async function startDevServer() {
  const port = await findAvailablePort(3000);
  const url = `http://localhost:${port}`;
  
  console.log('\n🚀 Starting Next.js dev server...');
  console.log(`📍 Local preview: ${url}\n`);
  
  const path = require('path');
  const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');
  const devServer = spawn(nextBin, ['dev', '-p', port.toString()], {
    stdio: 'inherit',
    cwd: __dirname
  });

  devServer.on('error', (err) => {
    console.error('Failed to start dev server:', err);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping dev server...');
    devServer.kill();
    process.exit(0);
  });
}

startDevServer();
```

Then test:
```bash
chmod +x src/dev-server.js
node src/dev-server.js
# Should start on localhost:3002 or 3003
```

### Step 4: Read the Sprint Plan
```bash
# Open this file and read it fully:
/Users/brandondienar/Documents/Codex/Projects/Eunice/docs/SPRINT_PLAN_3_4.md

# Key sections:
# - Sprint 3 shared decisions (5 min read)
# - Task 3.1–3.5 descriptions (10 min read)
```

### Step 5: Start Task 3.1 (Design System in Figma)
- Create a Figma workspace or file
- Copy colors from `src/tailwind.config.ts` into Figma as a library
- Define 10+ base components (button, input, card, modal, table, badge, alert, etc.)
- Share link with stakeholder for feedback
- Time: ~4–5 hours

---

## File Locations You'll Need

```
/Users/brandondienar/Documents/Codex/Projects/Eunice/
├── assessment/              # Assessment form (DONE)
│   ├── dev-server.js       # Auto port-finder (reference for src/)
│   └── app/page.tsx        # Form component
│
├── src/                     # Parent portal + admin (START HERE)
│   ├── app/
│   │   ├── parent/page.tsx # Placeholder: "Coming Soon"
│   │   ├── admin/page.tsx  # Placeholder: "Coming Soon"
│   │   └── layout.tsx      # Root layout
│   ├── components/ui/      # Button, card, input (stubs)
│   ├── lib/supabase.ts     # Database client
│   └── tailwind.config.ts  # Design tokens ← REFERENCE FOR FIGMA
│
├── docs/
│   ├── SPRINT_PLAN_3_4.md  # ← READ THIS FIRST
│   ├── REQUIREMENTS.md     # Feature specs, user flows
│   ├── ARCHITECTURE.md     # Tech stack, data model
│   └── PROJECT_BRIEF.md    # Business context
│
├── HANDOFF_TO_ANTIGRAVITY.md  # ← Full context (you're here)
├── QUICK_START_ANTIGRAVITY.md # ← You're reading this
└── README.md               # Updated status
```

---

## What NOT to Do Yet

❌ Don't start coding the parent portal or admin dashboard  
❌ Don't build API endpoints  
❌ Don't install shadcn/ui components (design first)  
❌ Don't worry about database migrations  

**This is Sprint 3: DESIGN & PLANNING ONLY.**

---

## What TO Do Next (Today)

1. ✅ Verify assessment form is running
2. ✅ Install deps in `src/`
3. ✅ Set up dev server for `src/`
4. ✅ Read SPRINT_PLAN_3_4.md fully
5. ✅ Start Task 3.1: Create Figma design system (4–5 hours today)

---

## Success = Getting to June 1

By June 1:
- [ ] All Sprint 3 tasks done (design system, mock data, Figma scaffolds)
- [ ] Assessment responses analyzed (workflow patterns documented)
- [ ] Stakeholder has reviewed & approved designs
- [ ] Ready to hand off to Phase 2 (build) on June 1

**You've got this. Ping back when you hit blockers or finish Sprint 3.** 🚀
