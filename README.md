# 
# EcoLogic AI

An AI-powered sustainability coach that helps users understand, track, predict, and reduce their carbon footprint through automated auditing, predictive modeling, and personalized recommendations.

---

# Challenge Statement

Most carbon footprint applications require extensive manual data entry and provide generic recommendations that users often ignore.

The challenge was to design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

---

# Our Solution

EcoLogic AI transforms carbon tracking from a passive calculator into an intelligent sustainability coach.

Instead of requiring users to manually enter consumption data, EcoLogic AI uses AI-powered document auditing to automatically extract information from utility bills and receipts, validate the extracted data, calculate emissions, predict future impact, and generate personalized recommendations.

The platform combines explainable AI, predictive carbon modeling, sustainability forecasting, and financial ROI analysis to help users make informed environmental decisions.

---

# Key Features

## 1. Forensic Consumption Auditor

Upload:

- Electricity bills
- Utility bills
- Fuel receipts
- Consumption documents

Features:

- OCR-based extraction
- Validation engine
- Consistency checks
- Confidence scoring
- Explainable calculations
- Carbon impact estimation

Unlike traditional OCR systems, the auditor validates extracted values using mathematical verification before generating emissions calculations.

---

## 2. Gemini Carbon Copilot

An AI-powered sustainability assistant that:

- Explains emission sources
- Analyzes user behavior
- Generates personalized recommendations
- Answers sustainability questions
- Provides actionable next steps

Example:

- Why did my carbon score decrease?
- What is my largest emission source?
- How can I reduce emissions by 20%?

---

## 3. Carbon Twin Simulator

A predictive digital carbon model that allows users to simulate future scenarios.

Examples:

- Reduced vehicle usage
- Renewable energy adoption
- Energy-efficient appliances
- Sustainable lifestyle changes

Outputs:

- Predicted emissions
- Sustainability score changes
- Potential savings
- Long-term impact

---

## 4. Dynamic Eco Score

Provides a transparent sustainability score based on user behavior.

Features:

- Explainable scoring
- Historical trends
- Behavioral impact analysis
- Improvement suggestions

---

## 5. ROI Sustainability Consultant

Analyzes sustainability investments such as:

- Solar panels
- Heat pumps
- LED upgrades
- Energy-efficient appliances

Calculates:

- Estimated savings
- Carbon reduction
- Payback period
- Long-term ROI

---

## 6. Hyper-Local Impact Challenges

Generates personalized sustainability challenges using:

- User behavior
- Historical activity
- Environmental context

Examples:

- Reduce electricity usage by 5%
- Replace two weekly car trips with walking
- Lower evening energy consumption

---

# AI Workflow

Document Upload
↓
OCR Extraction
↓
Validation Engine
↓
Carbon Calculation
↓
AI Reasoning
↓
Personalized Recommendations

---

# Architecture

## Frontend

- Next.js
- TypeScript
- Tailwind CSS

## Backend

- Firebase Authentication
- Firestore
- Firebase Hosting
- Firebase Cloud Functions

## AI Layer

- Google Gemini
- Genkit

---

# Project Structure

```text
src/
├── ai/
│   └── flows/
├── app/
├── components/
├── hooks/
├── lib/
├── firebase/
├── types/
└── services/
```

The application follows a modular architecture to improve maintainability, scalability, and code quality.

---

# Why EcoLogic AI Is Different

Most carbon tracking applications only calculate emissions.

EcoLogic AI goes further by:

- Automatically auditing real-world documents
- Validating extracted information
- Explaining emissions through AI reasoning
- Predicting future environmental impact
- Simulating sustainability decisions
- Providing financial ROI analysis

The result is an intelligent sustainability coach rather than a simple carbon calculator.

---

# Security Considerations

The application follows secure development practices:

- Firebase Authentication
- Environment variable protection
- Input validation
- Secure Firestore access patterns
- Principle of least privilege

--

## Assumptions

- Emission factors are estimated using publicly available reference values.
- OCR accuracy depends on document quality.
- Carbon forecasts are predictive estimates and not exact measurements.
- Users may use Demo Mode without authentication.

  
# Accessibility

EcoLogic AI is designed with accessibility in mind:

- Responsive design
- Keyboard-friendly navigation
- High contrast interface
- Mobile-friendly layouts
- Readable typography

---

# Installation

```bash
npm install
npm run dev
```

---

# Deployment

The application is deployed using Firebase Hosting.

---

# Future Enhancements

- Expanded receipt support
- More accurate regional emission factors
- Advanced sustainability forecasting
- Community sustainability benchmarking
- Smart device integrations

---

# Author

Sehel Biju

Built for the Hack2Skill × Google Prompt Wars Challenge.
