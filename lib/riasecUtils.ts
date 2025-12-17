// RIASEC (Holland Code) Mapping Utilities

export interface RIASECCode {
  code: string;
  fullName: string;
  description: string;
  traits: string[];
}

export const RIASEC_MAPPING: Record<string, RIASECCode> = {
  'interest_r': {
    code: 'R',
    fullName: 'Realistic',
    description: 'Practical, hands-on work with tools, machines, or physical materials',
    traits: ['Practical', 'Hands-on', 'Problem-solver', 'Outdoors', 'Athletic']
  },
  'interest_i': {
    code: 'I',
    fullName: 'Investigative',
    description: 'Research, analysis, and intellectual problem-solving',
    traits: ['Analytical', 'Curious', 'Scientific', 'Intellectual', 'Logical']
  },
  'interest_a': {
    code: 'A',
    fullName: 'Artistic',
    description: 'Creative expression, imagination, and innovation',
    traits: ['Creative', 'Expressive', 'Imaginative', 'Original', 'Independent']
  },
  'interest_s': {
    code: 'S',
    fullName: 'Social',
    description: 'Helping, teaching, and working with people',
    traits: ['Helpful', 'Empathetic', 'Teaching', 'Collaborative', 'Understanding']
  },
  'interest_e': {
    code: 'E',
    fullName: 'Enterprising',
    description: 'Leadership, persuasion, and business ventures',
    traits: ['Ambitious', 'Persuasive', 'Leader', 'Energetic', 'Competitive']
  },
  'interest_c': {
    code: 'C',
    fullName: 'Conventional',
    description: 'Organization, data management, and structured tasks',
    traits: ['Organized', 'Detail-oriented', 'Systematic', 'Efficient', 'Careful']
  }
};

/**
 * Get the full name for a RIASEC code
 * @param code - The interest code (e.g., 'interest_i', 'interest_e')
 * @returns The full RIASEC name (e.g., 'Investigative', 'Enterprising')
 */
export function getRIASECFullName(code: string): string {
  const mapping = RIASEC_MAPPING[code.toLowerCase()];
  return mapping?.fullName || code;
}

/**
 * Get RIASEC information for a code
 * @param code - The interest code (e.g., 'interest_i')
 * @returns Full RIASEC information object
 */
export function getRIASECInfo(code: string): RIASECCode | null {
  return RIASEC_MAPPING[code.toLowerCase()] || null;
}

/**
 * Format RIASEC codes in a description
 * Replaces interest_x codes with their full names
 * @param text - Text containing RIASEC codes
 * @returns Text with full RIASEC names
 */
export function formatRIASECDescription(text: string): string {
  let formattedText = text;
  
  Object.entries(RIASEC_MAPPING).forEach(([code, info]) => {
    const regex = new RegExp(code, 'gi');
    formattedText = formattedText.replace(regex, info.fullName);
  });
  
  return formattedText;
}

/**
 * Get all RIASEC codes from a list
 * @param codes - Array of codes that might include RIASEC codes
 * @returns Array of RIASEC full names
 */
export function extractRIASECNames(codes: string[]): string[] {
  return codes
    .map(code => getRIASECFullName(code))
    .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates
}
