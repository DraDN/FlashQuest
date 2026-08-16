# Changelog

All notable changes to FlashQuest will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [0.2.0-alpha] - "Armadillo" - 2026-08-16

### Security
- Proper CORS configuration
- Rate limiter
- Helmet headers
- Superior error handling on the backend
- API input verifications
- API auth verifications

### Added

- Frontend handles error to a limited degree

### Changed

- Refactored frontend and backend code
- Deck XP bar now better shows XP progress towards the next level

### Fix

- Editing Dungeons now correctly refreshes the links to Decks

## [0.1.0-alpha] - 2026-07-04

### Added

#### Core Application
- Flashcard deck creation, editing, and deletion
- Card creation, editing, and deletion within decks
- XP and leveling system per deck — decks gain XP from dungeon runs and level up at thresholds
- Account summary on homepage showing user avatar, display name, and total level across all decks

#### Dungeon System
- Dungeon creation from one or more flashcard decks
- Linear dungeon structure — a gauntlet of enemies drawn from selected decks
- Hand system — player holds up to 5 cards at a time, hand restocks from deck when empty, discard pile reshuffles into deck when deck is exhausted
- Drag and drop card combat — drag a card from hand and drop it onto an enemy to initiate an attack
- Answer modal — prompts the player to answer the flashcard on attack; correct answers deal damage, wrong answers cost player HP
- Enemy HP system — enemies require multiple correct answers to defeat
- Boss room at the end of each dungeon
- Multiple dungeon rooms — completing a room advances to the next
- Victory and defeat screens

#### Results & Progression
- End-of-dungeon results screen showing correct answers, wrong answers, and accuracy
- XP earned per dungeon displayed with animated progress bar
- Level-up notification when a deck crosses a level threshold

#### Authentication
- User authentication via Clerk — sign up, sign in, and sign out
- Per-user data isolation — decks, cards, and dungeon runs are scoped to the authenticated user

#### Infrastructure
- Dockerised setup with separate frontend and backend containers
- `start.sh` script for switching between development and production environments with a single command
- Separate environment configuration via `.env.dev` and `.env.prod`
- Nginx serving the production frontend static build
- API proxied through frontend Nginx container in production — backend port not exposed publicly
- Continuous deployment via GitHub Actions — merges to `main` automatically deploy to production
- Cloudflare Zero Trust SSH tunnel for secure GitHub Actions server access
- SQLite database persisted via Docker volume

#### Developer Experience
- MIT License
- README with project description, tech stack badges, getting started guide, and roadmap
- `.env.example` template for new contributors
- `CHANGELOG.md` — this file

---

*This is the first public alpha release of FlashQuest. The core dungeon loop and flashcard management system are functional. Features marked on the roadmap — including spaced repetition, CSV import, leaderboards, and additional enemies — are planned for upcoming releases.*