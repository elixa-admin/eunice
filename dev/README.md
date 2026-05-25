## Dev Workspace

This workspace is the product preview surface for the Eunice admissions platform. It is intentionally separate from the assessment flow and is where we shape the parent and admin experience before wiring up real backend data.

## Workspace Dependency Plan

The dev workspace should stay lightweight, but it needs a dependable local toolchain.

### Core runtime
- `next`
- `react`
- `react-dom`
- `typescript`

### Styling
- `tailwindcss`
- `@tailwindcss/postcss`

### Verification
- `eslint`
- `eslint-config-next`
- `@types/node`
- `@types/react`
- `@types/react-dom`

### Current verify commands
- `npm run lint`
- `npm run typecheck`
- `npm run check`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Install dependencies first, then open [http://localhost:3000](http://localhost:3000) in your browser.

You can start editing the preview routes under `app/dev/`. The page auto-updates as you edit the file.

## Sprint Focus

The current sprint focus is:
- richer preview application data
- stronger application detail surfaces
- clearer admin and parent review states

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
