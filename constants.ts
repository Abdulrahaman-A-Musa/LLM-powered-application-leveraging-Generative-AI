import { Action } from './types';
import { ConceptNoteIcon } from './components/icons/ConceptNoteIcon';
import { ProposalIcon } from './components/icons/ProposalIcon';
import { InnovationIcon } from './components/icons/InnovationIcon';

export enum ActionId {
  CONCEPT_NOTE = 'concept_note',
  PROPOSAL = 'proposal',
  INNOVATION = 'innovation',
}

export const ACTIONS: Action[] = [
  {
    id: ActionId.CONCEPT_NOTE,
    name: 'Generate Concept Note',
    description: 'Structure the source material into a formal concept note.',
    Icon: ConceptNoteIcon,
    promptBuilder: (context: string) => `Act as a professional grant writer and GIS project manager. The user has provided source material. Your task is to expand this into a comprehensive and professional concept note, inferring details where necessary to create a complete document. The concept note must be well-structured and written in a formal tone.
    
    Source Material:
    ---
    ${context}
    ---
    
    Generate a complete concept note with the following sections in markdown format:
    1.  **Project Title:** (Create a suitable, professional title based on the source material)
    2.  **Introduction & Problem Statement:** (Detail the problem, its context, and significance)
    3.  **Proposed Solution:** (Describe the technical and operational aspects of the proposed solution)
    4.  **Project Goals and Objectives:** (List clear, measurable goals: 1-2 main goals, 3-5 specific objectives)
    5.  **Target Stakeholders:** (Identify who will benefit from or be involved in the project)
    6.  **High-Level Implementation Plan:** (Outline the main phases and a brief timeline)
    7.  **Conclusion & Next Steps:** (Summarize the value proposition and suggest the next actions)`,
  },
  {
    id: ActionId.PROPOSAL,
    name: 'Draft Proposal',
    description: 'Develop a persuasive project proposal from the document.',
    Icon: ProposalIcon,
    promptBuilder: (context: string) => `Act as a senior business development manager specializing in GIS solutions. You have been given raw notes or a concept document. Your task is to transform this information into a persuasive and detailed project proposal suitable for a potential client or funding body.
    
    Source Document:
    ---
    ${context}
    ---
    
    Generate a complete project proposal using markdown. The proposal should include these sections:
    1.  **Executive Summary:** (A concise, powerful overview of the entire proposal)
    2.  **Understanding the Challenge:** (Demonstrate a deep understanding of the client's problem, based on the source document)
    3.  **Our Proposed Solution:** (Detail your technical approach, methodologies, and the key deliverables)
    4.  **Project Timeline & Milestones:** (Provide a clear, phased timeline in a markdown table)
    5.  **Budget Overview:** (Present a high-level budget breakdown with major cost categories)
    6.  **About Us / Our Expertise:** (Write a brief, confident paragraph about why the team is qualified for this project)
    7.  **Call to Action / Next Steps:** (Clearly state what should happen next to move the project forward)`,
  },
    {
    id: ActionId.INNOVATION,
    name: 'Brainstorm Innovations',
    description: 'Generate novel ideas and improvements based on the text.',
    Icon: InnovationIcon,
    promptBuilder: (context: string) => `Act as a world-class GIS innovation consultant and futurist. You have been provided with a document containing a project idea, market analysis, or technical report. Your task is to brainstorm 3-5 creative and actionable "next-level" innovations based on this document. These should be novel ideas that build upon, extend, or pivot from the source material.
    
    Source Material:
    ---
    ${context}
    ---
    
    For each innovation, provide the following in clean markdown format:
    - **Idea Title:** (A catchy, descriptive name)
    - **Core Concept:** (A 2-3 sentence summary of the innovative idea)
    - **Key Technologies:** (List the new or advanced geospatial technologies that would be required)
    - **Potential Impact:** (Describe the potential business or social value this innovation could unlock)`,
  },
];
