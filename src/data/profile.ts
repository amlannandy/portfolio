import type { Profile } from '@portfolio/types/profile';

import { BLOGS } from './blogs';

export const PROFILE: Profile = {
  name: 'Amlan Kumar Nandy',
  initials: 'AKN',
  avatarUrl: '/images/profile/portrait.webp',
  bio: 'Full Stack AI Engineer with 4+ years of experience. Currently working at Postman. Always curious about learning new things and tackling weird problems.',
  about: [
    [
      "Welcome to my space! I'm a Full Stack Engineer with 4+ years of experience, having worked at B2B SaaS companies throughout my career. My tech stack revolves mostly around JavaScript, with a little bit of Go. Please scroll down or just check out my resume for more details!",
    ],
    [
      'Outside of work, I love to read, play video games and try all kinds of food. But most of all, I love to travel (feel free to check out my ',
      { text: 'travel blogs', href: BLOGS.travel.path },
      "!). I'm always open for a conversation, so please feel free to message me on LinkedIn or drop me an email anytime.",
    ],
  ],
  email: 'amlannandy5@gmail.com',
  resumeUrl: 'https://drive.google.com/file/d/1-sZC1XRmCwJL5ibkLjgSiZZVuBNFOsYS/view?usp=sharing',
};
