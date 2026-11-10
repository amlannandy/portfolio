import type { ExperienceGroup } from '@portfolio/types/experience';

export const EXPERIENCE: ExperienceGroup[] = [
  {
    kind: 'work',
    heading: 'Work Experience',
    roles: [
      { title: 'Software Engineer', organization: 'Postman', start: '2026-06' },
      {
        title: 'Senior Software Engineer',
        organization: 'SigNoz',
        start: '2024-11',
        end: '2026-04',
      },
      {
        title: 'Member of Technical Staff II',
        organization: 'Clumio',
        start: '2022-12',
        end: '2024-10',
      },
      {
        title: 'Member of Technical Staff I',
        organization: 'Clumio',
        start: '2022-01',
        end: '2022-12',
      },
    ],
  },
  {
    kind: 'openSource',
    heading: 'Open Source Contributions',
    roles: [
      {
        title: 'Mentor',
        organization: 'Google Summer of Code · SCoRe Lab',
        start: '2022-03',
        end: '2022-09',
      },
      {
        title: 'Student Developer',
        organization: 'Google Summer of Code · SCoRe Lab',
        start: '2021-05',
        end: '2021-08',
      },
    ],
  },
  {
    kind: 'internship',
    heading: 'Internships',
    roles: [
      {
        title: 'Software Development Engineer Intern',
        organization: 'Trell',
        start: '2021-09',
        end: '2021-12',
      },
      {
        title: 'Software Engineer Intern',
        organization: 'Tata Consultancy Services',
        start: '2021-05',
        end: '2021-07',
      },
      {
        title: 'Software Engineer Intern',
        organization: 'Pointo',
        start: '2020-06',
        end: '2020-11',
      },
      {
        title: 'Software Engineer Intern',
        organization: 'HappyMinds',
        start: '2020-04',
        end: '2020-06',
      },
      {
        title: 'Software Engineer Intern',
        organization: 'Rodo India',
        start: '2020-02',
        end: '2020-04',
      },
    ],
  },
];
