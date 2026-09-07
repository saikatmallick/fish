export interface Suite {
  id: string;
  name: string;
  depth: number;
  tagName: string;
  description: string;
  additionalDetails: string;
  image: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  ambientColor: string;
  temperature: string;
}

export interface DescentStep {
  id: number;
  title: string;
  description: string;
  fromDepth: number;
  toDepth: number;
  pressureRange: string;
  durationString: string;
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  preferredZone: string;
  specialRequests: string;
  receiveUpdates: boolean;
  lengthOfStay: string;
}
