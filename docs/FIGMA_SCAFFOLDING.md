# Figma Wireframe Prototype Scaffolding Guide

**Document Status:** READY FOR SPRINT 4 DESIGN  
**Date:** May 20, 2026  
**Context:** Sprint 3 Task 3.4 Scaffolding and Layout Architecture

---

## 1. Figma File Hierarchy & Page Layout

To support high-velocity, organized design iterations in Sprint 4, the Figma canvas is partitioned into the following sections:

```
📁 Eunice admissions Portal
 ├── 🎨 Foundations (Colors, Typography, UI Shadows)
 ├── 🧱 UI Component Library (Buttons, Forms, Alerts, Badges)
 ├── 📱 Parent Portal Flow (Mobile-First, 375px)
 │    ├── [P01] Auth (Signin / Signup / Password Reset)
 │    ├── [P02] Parent Dashboard (Applications List, Empty State)
 │    └── [P03] Multi-Step guided Application Form
 └── 🖥️ Admin Portal Flow (Desktop-First, 1440px)
      ├── [A01] Admin Dashboard Overview (Counters, Performance Stats)
      ├── [A02] Application Queue Grid (Filters, Sorts, Search)
      └── [A03] Learner Evaluation Profile View (Doc checklist, Audit pane)
```

---

## 2. Layout Grid Specifications

To ensure pixel-perfect conversion from Figma design system to Tailwind CSS layout tokens during Phase 2 development:

### A. Mobile Layout Grid (Parent Portal)
* **Design Breakpoint:** 375px (iPhone 13/14 size standard)
* **Columns:** 4 Columns
* **Margin:** 20px (left/right)
* **Gutter:** 16px
* **Alignment:** Stretch
* **Vertical Grid:** 8px baseline alignment grid

### B. Desktop Layout Grid (Admin Dashboard)
* **Design Breakpoint:** 1440px (MacBook Pro standard)
* **Columns:** 12 Columns
* **Margin:** 80px (left/right)
* **Gutter:** 24px
* **Alignment:** Center (Max-width container set to 1280px)

---

## 3. Base Component Spec Matrix

All Figma UI component symbols are configured with auto-layout and variant states, matching Tailwind classes:

| Component Symbol | Responsive Dimensions | Visual State Variants | Tailwind Match |
|:---|:---|:---|:---|
| **Primary Button** | H: 44px (Mobile) / 40px (Desktop) | Default, Hover, Active, Disabled, Loading | `bg-white text-primary-950 font-bold px-4 py-2` |
| **Form Input Field** | H: 48px (Touch Target) | Default, Active/Focus, Error/Discrepancy | `bg-white/5 border border-white/10 rounded-xl px-4` |
| **Status Badge** | Padding: 4px 10px (Auto-layout) | Draft, Submitted, Under Review, Accepted, Rejected | `inline-flex px-2.5 py-1 text-xs rounded-full` |
| **Glass Card** | Border radius: 24px | Default, Hover/Select | `backdrop-blur-md bg-white/5 border border-white/10` |

---

## 4. Interactive Prototype Connections

The Sprint 4 design wireframes will be wired up to demonstrate the complete, interactive application journey:

```
[Signin Page] ──► [Parent Dashboard] ──► [Start Application] ──► [Multi-Step Form]
                                                                        │
[Admin Detail] ◄── [Admissions Queue] ◄── [Application Submitted] ◄──────┘
      │
      └─► [Doc Rejection Modal] ──► [Notify Parent] ──► [Parent Upload Modal]
```
