# Terryn

Terryn is a modern land marketplace built with Next.js. It provides a digital platform for discovering, listing, buying, and managing land assets, with blockchain-backed ownership and marketplace functionality.

The application combines a polished property marketplace experience with authenticated user workflows, administrative review tools, map-based property discovery, and Ethereum-compatible smart contract integration.

## Features

- Browse and filter verified land listings.
- View detailed land and property information.
- Connect a crypto wallet to interact with blockchain features.
- Buy, sell, and showcase land assets.
- Submit land records for review.
- Track submitted entities from a user profile.
- Administrative dashboard for reviewing submissions and updating their status.
- Authentication with protected citizen and revenue-official workflows.
- Payment and OTP verification flows.
- Property maps and location-based browsing.
- NFT, escrow, and marketplace contract integrations on the Sepolia network.
- Responsive UI with animated interactions, carousels, and reusable components.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- React 19
- JavaScript
- Tailwind CSS
- Material UI and shadcn/ui-inspired components
- Ethers.js for blockchain integration
- React Leaflet and Google Maps components for maps
- Framer Motion and GSAP for animation
- Lenis for smooth scrolling

## Project Structure

```text
src/
├── app/                 # Routes, pages, server actions, and layouts
├── components/          # Reusable UI and application components
├── lib/blockchain/      # Wallet, NFT, escrow, and marketplace integrations
└── ui/                  # Shared UI primitives
public/                  # Images, logos, and static assets
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, pnpm, yarn, or Bun
- Access to the Terryn backend API
- A wallet configured for the Sepolia test network if using blockchain features

### Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/satya-root/terryn.git
cd terryn
npm install
```

### Environment variables

Create a `.env.local` file in the project root. Configure the backend API and deployed contract details used by your environment:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_TERRYN_NFT_ADDRESS=your_nft_contract_address
NEXT_PUBLIC_TERRYN_ESCROW_ADDRESS=your_escrow_contract_address
NEXT_PUBLIC_TERRYN_MARKETPLACE_ADDRESS=your_marketplace_contract_address
NEXT_PUBLIC_TERRYN_NFT_DEPLOY_BLOCK=your_deployment_block
```

The frontend currently targets the Sepolia chain (`11155111`) for blockchain interactions.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Application routes

- `/` — Terryn landing page
- `/explore` — Browse available land listings
- `/buy/[slug]` — Purchase a listed asset
- `/list/[slug]` — List an asset for sale
- `/add-entity` — Submit a land entity for review
- `/submitted-entities` — View submitted entities
- `/profile` — View the authenticated user profile
- `/billing` — Billing and account-related flows
- `/admin-login` — Revenue-official login
- `/admin-dashboard` — Manage and review submissions

## Backend integration

Terryn uses server actions to communicate with a backend API for authentication, profiles, entity submissions, and administrative workflows. Set `NEXT_PUBLIC_API_URL` to the base URL of the backend API before running the application.
