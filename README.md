# ui.phucbm.com

A collection of modern React UI components with smooth GSAP animations. Built with TypeScript, Tailwind CSS, Next.js 16, and Nextra for a component-driven documentation experience.

## Features

- **Production-Ready Components** – Fully reusable React components optimized for real-world projects
- **GSAP Animations** – Smooth, performant animations powered by GreenSock Animation Platform
- **TypeScript** – Complete type safety for all components and utilities
- **Tailwind CSS** – Utility-first styling with full customization support
- **Interactive Documentation** – Live component previews and code examples using Sandpack
- **Copy-to-Install** – Instantly add components to your project via shadcn CLI
- **Full-Text Search** – Fast search across documentation using Pagefind
- **Responsive & Accessible** – Mobile-first design with accessibility best practices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Documentation**: Nextra 4.6
- **Animations**: GSAP 3.13
- **Styling**: Tailwind CSS 4 with PostCSS
- **Code Editor**: Sandpack 2.20
- **Component Library**: shadcn/ui components
- **Icons**: Lucide React, Tabler Icons
- **Search**: Pagefind 1.4
- **Language**: TypeScript 5.9

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/phucbm/ui.phucbm.com.git
cd ui.phucbm.com

# Install dependencies
pnpm install
```

### Development

Start the development server with Turbopack for fast refresh:

```bash
pnpm dev
```

Visit `http://localhost:3000` to view the site locally.

### Building

Build the site for production:

```bash
pnpm build
```

This command:
1. Runs Next.js build
2. Generates the component registry (`public/r/`)
3. Creates a search index with Pagefind
4. Cleans up temporary files

Start the production server:

```bash
pnpm start
```

## Project Structure

```
.
├── app/                          # Next.js App Router pages
│   ├── (docs)/                  # Documentation routes
│   ├── api/                     # API endpoints
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # shadcn UI components
│   ├── registry-*.tsx           # Registry-specific components
│   └── ...
├── registry/phucbm/blocks/       # Source component definitions
│   ├── {component-name}/
│   │   ├── registry-item.json   # Component metadata
│   │   ├── {name}.tsx           # Main component
│   │   ├── example.tsx          # Default example
│   │   └── lib/                 # Component utilities
│   └── ...
├── content/components/           # MDX documentation files
├── lib/                          # Utility functions
├── scripts/                      # Build-time scripts
├── public/                       # Static assets
│   ├── r/                       # Generated registry (build output)
│   └── _pagefind/               # Search index (build output)
└── CLAUDE.md                     # Architecture & development guide
```

## Available Scripts

```bash
# Development
pnpm dev                    # Start dev server with Turbopack

# Building
pnpm build                  # Full build (Next.js + registry + search)
pnpm start                  # Production server

# Registry Operations
pnpm index-registry         # Generate registry.json and publish to public/r/
pnpm index-registry:dry     # Preview registry generation without writing files
pnpm clean-example-registry # Remove temporary .transformed.tsx files

# Individual Build Steps (run via postbuild)
pnpm build:pagefind        # Generate search index
pnpm build:registry        # Build registry (index + shadcn + clean)
```

## Registry System

The project uses a **three-layer registry system** for managing components:

1. **Source Registry** (`registry/phucbm/blocks/`) – Component source files
2. **Build-Time Processing** (`scripts/index-registry.ts`) – Transforms and aggregates components
3. **Published Registry** (`public/r/`) – Generated JSON files for distribution

Each component can be installed directly via shadcn CLI:

```bash
pnpm dlx shadcn@latest add https://ui.phucbm.com/r/{component-name}.json
```

## Adding Components

To add a new component to the registry:

1. Create a directory in `registry/phucbm/blocks/`
2. Add `registry-item.json` with component metadata
3. Create the main component file (name must match directory)
4. Add example files (`example.tsx`, `example-02.tsx`, etc.)
5. Create MDX documentation in `content/components/`
6. Run `pnpm build` to regenerate the registry

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** – Complete architecture guide, build pipeline, key files reference
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** – Quick lookup for common files and commands
- **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)** – Visual diagrams of system flow

## Live Demo

Visit the live documentation site: **[ui.phucbm.com](https://ui.phucbm.com)**

## Components

The registry currently includes 11+ production-ready components:

- Draw SVG
- Text Ripple
- Text Flower
- Magnetic Button
- Moving Border
- Infinite Grid
- Shimmer Layer
- Infinite Image Carousel
- Spotlight Content
- Word by Word
- Nextra Search Dialog

Browse all components with interactive previews at [ui.phucbm.com](https://ui.phucbm.com).

## License

MIT License - see [LICENSE](./LICENSE) file for details

## Author

**PHUCBM** – [@phucbm](https://github.com/phucbm)

---

**This is an open-source project showcasing modern web development practices.** Feel free to explore the codebase, learn from the architecture, and adapt patterns for your own projects.
