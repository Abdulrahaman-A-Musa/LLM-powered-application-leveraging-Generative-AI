
# GIS-ConceptGenius

**Automating the GIS Project Lifecycle with Generative AI.**

## 📖 Overview

**GIS-ConceptGenius** is an LLM-powered application designed to automate and elevate the critical administrative phase of the GIS project lifecycle. By intelligently transforming raw technical notes into structured professional documents, it addresses the common bottleneck where highly skilled GIS data analysts spend disproportionate time on drafting rather than execution.

## ✨ Key Features

- **Automated Document Generation**: Instantly creates professional **Concept Notes**, **Project Proposals**, and **Innovation Strategies** from raw summaries.
- **AI-Powered**: Leverages **Google Gemini 2.5 Flash** for high-speed, context-aware content generation.
- **Flexible Input**: Support for direct text input, file uploads (`.txt`, `.md`), and **Google Drive** integration.
- **Seamless Integration**: Connects with Google Drive to directly import source material and save generated outputs.
- **Modern UI**: A responsive, dark-mode enabled interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini API (`gemini-2.5-flash`)
- **Integration**: Google Drive API (v3), Google Identity Services

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Project with the **Gemini API** and **Google Drive API** enabled.
- An API Key for Gemini.
- An OAuth Client ID for Google Drive access.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gis-concept-genius.git
    cd gis-concept-genius
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your keys:
    ```env
    API_KEY=your_google_gemini_api_key
    GOOGLE_CLIENT_ID=your_google_cloud_client_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 📝 Usage

1.  **Import Source Material**: Type your notes, upload a text file, or select a folder link from Google Drive.
2.  **Select Action**: Choose to generate a Concept Note, Proposal, or brainstorm Innovations.
3.  **Review & Export**: View the AI-generated markdown, download as a file, or save directly back to Google Drive.

## 📄 License

This project is licensed under the MIT License.
