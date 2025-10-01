
export interface IUpdateUser {
    about?: string
    phoneNumber: string;
    skills?: string[]
    avatar?: string;
    name?: string;
    linkedInProfile?: string;
    xProfile?: string;
    githubProfile?: string;
    jobSeeker?: boolean;
    location?: string;
    gender?: string;
    ethnicity?: string;
    primaryLanguage?: string;
}


export interface IdentityJudgement {
  index: number;
  judgement: string;
}

export interface IdentityInfo {
  display: string | null;
  identity: boolean;
  judgements: IdentityJudgement[];
}

export  interface searchParams {
  name?: string;
  email?: string;
  address?: string;
  jobSeeker?: boolean;
  skills?: string[];
  location?: string;
  primaryLanguage?: string;
  experienceLevel?: string;
  xProfile?: string;
  githubProfile?: string;
  linkedInProfile?: string;
  gender?: string;
  ethnicity?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;  
}

