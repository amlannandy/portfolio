export type ExperienceKind = 'work' | 'internship' | 'openSource';

export interface Role {
  title: string;
  organization: string;
  /** Month the role started, as `YYYY-MM`. */
  start: string;
  /** Month the role ended, as `YYYY-MM`. Leave out for a current role. */
  end?: string;
}

export interface ExperienceGroup {
  kind: ExperienceKind;
  heading: string;
  /** Newest first. */
  roles: Role[];
}
