<div align="center">

<svg width="88" height="88" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brand-grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="30" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.25" fill="#ecfdf5" />
  <path d="M32 50V22" stroke="url(#brand-grad)" stroke-width="3.5" stroke-linecap="round" />
  <path d="M32 30C32 20 44 20 44 20C44 20 44 32 32 32" fill="url(#brand-grad)" />
  <path d="M32 38C32 28 20 28 20 28C20 28 20 40 32 40" fill="url(#brand-grad)" />
</svg>

# SkillBridge AI

**Grow your skills. Bridge the gap.**

An AI-driven curriculum orchestration and skill-gap assessment platform engineered for university technical streams.

[![Hackathon](https://img.shields.io/badge/TECHNEXA-2026-047857?style=for-the-badge)](https://github.com)
[![Backend](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e?style=for-the-badge)](https://supabase.com)
[![Serverless](https://img.shields.io/badge/Serverless-Netlify%20Functions-00c7b7?style=for-the-badge)](https://netlify.com)
[![License](https://img.shields.io/badge/License-MIT-slate?style=for-the-badge)](LICENSE)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Engineering Streams Matrix](#engineering-streams-matrix)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Local Setup & Deployment](#local-setup--deployment)
  - [Prerequisites](#prerequisites)
  - [Database Schema Initialization](#database-schema-initialization)
  - [Environment Variables](#environment-variables)
  - [Installation Steps](#installation-steps)
- [Serverless Functions Reference](#serverless-functions-reference)
- [Verification Engine Mechanics](#verification-engine-mechanics)
- [License](#license)

---

## Overview

Engineering education often exhibits a critical disconnect between broad university syllabi and the verifiable competencies demanded by modern engineering sectors. **SkillBridge AI** resolves this disparity through an autonomous technical tutor and progress verification pipeline.

The platform continuously evaluates enrolled skill tracks across 8 distinct engineering fields, formulates holistic multi-track dependency plans using AI, challenges learners with mastery-gated testing barriers, and surfaces live literature and laboratory search records.

---

## Key Features

### 1. Multi-Track Stream Specialization
Learners configure their engineering focus during onboarding. The system aligns modular syllabi, literature recommendations, and laboratory directories tailored directly to the selected domain.

### 2. Adaptive Knowledge Verification Gates
Milestones are not simply checked off. Each subtopic requires completing an interactive 5-question technical assessment. The platform enforces an $80\%$ minimum passing threshold ($4/5$ score) before marking the milestone as verified and unlocking subsequent curriculum modules.

### 3. Cross-Skill AI Portfolio Planner
The AI Assistant evaluates all active tracks concurrently to map dependencies, construct multi-stage execution phases, and propose unified capstone projects integrating all tracked skills into production architectures.

### 4. Architectural Deep-Dive & Subtopic Explainer
Learners can request structured breakdowns for any domain skill or trigger specialized masterclasses for isolated subtopics complete with technical specifications and code conventions.

### 5. Automated Multi-Tier Literature & Lab Discovery
The engine provides rotating textbook recommendations with automated query binding to the Amazon catalog, coupled with live and fallback indexing of virtual laboratory portals, IEEE papers, and official technical documentation.

### 6. Dual Visualization Interface
Skill portfolios can be toggled instantaneously between an interactive visual card matrix featuring progress rings and an enterprise-grade tabular data grid.

---

## Engineering Streams Matrix

| Stream | Focus | Representative Core Modules | Assessment Mechanism |
| :--- | :--- | :--- | :--- |
| **Computer Engineering** | Systems, Full-Stack & ML | HTML5/CSS, Python, Rust, C++, Microservices, Data Structures | Interactive Stepper Gate |
| **Automobile Engineering** | EV Systems & Powertrains | IC Engine Thermodynamics, Battery Management (BMS), Inverters | Interactive Stepper Gate |
| **Robotics Engineering** | Kinematics & Perception | Forward/Inverse Kinematics, ROS 2, OpenCV Vision, LiDAR SLAM | Interactive Stepper Gate |
| **Chemical Engineering** | Reactions & Separation | Reaction Kinetics, Aspen Plus, Distillation Columns, HAZOP Safety | Interactive Stepper Gate |
| **Civil Engineering** | Structural Design & Geotech | Structural Analysis, Reinforced Concrete (RCC), Soil Mechanics | Interactive Stepper Gate |
| **Electric Engineering** | Power Systems & Control | Transformers, Variable Frequency Drives (VFD), Smart Grids, DSP | Interactive Stepper Gate |
| **Biochemical Engineering** | Bioprocess & Molecular Tools | Bioreactor Scale-up, Fermentation Kinetics, Chromatography | Interactive Stepper Gate |
| **Mechatronics Engineering** | Industrial Automation & RTOS | PLC Ladder Logic, STM32 Microcontrollers, SCADA/HMI, Servos | Interactive Stepper Gate |

---

## System Architecture

```
                                  ┌─────────────────────────────────────────┐
                                  │            Client Frontend              │
                                  │  (Inter Typography, Tailwind CSS, DOM)  │
                                  └────────────────────┬────────────────────┘
                                                       │
                     ┌─────────────────────────────────┼─────────────────────────────────┐
                     ▼                                 ▼                                 ▼
       ┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
       │     Supabase Auth/DB      │     │    Netlify Serverless     │     │    Netlify Serverless     │
       │ (Session, State, Profiles)│     │      Function: /ai        │     │    Function: /search      │
       └───────────────────────────┘     └─────────────┬─────────────┘     └─────────────┬─────────────┘
                                                       ▼                                 ▼
                                         ┌───────────────────────────┐     ┌───────────────────────────┐
                                         │      LLM API Engine       │     │    External Web Search    │
                                         └───────────────────────────┘     └───────────────────────────┘
```

---

## Project Structure

```
.
├── dashboard.html             # Learner portal: Progress matrix, AI Planner, Source hub
├── index.html                 # Authentication portal: Login, Register, Recovery flows
├── privacypolicy.html         # Data processing, AI usage disclosures, and legal notices
├── tos.html                   # Platform conditions, disclaimer of warranties, and use rules
├── js/
│   ├── func.js                # Auth client orchestration, validation, and token handlers
│   └── theme.js               # Tailwind design system tokens, typography, and palette presets
├── netlify/
│   └── functions/
│       ├── ai.js              # Serverless gateway to LLM endpoints with prompt normalization
│       ├── config.js          # Secure credential injector for runtime frontend initialization
│       └── search.js          # API proxy for live query handling and web link rotation
├── package.json               # Project manifest, scripts, and production dependencies
└── README.md                  # Comprehensive platform documentation
```

---

## Local Setup & Deployment

### Prerequisites

* Node.js runtime version 18.0.0 or higher
* npm or pnpm package manager
* Netlify CLI (`npm install -g netlify-cli`)
* An active Supabase project instance

### Database Schema Initialization

Execute the following DDL block inside your Supabase SQL Editor to configure the relational user schema and Row-Level Security:

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  stream text default 'Computer Engineering',
  terms_accepted boolean default false,
  enrolled_skills jsonb default '[]'::jsonb,
  skill_domain text,
  skill_name text,
  completed_topics text[] default array[]::text[],
  progress_percentage integer default 0,
  ai_planner_response text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

create policy "Users can view and update their own profile."
  on public.profiles for all
  using ( auth.uid() = id );
```

### Environment Variables

Configure the following variables in your Netlify dashboard or in a local `.env` file at the repository root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
AI_API_KEY=your-generative-ai-key
SEARCH_API_KEY=your-search-api-key
```

### Installation Steps

1. Clone the repository to your development machine:
   ```bash
   git clone https://github.com/your-username/skillbridge-ai.git
   cd skillbridge-ai
   ```

2. Install runtime dependencies:
   ```bash
   npm install
   ```

3. Launch the local development server with Netlify Dev:
   ```bash
   netlify dev
   ```

4. Open `http://localhost:8888` in your browser.

---

## Serverless Functions Reference

| Endpoint | Method | Input Parameters | Responsibility |
| :--- | :--- | :--- | :--- |
| `/.netlify/functions/config` | `GET` | None | Returns verified client tokens for Supabase initialization |
| `/.netlify/functions/ai` | `POST` | `{ messages, max_tokens }` | Processes AI prompts for planner generation and concept masterclasses |
| `/.netlify/functions/search` | `GET` | `?query={search_term}` | Retrieves verified research, syllabus, and repository references |

---

## Verification Engine Mechanics

Each technical milestone enforces a quantitative assessment model:

$$\text{Score Percentage} = \left( \frac{\sum_{i=1}^{n} C_i}{n} \right) \times 100$$

Where:
* $n = 5$ (total discrete questions per knowledge gate)
* $C_i \in \{0, 1\}$ (0 for an incorrect option, 1 for a verified answer)
* Milestone Verification Threshold $\ge 80\%$ ($C_{\text{total}} \ge 4$)

A score beneath $80\%$ prevents module advancement, directing the student to the official documentation source prior to re-initiating the gate.

---

## License

This project is licensed under the MIT License. Developed for the **TECHNEXA Hackathon 2026**.


