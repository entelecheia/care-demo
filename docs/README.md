# CARE Demo Platform Development Plan

## 1. Overview (Summary)

The CARE demo platform is an interactive web platform MVP that quantitatively and qualitatively analyzes changes in community acceptance resulting from policy decisions, and uses this analysis to drive community engagement. It integrates pre- and post-policy implementation metrics with community voices, and ultimately enables policy officials to generate a comprehensive evaluation and report.

For the demo scenario, we assume a policy of installing a wind farm in a U.S. region (e.g., Travis County, Texas). Users can review the community acceptance metrics for the region **before** the policy, design policy measures to implement, and then simulate how the metrics change **after** the policy. The platform visualizes changes in the Community Acceptance Index (CAI) and the five concern indicators based on the CARE framework, and simultaneously displays specific resident concerns and opinions (qualitative “reasoning”) in the form of cards. Finally, the user (policy official) can evaluate the outcome as positive or negative and leave a comment, then obtain a summary report of the entire process.

This document provides concrete details on system architecture, tech stack, core data models, key features and UI/UX design, API design, development phase roadmap, and non-functional requirements (security, performance, accessibility, etc.). It is written so that the development team can implement the actual MVP with a React frontend, Node/NestJS backend API, and data visualization components using only the information here.

## 2. System Architecture

### 2.1 Architecture Overview – Decoupled Monolith Approach

The MVP demo adopts a decoupled monolithic architecture. Rather than a full microservices setup, we develop as a single deployable unit but internally modularize the code by feature to allow future scalability. The main modules are separated as follows:

- **Auth module** – Handles user authentication and role management

- **Policy module** – Manages policy definitions and simulation input/output

- **Simulation module** – Contains the policy impact simulation engine and result calculation

- **Community module** – Manages community feedback (discussions, comments, evaluations, etc.)

These modules are implemented within one application with strict boundaries. Database access is done through each module’s service layer, and modules communicate only via well-defined interfaces (DTOs: Data Transfer Objects). This structure allows us to:

- Speed up initial development while maintaining code quality

- Easily split out specific modules into independent services (microservice transition) later if needed

**Why a monolith \+ modules?** In the demo stage, the user base and transactions are limited, so it’s advantageous to develop and deploy quickly in a unified environment without complex microservice infrastructure. A single codebase simplifies integration and reduces communication overhead among the team. However, by clearly separating code into module units and enforcing module boundaries, we avoid ending up with a “Big Ball of Mud.” Each functional module encapsulates its implementation and exchanges data only via shared DTOs.

_Example:_ The Simulation module calculates the CAI score and concern scores, then passes them as a DTO to the Policy module for DB storage. The Community module can use that DTO data to create discussion threads or link qualitative feedback to the results.

This design lets the dev team work in a single application while still maintaining logical separation of components for maintainability. It combines the simplicity of monolithic deployment with the organization of a modular design.

### 2.2 Tech Stack

- **Frontend:** React \+ TypeScript, using Next.js framework
  - Use SSR (Server-Side Rendering) to improve initial load performance and SEO, then CSR (client-side rendering) for rich interactivity.

  - React’s component-based structure makes it easy to reuse data visualization components (charts, maps, etc.).

- **Backend:** Node.js \+ TypeScript, using NestJS framework
  - NestJS provides a modular structure by default, ideal for the decoupled monolith approach described above.

  - TypeScript ensures static typing, improving safety and productivity in domain logic (policy calculations, etc.).

- **Database:** PostgreSQL (with PostGIS extension)
  - Suited for storing relational data like users, policies, simulations, community feedback.

  - Utilize JSONB columns for flexible fields (e.g., simulation result payloads, metadata for qualitative feedback).

  - Use PostGIS to store/query geographic boundary data (GeoJSON for country \> state \> county boundaries) to support region selection.

- **Maps & Visualization Libraries:**
  - **Maps:** On the frontend, use Mapbox GL or Leaflet with GeoJSON boundary data to implement interactive map UI.

  - **Charts:** Chart.js (for radar, bar charts) or custom D3-based implementations. We need to support radar (spider) charts, bar charts, slope graphs, etc., so use an appropriate library.

- **State Management:** For global state sharing, use Zustand or Redux Toolkit (but use simple React useState for local component state).

- **Other DevOps:**
  - Use Docker for containerization (to standardize dev environment and ease deployment).

  - Set up CI/CD with GitHub Actions (automate testing and deploy to staging). – More details on CI/CD and infrastructure are provided in Section 8.3 below.

### 2.3 Data Flow & Communication

At a high level, the user request-response flow works as follows:

- **Client Request:** When a user accesses a page/feature in the browser, the Next.js server receives the request. For pages requiring SSR, Next.js fetches initial data from the backend API to render HTML.

- **Initial Page Load:** The user downloads the base HTML and JS and sees the initial view. Subsequent interactions are handled by React on the client side (SPA behavior).

- **API Interactions:** Based on user actions (e.g., running a simulation, posting a comment), REST API calls are made. All endpoints are under the backend NestJS server’s /api/v1/... path.

- **Backend Processing:** NestJS routes each request to the appropriate module and executes business logic. _(Example: a POST request to /simulations is handled by the Simulation module service which runs the simulation logic.)_

- **Database Operations:** Service logic uses an ORM (e.g., TypeORM or Prisma) to retrieve or store data in PostgreSQL as needed.

- **Response:** The backend returns JSON results (e.g. a simulation run ID, or computed results), and the frontend updates the UI accordingly.

- **Real-time/Async Processing:** For long-running tasks like simulation execution, handle them asynchronously. The API immediately returns a job ID (run_id), and the backend queues the task (e.g., using BullMQ) for a worker to process. The frontend then periodically polls an endpoint like /simulations/{run_id} to check status. Once completed, the results are fetched and displayed.

## 3. Core Data Model (Data Model)

The data model defines the entities and relationships underpinning the platform’s functionality. The main tables (entities) and their purposes are as follows (a detailed schema will be provided via an ERD separately):

- **users:** User account information (name, email, password hash) and basic profile including role.

- **roles:** Definitions of user roles. Examples: Admin (administrator), Expert (analyst/policy staff), Citizen (citizen/community activist), etc. _(In the demo, we might accept “Policy Maker” as a role input, but internally treat it as an Expert role for permissions.)_

- **policies:** Stores policy overview info. Each policy has a title, description, author, status (DRAFT/PUBLISHED), etc.

- **policy_parameters:** List of parameters configured for a policy. Each parameter has a name, type (integer, float, enum, etc.), default value, and optionally input range or options (metadata JSON).
  - _Example:_ For the wind farm policy, parameters might include **compensation_amount** (param_name \= "compensation", type \= INTEGER), **number_of_turbines**, etc.

- **simulation_runs:** Records when a user runs a simulation on a policy. Fields include policy_id, user_id, start time, status (PENDING/COMPLETED/FAILED), completion time, etc.

- **simulation_inputs:** The input values a user provided for each simulation_run. Composed of run_id, parameter_id, and value (stored as string; parse as JSON if needed).

- **simulation_results:** Stores results of a simulation run. Designed to allow one or more result key-values per run. Key results include the CAI score and the five Concern indicator scores.
  - _Example result keys:_ "CAI_before", "CAI_after", "concern_environment_before", "concern_environment_after", etc.

  - result_value is stored as JSONB for flexibility – e.g., to hold time series or distributions if needed (for the demo, we will likely just use single numbers).

- **discussions:** Stores community discussion threads. To distinguish between general policy discussions and discussions about specific simulation results, this table can have a policy*id and a simulation_run_id (both nullable). For example, a thread might be linked to a specific simulation result (both IDs set) to discuss that outcome. *(In the demo, we repurpose this to hold qualitative feedback card data – essentially pre-filled resident opinions tagged by concern category.)\_

- **posts:** Individual opinion posts within a discussion thread. Linked by a thread_id to a discussion, and parent_post_id for reply threading. Stores content, author, timestamp, etc.

- **votes:** Records upvote/downvote on posts. Simply stores user*id, post_id, direction (UP/DOWN) as a composite PK to ensure one vote per user per post. *(In the demo, we won’t use a complex voting system beyond perhaps a final evaluation input by the user.)\_

**Entity relationships and design considerations:**

- **Policies & Simulations:** We separate policy templates (policies) from simulation runs because multiple simulations can be executed for one policy template. Users may want to explore various conditions for a single policy, so a one-to-many relationship (1 Policy : N SimulationRuns) allows storing and listing multiple scenario results for comparison in the UI.

- **Discussion threads:** We use discussion threads for two purposes: general policy discussion (only policy*id set) and simulation result discussion (simulation_run_id set). This supports tight integration of analysis results and discussion. For example, from a simulation result screen, a user could jump into a discussion specific to that result, keeping the conversation focused. *(In the MVP demo, instead of a full discussion feature, we use this structure to manage qualitative feedback card data. That is, we preload some resident opinions into the discussion/posts tables, each tagged with a Concern category, and simply retrieve them to display as cards.)\_

- **Qualitative data tagging:** To tag posts (resident opinions) with the five concern categories (CARE categories), we can either add a concern*category field to the posts table or have a separate many-to-many mapping table (post_concern_tags). For the demo, we assume each opinion is categorized under one primary concern and simply store a field for it. *(In the future, if one post can relate to multiple categories, we could normalize this with a separate table.)\_

- **CAI calculation:** The CAI (Community Acceptance Index) is a core composite metric indicating overall community acceptance. Its exact formula should be defined per policy context; for the demo, we’ll compute it by combining the five concern scores (e.g., a weighted sum or average scaled to 0–100). Initially, we can implement CAI as a simple average of the five concern scores (or equal-weighted sum).

- **Geo data:** To support region selection, we will use U.S. state and county boundary data. These can be stored in PostGIS as GeoJSON or loaded as static files (JSON/TopoJSON) in the frontend. Each county has a unique ID (like FIPS code), which we’ll use to link to policy data and results for regional lookups.

- **Data for MVP:** Since it’s impractical to integrate massive external datasets in the MVP, we will implement with representative example data. For instance, for Travis County we might preset a base CAI of 60, and five concern scores (Environment \= 55, Economy \= 70, Social \= 50, Procedural \= 65, Safety \= 60), along with a handful of resident opinion examples stored in the database. When running a simulation, a simple algorithm can adjust these scores (e.g., selecting an economic benefit policy option adds \+20 to Economy score; a noise mitigation option adds \+15 to Environment score) and recalc the CAI. Full integration with real data will be addressed later.

## 4. Key Features & UI/UX Design

The main features of the CARE demo platform follow a sequential user flow aligned with a policy impact analysis process. Below we detail the requirements and screen (UI) design for each feature. We also describe an example using the wind farm installation scenario to clarify the intended implementation.

### 4.1 User Authentication & Initial Setup (User Authentication & Context Setup)

**Feature Overview:** When the user first accesses the platform, they enter their name, role, and base region of interest. This provides a personalized experience and sets the context for analysis. _(In the demo, instead of a full email signup process, we simulate a quick login/profile setup to let the user dive into the flow immediately.)_

- **Role Selection:** Presented via a dropdown menu, with a predefined list of roles. Examples: Policy Analyst, Elected Official, Community Activist, Researcher, etc.
  - _Implementation:_ Pre-populate the roles table with these default values and display them in the dropdown. The selected role is stored in the session/profile context.

  - _Rationale:_ Different roles have different areas of interest, which could later allow role-based customized dashboards or permission differences (RBAC). _(E.g., Experts/Policy Makers might see more analytics, while Citizens might focus on discussion features.)_

- **Region Setting:** The user’s primary region of interest for policy analysis.
  - In the UI, allow selection of State and County. We could auto-select the state based on the user’s IP as a convenience, but the user must be able to change it.

  - _Demo simplification:_ On the very first screen, we might only ask for the state, and defer precise county selection to the next step’s map interface for simplicity.

- **Entry UI:** A simple welcome form asking for name, role, and region. _(E.g., “Hello, Policy Maker\! Please tell us your name and region of interest.”)_
  - **Input fields:** Name (text), Role (dropdown), Region (dropdown or text)

  - **Action:** On clicking the "Get Started" button, save this info in the session context and proceed to the analysis dashboard.

_Demo scenario example:_  
On the landing screen, a brief introduction text might say “Scenario: You are a policy maker planning to install a wind farm in Texas.” The user is prompted to enter their name, region, and role. If the user enters name “Alex”, selects region “Texas”, and role “Policy Maker”, then clicks Start, the next screen might greet them with **“Welcome, Alex\!”** and move on to the region selection interface.

### 4.2 Area of Interest Selection

**Feature Overview:** The user selects the specific geographic Area of Interest (AOI) they want to analyze. The platform supports two methods: an interactive map UI and a hierarchical dropdown menu for region selection.

- **Map-based selection:** Initially, display a map of the United States with state boundaries (a choropleth or simple outline map).
  - The user can zoom in or click on a state to reveal the county boundaries within that state.

  - Hovering over a county shows a tooltip with the county name; clicking a county selects it.

  - On selection, highlight the area on the map (e.g., change color), and show a label like “Selected Region: Texas \> Travis County” on the UI (either at the top or side panel).

- **Dropdown-based selection:** For users not comfortable with the map or who want quick selection, provide a two-step dropdown (State \-\> County).
  - First dropdown: list of States (assuming the user country is USA). e.g., user selects “Texas”.

  - Second dropdown: dynamically load the list of counties for the selected state (e.g., counties in Texas like Travis, etc.) and allow selection.

  - Once a county is selected via dropdown, automatically zoom/center the map to that state/county and highlight it.

- **Syncing:** The map and dropdown selections should stay in sync. If the user clicks a county on the map, the dropdown values update accordingly; if they choose via dropdown, the map highlights that region.

- **Proceed to next step:** Once a region is selected, a “View Analysis” or “Next” button becomes enabled. Clicking it moves to the main analysis dashboard for that region (fetching relevant data from the backend for that county).

_Demo scenario example:_  
On the second screen, Alex sees a map of the US. They zoom into Texas. The map shows Texas with its counties outlined. Alex clicks on Travis County. Travis County is highlighted on the map, and a label appears saying “Selected Region: Texas \> Travis County.” Alex then clicks the “Next” button to proceed to view the current acceptance status for Travis County.

### 4.3 Community Status Before Policy – Acceptance Index Dashboard

**Feature Overview:** This screen shows the baseline (before policy implementation) for the selected region’s community acceptance. It visualizes the Community Acceptance Index (CAI) and the five concern indicators so that the user can assess the current situation.

- **Overall Acceptance Index (CAI) Display:** A widget at the top of the screen prominently shows the current CAI value for the region.
  - **Design:** Could be a large number or a gauge. e.g., “Current Community Acceptance Index: 62/100”.

  - **Interpretation:** Explain that a value closer to 0 indicates strong opposition in the community, whereas closer to 100 indicates strong support. (Provide a tooltip or info icon with this explanation.)

- **CARE Concern Profile:** Below the CAI, display the five concern metrics (based on the CARE framework) for the region. These five are, according to CARE research, key factors influencing policy acceptance: _Economic impact, Environmental impact, Social equity, Procedural justice, Public health/Safety_.
  - **Visualization format:** A **radar chart** (also known as a spider chart) is recommended. Each of the 5 axes represents one concern category, and the region’s score (0–100) on each is plotted, with the points connected to form a polygon.
    - This gives an intuitive profile of the community’s concerns. If all values are even, the shape is fairly balanced (circular); if one axis is much longer, it indicates that particular area is of high concern or importance.

  - **Alternative:** For users unfamiliar with radar charts, we could also display five bar charts side by side. However, the radar chart is more effective at conveying the overall balance, so it will be the default.

  - **Interaction:** Hovering on any point or area of the radar (or bar) shows a tooltip with the score and an explanation of that concern. _(e.g., “Environment: 40 – Residents are very worried about environmental damage.”)_

  - **Information transparency:** Next to each concern label, include an info (i) icon that when clicked shows a definition of that concern category and its source. _(For example: “Environmental Impact – Negative effects on air/noise pollution, etc. Source: CARE 2023 study.”)_

- **Qualitative Feedback (“Reasons”) Display:** On the same screen, alongside the quantitative metrics, show actual **resident opinion cards** that provide context behind the numbers.
  - **UI format:** Place a list of cards or speech-bubble style boxes on the side or bottom of the screen.

  - **Content:** Each card contains a summary of a resident comment and a tag indicating which concern category it relates to. For example: **\[Environment\]** “I’m worried the wind farm will disrupt migratory birds.” – _Public hearing, May 2023_. Each card should have 1–2 sentence summary of a resident’s opinion along with metadata (source, date).

  - **Data source:** Query the backend posts table for representative opinions tagged with each concern category and display a few. _(For demo, perhaps 1 positive and 1 negative opinion for each of the 5 concerns, totaling \~5–10 cards.)_

  - **Visual cues:** Use color coding or icons on the cards to indicate which category they belong to. _(e.g., an environment-related comment card might have a green border or a leaf icon; an economic-related one might have a blue border or a dollar icon, etc.)_

  - **Screen summary:** This screen should allow an interpretation such as, “Currently in Travis County, residents have a relatively high positive outlook on economic benefits (score 70), but a low score on environmental impact (40) indicating significant concern.” The policy maker user should glean insights about which areas of concern are most pressing.

- **Demo scenario example:**  
  On the Travis County status screen, the CAI is displayed as **0.60** in large text. Below, a radar chart shows scores: Economy \= 70, Environment \= 40, Social \= 55, Procedural \= 65, Safety \= 60. Visually, the environment axis is much shorter, indicating environmental concerns are relatively high. To the right, comment cards are shown, e.g., “Environment: _I’m worried the noise will be too much_.” and “Economic: _I expect this will help our local economy_.” These provide context: why the environment score is low (noise concerns) and why the economy score is high (local economic benefit expectations). From this, the user (policy maker) realizes: “Environmental concerns are high; how can we mitigate noise/visual issues with policy measures?”

### 4.4 Policy Intervention Simulation

**Feature Overview:** In this step, the user selects and configures policy measures (interventions) to address community concerns, and then simulates their impact to see how the acceptance metrics might change. The user can try different combinations of options and see the predicted changes in real-time.

- **Policy options input UI:** The screen presents various policy measure options grouped by the five concern areas, so the user can choose interventions tailored to the region’s concerns. The user can select multiple options to formulate a policy package.
  - Offer 1–2 concrete measures for each concern category, as checkboxes or toggles. For example:
    - **Environment:** ☐ Environmental impact mitigation measure _(e.g., “Implement wildlife protection program”)_

    - **Noise/Visual (Environment subcategory):** ☐ Install noise barriers (checkbox)

    - **Economic:** ☐ Community profit sharing / electricity bill discount for residents

    - **Social Equity:** ☐ Increase compensation for vulnerable groups

    - **Procedural Justice:** ☐ Hold additional public hearings

    - **Safety:** ☐ Develop a safety response plan and training

  - Some options may have an intensity slider. _(e.g., a slider for compensation amount level – low/medium/high)_.

  - The UI should use intuitive controls (checkboxes or toggle switches) for selecting options. The user should be allowed to pick multiple options within a single category if desired (e.g., both environment options).

- **Simulation execution (instant feedback):** Whenever the user changes an option (toggling on/off) or when they click a “Predict Effect” button, the frontend sends a simulation request to the backend.
  - **API:** Call POST /simulations, including the policy or region identifier and the selected inputs (options and any slider values) in the request payload.

  - **Asynchronous processing:** The simulation logic might take some time, so the API immediately returns a run_id (job ID). The backend starts processing (e.g., adds the task to a queue, records a simulation_run). The frontend shows a loading spinner or “Calculating...” indicator, and polls the backend (e.g., GET /simulations/{run_id}) periodically to check if the results are ready.

  - _Demo simplification:_ Instead of a complex agent-based simulation, implement a stub calculation logic. Based on the selected options, apply predetermined rules to adjust the scores and produce new CAI and concern values. _(For example: selecting “Install noise barriers” increases Environment score by \+15; “Profit sharing” increases Economic score by \+20 and Social by \+5, etc. These weight rules are defined in advance.)_

  - **Immediate feedback:** For demo speed, we can also mirror the calculation logic in the frontend to update the UI instantly as options are toggled (then confirm with backend when done). This gives the user real-time feedback on changes.

- **Projected effect visualization (real-time update):** The key metrics on the screen update to compare **before vs. after** the policy intervention.

- **CAI change:** Display the new CAI next to the old one with an arrow showing the direction of change. e.g., “CAI: 60 → 75 (▲ \+15)” with a green upward arrow if it increased.
  - **Concern changes:** Update the concern charts to reflect the new values, overlaying them for comparison. Options for visualization:
    - _Overlay radar chart:_ Draw the new profile on the radar chart on top of the old profile. The old profile could be semi-transparent, the new one opaque, so differences in each axis are visible.

    - _Slope graph:_ For each concern category, draw a line connecting the before value to the after value, showing upward or downward slopes. For example: Environment 40 → 60 (up ▲), Economy 70 → 80 (slight up ▲), Social 55 → 50 (down ▼), etc.

  - **Emphasize changes:** Use color and labels to highlight changes: increases in one color (green or blue), decreases in another (red), and label the change amount (e.g., “+20” or “-5”, and perhaps percentage change).

  - **Qualitative feedback integration:** Adjust the displayed opinion cards according to the new predicted outcome. For instance, if environmental concern drops significantly due to a mitigation measure, you might show fewer negative environment comments or add a new positive comment about the environment (for the demo, we can pre-script these changes). Alternatively, if one concern’s change is very large, visually highlight the comment cards of that category to indicate that concern’s issues are being addressed.

  - **Scenario management:** For MVP, we only show the latest result, but in the future we could allow the user to save multiple scenarios and compare them side by side. _(Not implemented in MVP.)_

- **Demo scenario example:**  
  Alex, the policy maker, sees that environmental concern is high, so decides: “Let’s install noise barriers and give residents an economic benefit.” In the UI, Alex toggles on **“Install noise barriers”** and **“Discount on residents’ electricity bills”**. Immediately, the CAI on the screen rises from 0.60 to 0.78 (with an upward arrow and highlight). On the radar chart, the environment axis becomes much longer (40 → 70\) and the economic axis also rises (70 → 80\) compared to the old profile. A small explanatory text might appear: “_Noise mitigation reduced environmental concerns (+30), economic benefit improved economic perception (+10)._” On the resident comment cards, the previously negative environment comment might be shown crossed-out or faded, and a label “(mitigation planned)” added next to the noise concern comment to indicate it’s being addressed. In this way, the user can experiment with various combinations of measures to find an optimal policy package, seeing in real time how each combination might change community reactions.

### 4.5 Policy Outcome Evaluation Input (User Evaluation Input)

**Feature Overview:** After reviewing the simulation results, the user records their own evaluation of the policy outcome. This closes the feedback loop in the platform, and the collected evaluations can be useful for future meta-analyses.

- **Satisfaction evaluation:** Implement a simple binary feedback mechanism. For example, ask “Are you satisfied with this policy outcome?” with two options: 👍 “Positive” or 👎 “Negative”.
  - **UI:** Display two large buttons or icons (thumbs-up and thumbs-down) to encourage a clear choice.

  - **Backend storage:** Either have an **evaluation** table or add a field to simulation_runs to store this (e.g., user_evaluation \= 'POSITIVE' or 'NEGATIVE').

- **Reason input:** Provide a text box for the user to optionally enter a brief comment explaining their evaluation.
  - Placeholder example: “(Optional) Please leave a one-line reason for your evaluation.”

  - If entered, store this text in an evaluation_comment field.

  - These comments are valuable qualitative data; if many users gave negative evaluations, analyzing their comments could reveal which aspects were dissatisfying.

- **UI behavior:** When the user clicks 👍 or 👎, immediately show their selection (e.g., highlight the chosen icon) and reveal the text input field (if hidden initially). After typing a comment (if they choose to), the user clicks a “Submit” or “Done” button. On submission, save the data and proceed to the final report screen.

- **Permissions/Validation:** In the demo, assume one user can only evaluate once per scenario. In a real system, ensure the same user cannot submit multiple evaluations for the same policy/simulation (enforce unique (user, simulation_run) in DB or similar).

- **Demo scenario example:**  
  Alex sees that community opposition has largely dropped and is satisfied with the policy design. Alex clicks the 👍 **Positive** button. A text field appears, and Alex types: “It appears we’ve addressed the community’s main concerns.” Then clicks “Submit Evaluation.” This data is saved (e.g., evaluation \= positive, comment \= that text), and the platform moves to the final summary/report screen.

### 4.6 Final Summary & Report Generation (Final Summary & Report Generation)

**Feature Overview:** This screen provides a summary report of the entire analysis process, and allows the user to save it as a PDF or share it. The report can serve as documentation for policy stakeholders, outlining the expected effects and the process followed.

- **Report components:** Assemble the key content of this analysis on a single page (suitable for printing on e.g. A4 paper). Major sections include:
  - **Analysis Overview:** Basic info such as user name & role, target region, and policy scenario. _Example:_ “Alex (Policy Maker) – Wind Farm Acceptance Analysis for Travis County, Texas.” Include date/time stamp as well.

  - **Pre/Post Key Metrics:** Summary of CAI and concern indicator changes.
    - **CAI Summary:** e.g., “CAI 60 → 78 (▲ \+18, 30% improvement)” prominently displayed.

    - **Concern indicator changes:** Show the change in each of the five concerns, possibly with a small chart or icons. _(For example: Environment ▲ \+30, Economy ▲ \+10, Social ▼ \-5, Procedural ▲ \+0, Safety ▲ \+0)_.

    - **Key change explanation:** A one-line commentary, e.g., “Environmental concern score improved from 40 to 70, greatly reducing a major opposition factor.”

  - **Major Policy Measures:** List the intervention options the user ended up selecting. _Example:_ “Implemented Measures: Noise barrier installation, 20% discount on electricity bills for residents, additional public hearing.”

  - **Community Reaction Summary:** Include a couple of representative qualitative comments from residents, covering positive and negative. _Example:_ “_I think this compensation and measures are acceptable._”, “_It seems the noise issue I was worried about will be addressed._”.

  - **Analyst’s Evaluation:** Include the user’s own evaluation result and comment. _Example:_ “**Policy Maker’s Evaluation:** 👍 Positive – The major concerns of residents appear to be addressed, thus improving acceptance.”

- **Report format & style:**
  - Visually, present it in a clean dashboard-style layout. Key numbers should be large and bold, changes color-coded (e.g., green for improvements).

  - Design the layout with printing/PDF in mind (e.g., A4 size). In Next.js, this could be a dedicated static page or using a library like html2pdf to generate PDF.

  - Optionally include a platform logo or project name at the top to give it an official document feel.

- **Functional options:**
  - **Export to PDF:** Provide a “Save as PDF” button. On click, generate a PDF of the summary (either via a server-side API using a tool like Puppeteer, or client-side via HTML to PDF library).

  - **Shareable link:** (Optional for demo) If the user is logged in, we could save the report to their account and provide a unique URL (e.g., /reports/{reportId}) to share the same content with others. Not mandatory for MVP but design the structure with this in mind.

  - **Restart option:** On the report screen, include a button like “Analyze a new region” or “Restart Demo” to allow the user to go back to the beginning for a new run.

- **Demo scenario example (report content):**

**\[Analysis Overview\]**

- Analyst: Alex (Policy Maker)
- Target Region: Texas, Travis County
- Policy Scenario: Wind Farm Installation

**\[Key Metric Results\]**

- **Community Acceptance Index (CAI)**: 0.60 → **0.78** (▲ \+0.18 improvement)
- **Key Concern Indicators Changes:**
  - Environment: 40 → **70** (▲ \+30)
  - Economic: 70 → **80** (▲ \+10)
  - Social: 55 → **50** (▼ \-5)
  - Procedural: 65 → **65** (-- ±0)
  - Safety: 60 → **60** (-- ±0)

The environmental concern score improved significantly, and the economic outlook also rose slightly. However, the social equity score (fair compensation) saw a small drop (-5), indicating some remaining discontent.

**\[Implemented Policy Interventions\]**

- Noise barrier installation (noise mitigation measure)
- 20% discount on residents’ electricity bills (economic benefit)
- Additional public hearing held (to enhance communication)

**\[Community Feedback\]**

- “Initially I was very worried about noise, but I’m relieved they plan to implement noise mitigation.”
- “Knowing it will help our local economy, I’m strongly in favor.”

**\[Analyst Evaluation\]**

- **Overall Evaluation:** 👍 **Positive**
- **Comment:** The main causes of opposition have been mitigated, leading to higher community acceptance. In particular, efforts to address environmental issues were effective.

_(Alex can save this report as PDF or share it with the team as supporting evidence for proceeding with the policy.)_

## 5. API Design

Communication between the frontend and backend is done via RESTful APIs under the /api/v1/ path. Below is an outline of the necessary API endpoints and their behaviors for each major feature:

- **Auth API:** _(Can be simplified for demo)_
  - POST /auth/register – Register a new user (name, email, password, etc.)

  - POST /auth/login – Log in and receive a JWT

  - GET /auth/me – Get current logged-in user’s info

  - _Note:_ In the demo stage, we might bypass complex auth by operating with a single pre-defined Policy Maker user scenario. But we keep the structure in place for future expansion.

- **Policy & Parameters API:**
  - GET /policies – Retrieve list of available policies. _(For the demo, we can hardcode a specific demo policy.)_

  - POST /policies – Create a new policy (admin/Expert only)

  - GET /policies/{id} – Get details of a specific policy (description, parameter list, etc.)

  - PUT /policies/{id} – Update a policy

- **Simulation API:**
  - POST /simulations – Request to run a simulation. The request body will include the policyId (or region identifiers) and inputs (a map of parameter/option values).
    - **Response:** Return HTTP 202 Accepted with a body like { runId: UUID }.

    - _Backend logic:_ The Simulation module receives the input, starts asynchronous processing (adds to job queue), and creates a record in simulation_runs.

  - GET /simulations/{runId} – Check the status and/or results of a simulation run.
    - **Response example:** If not done: { status: "PENDING" }; If completed: { status: "COMPLETED", result: { CAI_before: 60, CAI_after: 78, concerns: { environment_before: 40, environment_after: 70, ... } } }.

    - _Backend:_ Looks up the run status, and if completed, retrieves simulation_results and composes the result payload.

    - _Async handling:_ Since the POST returns 202 immediately, the front-end will poll this GET endpoint every few seconds for updates (or alternatively, we could consider WebSocket/server-sent events in future).

- **Discussion/Feedback API:**
  - GET /discussions?policyId=X\&runId=Y – Retrieve discussion threads or opinion posts for a given policy (X) or a specific simulation result (Y).
    - _Demo use:_ We utilize this to fetch pre-entered resident opinions for the selected region/policy. (We can design it to allow filtering by concernCategory if needed.)

    - **Response:** An array of posts, e.g., \[ { postId, content, author, concernCategory, createdAt, ... }, ... \].

  - POST /discussions – Create a new discussion thread _(likely unused in MVP demo)_.

  - GET /posts?discussionId=Z – Retrieve all opinion posts under a specific discussion thread. _(Could be combined with discussions into one endpoint if desired.)_

  - POST /posts – Add a new opinion post. _(In the demo, when a user submits their final evaluation comment, we could internally store it as a post linked to a special discussion or directly to the run.)_

- _Demo simplification:_ All qualitative feedback items (resident opinions) are preloaded into the database, and the demo primarily reads them via GET calls. The user’s final evaluation comment can be stored without creating a new separate entity – for instance, insert it as a post of type “evaluation” under an existing thread, or simply update a field in simulation_runs, whichever is simpler.
  - **Report/Evaluation API:**

  - POST /evaluations – _(Optional for demo)_ Save a user’s final evaluation. Fields might include simulationRunId, userId, isPositive (bool), comment.
    - If we don’t repurpose discussions/posts for this, we can have a separate evaluation entity for clarity.

  - GET /reports/{runId} – Retrieve the summary report data for a specific simulation result.
    - _Backend:_ Aggregate the relevant data (policy info, region, pre/post metrics, selected options, user evaluation, etc.) and return as JSON for the frontend to render or convert to PDF.

    - _Contents:_ Should include policy/region identifiers, before/after CAI and concern scores, which options were applied, the user’s evaluation, etc..

- **General API considerations:**  
  All API calls that require authentication should expect an Authorization: Bearer \<token\> header with a valid JWT. If role-based permissions are needed (e.g., only Experts can create policies), use middleware to enforce RBAC. _(For the demo, we may skip complex permission checks, but the structure should allow easy addition later.)_

**API Response Example (Simulation result):**  
For instance, a GET request for a completed simulation result might return:

```json
{
  "status": "COMPLETED",
  "policyId": "windfarm_tx_travis",
  "region": { "state": "Texas", "county": "Travis" },
  "before": {
    "CAI": 0.6,
    "concerns": {
      "environment": 40,
      "economic": 70,
      "social": 55,
      "procedural": 65,
      "safety": 60
    }
  },
  "after": {
    "CAI": 0.78,
    "concerns": {
      "environment": 70,
      "economic": 80,
      "social": 50,
      "procedural": 65,
      "safety": 60
    }
  },
  "optionsApplied": [
    "Install noise barriers",
    "20% discount on residents' electricity bills",
    "Hold additional public hearing"
  ],
  "generatedAt": "2025-09-28T02:30:00Z"
}
```

_(Note: The exact API schema will be decided by the backend/frontend developers during implementation; the above is an illustrative example.)_

## 6. Development Roadmap

Rather than implementing everything at once, we will validate the core value first and then gradually expand. Below is a recommended phased development plan:

1. **Phase 1 – MVP Core (Core Quantitative Analysis Implementation):**  
   **Features:** Visualize pre- and post-policy CAI and concern changes for a single fixed region, with a basic stub simulation logic for the changes.  
   **UI:** Simplify by using one fixed region (no region selection step). Implement the flow of showing the radar chart of current metrics, a set of simulation option toggles, and then updating the chart with results. Qualitative opinions can be hard-coded examples displayed on the screen.  
   **Backend:** Implement a simple POST /simulations (even synchronous processing is fine for now) and a function to calculate new CAI and scores based on inputs.  
   **Goal:** Validate the core analysis logic (metric calculation & visualization) and get early feedback from the team or client on the concept.

2. **Phase 2 – Feature Expansion (Interaction & Data Integration):**  
   **Added Features:** Introduce region selection (interactive map \+ dropdown) and structure for supporting multiple regions. Link qualitative data with quantitative data (e.g., filtering opinions based on chart interactions).  
   **UI:** Integrate a map component (e.g., Mapbox). When the user selects a region, fetch that region’s data from the backend to populate the dashboard. Enable interactions between the radar chart and opinion cards (for example, clicking a radar chart axis could filter the opinion cards to that category).  
   **Backend:** Store baseline metrics for each region (perhaps a simple data structure or a DB table containing CAI and concerns for various counties). Implement an endpoint like /discussions?region=x to retrieve opinions for the selected region.  
   **Goal:** Enhance user exploration capabilities (the user can analyze different scenarios/regions) and solidify the data structures for both quantitative and qualitative data.

3. **Phase 3 – User Feedback & Reporting (Complete Demo Implementation):**  
   **Added Features:** Implement the final evaluation input step and the summary report generation with PDF export.  
   **UI:** Add the 👍/👎 evaluation component and the final report summary screen.  
   **Backend:** Create an API to save the evaluation (either POST /evaluations or repurpose discussions as noted) and an API to gather report data (GET /reports/{id}).  
   **Tech Integration:** Use tools like html2canvas or Puppeteer to support PDF creation of the report.  
   **Goal:** Complete the end-to-end user flow and provide an output (report) that stakeholders can save or share, thereby demonstrating the full value of the platform.

4. **Phase 4 – Advanced Enhancements (Post-MVP):**  
   **NLP Automation:** Integrate natural language processing to auto-tag qualitative opinions with categories and perform sentiment analysis. _(For example, use Azure Text Analytics or fine-tuned HuggingFace models to categorize comments and detect sentiment.)_  
   **Real-time Data Integration:** Set up pipelines to continuously gather external data, such as social media feeds or survey results, to update the metrics in real-time. _(e.g., periodically fetch Twitter data or new survey responses and update concern scores or add new opinions.)_  
   **Community Features:** Enhance the discussion features into a real forum: allow users to post and reply in real-time, upvote/downvote, etc., making it a lively community discussion board.  
   **Multi-scenario Comparison:** Enable saving multiple simulation runs and provide UI to compare different policy scenarios side by side.  
   **Deployment & Scaling:** Deploy the platform to cloud infrastructure (AWS, etc.) for staging/production, and conduct broader user testing.  
   _(After each phase, gather feedback from stakeholders and incorporate it into the next phase’s design. In particular, after completing the MVP (Phase 3), it’s important to demo the platform to actual potential users (policy makers, analysts, etc.) to collect UI/UX improvement suggestions and additional requirements.)_

## 7. Data Infrastructure & Governance

The demo platform may handle sensitive information influencing policy decisions, so a solid data management strategy is needed.

- **Data pipeline:** _(Simplified for MVP)_ Although for now we will manually use static example data, the design should consider future ETL pipelines. For instance, envision flows like: survey results in CSV \-\> transform into concern scores \-\> load into DB; or Twitter API \-\> sentiment analysis \-\> load into opinions database. While currently we prepare static sample data, the code structure should allow adding scheduled (cron) or event-driven data collection modules easily later.

- **Data dictionary & source management:** Document the definitions and calculation methods for CAI and each concern score. The development team should maintain a data dictionary that specifies what each metric means, its source (e.g., referencing the CARE research paper), and how often it’s updated. This documentation ensures transparency and user trust in the analysis. _(We might even expose these definitions via tooltips or in the report.)_

- **Privacy & ethics:** Ensure that resident opinion data does not include personal identifying information. Use anonymized references (e.g., say “Community member” instead of real names). In a real deployment, obtain consent when collecting opinions and filter out sensitive content. The development team should be cautious not to use any real personal data even in test datasets.

- **Database management:** Using PostgreSQL as a central DB means we need a backup/recovery strategy and migration plan. For example, maintain separate dev and prod databases, and use a migration tool (like Flyway or Prisma migrations) to manage schema changes (DDL) in a version-controlled way.

- **Performance & scaling:** Initially, data volumes are small so performance is fine. But as data grows, ensure queries that calculate metrics per concern are optimized (e.g., proper indexing, using aggregation pipelines efficiently). Consider caching frequently requested data (possibly using Redis) once external data integration is in place.

## 8. Non-functional Requirements

### 8.1 Security

- **Authentication & Authorization:** Implement JWT-based authentication and apply it to all API calls via middleware. For any critical modify/delete operations, enforce role-based access control (RBAC) – e.g., a Citizen role cannot create new policies. Define a Role-Permission matrix so it’s clear which roles can do what, and design it for easy extension as needed.

- **OWASP Top 10 compliance:** Protect against common web vulnerabilities such as SQL Injection, XSS, CSRF, authentication flaws, etc. Validate and sanitize all inputs on the backend. Use parameter binding in SQL/ORM to prevent injections. On the React frontend, XSS is largely mitigated by React’s escaping, but we must be careful when rendering user-generated content like comments (escape any HTML characters). Ensure proper CSRF protections on state-changing requests if needed (or use same-site cookies etc.).

- **Data encryption:** Securely manage secrets like JWT signing keys. Enforce HTTPS (SSL) for all client-server communication. Hash passwords using a strong algorithm (bcrypt). If any personally identifiable information (PII) is stored (e.g., resident IDs, though we plan not to), encrypt it in the database.

- **Rate limiting:** To prevent abuse (especially since any user can run simulations), implement rate limiting on APIs. For example, limit the /simulations endpoint to e.g. 5 requests per minute per IP/user. This avoids one user overwhelming the system with simulation jobs.

### 8.2 Accessibility & UX

- **Web Accessibility (WCAG 2.1 AA):** Ensure that visualizations like graphs and maps are accessible. Provide alternative text or descriptions for charts and map data. For example, include a hidden data table under a radar chart that lists the values for screen readers.

- **Keyboard navigation:** All interactive controls (dropdowns, sliders, buttons, map focus, etc.) should be operable via keyboard. Users should be able to tab through inputs and use arrow keys for sliders/menus, and press Enter to activate buttons.

- **Color and contrast:** Choose chart colors and UI elements with sufficient contrast to be distinguishable by color-blind users. Use not only color but also different shapes or patterns to convey differences. _(For example, up/down changes could also use arrow icons or line style differences in addition to color.)_

- **Multi-language support:** Even though the MVP UI will be in Korean (as an example scenario), design the software for internationalization (i18n) by separating text strings and using an i18n library. This will make it easier to add English or other languages later.

- **Responsive design:** Although the demo will primarily be presented on desktop, implement basic responsive design using CSS Flexbox/Grid so that the layout adapts to different screen sizes (down to tablet or mobile) if needed.

### 8.3 Performance & Testing

- **Performance:** Aim for API responses to complete within \~500ms whenever possible. Simulation runs are handled asynchronously, so the UI will show a progress indicator to manage user expectation. Plan for large data scenarios by implementing pagination or lazy loading (e.g., if there were 1000 opinion comments, initially load a subset and let the user click “Load more”).

- **Testing:**
  - _Unit Tests:_ Write unit tests (using Jest or similar) for core logic, such as the CAI calculation and the concern score adjustment logic, to ensure they work correctly.

  - _Integration Tests:_ Develop end-to-end tests for the APIs using a testing framework or CI pipeline – e.g., simulate a full scenario: run a simulation via API, then fetch the result, and verify the data flow.

  - _UI Tests:_ Use a tool like Cypress to automate testing of key user flows on the frontend (e.g., selecting a region \-\> running a simulation \-\> submitting evaluation \-\> viewing report).

  - Set a goal of achieving \~80% test coverage for core modules to ensure quality.

- **CI/CD:** Utilize GitHub Actions for continuous integration and deployment. For each pull request, run linters and the test suite automatically. Set up a pipeline on the main branch to build a Docker image of the application and deploy it to a staging environment (e.g., on AWS). Configure production deployment to require manual approval (to be triggered by the ops team).

## 9. Future Directions & Conclusion

The CARE demo platform aims to create a more inclusive policy environment by providing both data-driven objectivity and community narrative context in decision-making. While this MVP demonstrates the core concept with a wind farm case, we anticipate the following extensions:

- **Expansion to multiple policy domains:** Grow beyond the renewable energy example to other policy areas such as urban development, transportation, public welfare, etc., turning the platform into a general-purpose tool. We can introduce domain-specific concern metrics as needed (for instance, for transportation policies, add a “commute time change” indicator).

- **Advanced predictive analytics:** As we accumulate data on policies and outcomes, apply machine learning to forecast results for new policy proposals. For example, “Based on 5 similar past projects, the environmental concern score rose by \~20 points; therefore a similar policy now might expect a comparable increase.” This would allow proactive predictions before implementing policies.

- **Empirical data integration:** Integrate real-world data to validate and improve simulations. For example, incorporate government open data (environmental measurements, crime statistics, etc.) and actual survey results to compare predicted vs. actual outcomes. After a policy is implemented, feed back the real outcome data to refine the model (closing the loop on evidence-based policy evaluation).

- **Deeper community participation:** Evolve the platform into a full policy lifecycle tool where community involvement is even richer. Users could propose policy ideas, discuss and refine them on the platform, and vote to prioritize alternatives. In this vision, users are not just evaluators but co-creators of policy, making CARE a comprehensive participatory policy-making platform.

**Conclusion:** This development plan document has presented a blueprint encompassing all requirements to technically implement the envisioned system. By following the design laid out, the development team can build the MVP such that stakeholders can directly experience a policy decision-making process grounded in data and resident feedback. The team should use this document as a reference while implementing each module and component, expanding the system in stages. Ultimately, we hope the CARE platform becomes a flagship example of **evidence-based policy making** in action.
