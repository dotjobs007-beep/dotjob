
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

