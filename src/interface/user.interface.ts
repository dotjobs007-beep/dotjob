
export interface IUpdateUser {
    about?: string
    phoneNumber: string;
    skills?: string[]
    avatar?: string;
    name?: string;
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

