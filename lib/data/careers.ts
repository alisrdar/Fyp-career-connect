import { Career } from '@/types/career';

export const careers: Record<string, Career> = {
  'ux-designer': {
    id: 'ux-designer',
    title: 'UX Designer',
    matchScore: 98,
    tagline: 'Shape digital experiences that solve real problems',
    description: 'UX Designers create intuitive, user-centered digital products by researching user needs, designing interfaces, and testing solutions. You will blend creativity with psychology to make technology accessible and delightful.',
    imageSrc: '/images/ux-designer.jpg',
    salary: {
      min: '75,000',
      max: '120,000',
      currency: 'USD'
    },
    outlook: 'Growing +15% by 2030',
    education: 'Bachelor Degree or UX Bootcamp',
    workStyle: 'Remote/Hybrid',
    whyItFits: [
      {
        trait: 'Openness',
        explanation: 'Your high Openness score means you thrive in creative iteration and exploring new design patterns—exactly what UX demands daily.'
      },
      {
        trait: 'Conscientiousness',
        explanation: 'Your attention to detail ensures pixel-perfect designs and thorough user research.'
      },
      {
        trait: 'Agreeableness',
        explanation: 'Your empathy helps you understand user pain points and collaborate with cross-functional teams.'
      }
    ],
    roadmap: [
      {
        phase: 1,
        title: 'Fundamentals & Tools',
        duration: '2-3 months',
        skills: ['Design Thinking', 'Figma/Adobe XD', 'User Research Methods', 'Wireframing', 'Prototyping'],
        resources: [
          { name: 'Google UX Design Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design', type: 'course' },
          { name: 'Figma for Beginners', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', type: 'video' },
          { name: 'The Design of Everyday Things', url: 'https://www.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654', type: 'book' }
        ]
      },
      {
        phase: 2,
        title: 'Build Your Portfolio',
        duration: '3-4 months',
        skills: ['Case Studies', 'Design Systems', 'Accessibility', 'User Testing', 'Portfolio Website'],
        resources: [
          { name: 'Daily UI Challenge', url: 'https://www.dailyui.co/', type: 'course' },
          { name: 'Dribbble for inspiration', url: 'https://dribbble.com', type: 'article' }
        ]
      },
      {
        phase: 3,
        title: 'Job Hunt',
        duration: '1-2 months',
        skills: ['Interview Prep', 'Networking', 'Portfolio Presentation', 'Salary Negotiation'],
        resources: [
          { name: 'UX Interview Handbook', url: 'https://uxdesign.cc/', type: 'article' }
        ]
      }
    ],
    tools: [
      { name: 'Figma', category: 'design' },
      { name: 'Adobe XD', category: 'design' },
      { name: 'Sketch', category: 'design' },
      { name: 'Miro', category: 'collaboration' },
      { name: 'InVision', category: 'collaboration' }
    ],
    dayInLife: [
      'Review user feedback and analytics from recent feature launch',
      'Conduct user interviews to understand pain points',
      'Sketch wireframes for new feature concepts',
      'Create high-fidelity mockups in Figma',
      'Present designs to product team and iterate based on feedback',
      'Collaborate with developers on implementation details'
    ],
    externalLinks: {
      careerGuide: 'https://www.interaction-design.org/literature/topics/ux-design',
      salaryData: 'https://www.glassdoor.com/Salaries/ux-designer-salary-SRCH_KO0,11.htm',
      jobBoard: 'https://www.indeed.com/q-UX-Designer-jobs.html'
    }
  },
  'data-scientist': {
    id: 'data-scientist',
    title: 'Data Scientist',
    matchScore: 95,
    tagline: 'Turn data into insights and business value',
    description: 'Data Scientists analyze complex datasets using statistical models and machine learning to uncover patterns, predict trends, and solve business problems. You will work at the intersection of mathematics, programming, and domain expertise.',
    imageSrc: '/images/data-scientist.jpg',
    salary: {
      min: '90,000',
      max: '150,000',
      currency: 'USD'
    },
    outlook: 'Very High Growth +36% by 2031',
    education: 'Bachelor in CS/Stats/Math or Bootcamp',
    workStyle: 'Remote/Hybrid',
    whyItFits: [
      {
        trait: 'Conscientiousness',
        explanation: 'Your methodical approach and attention to detail are crucial for data cleaning and validation.'
      },
      {
        trait: 'Openness',
        explanation: 'Your curiosity drives you to explore data patterns and learn new ML techniques continuously.'
      }
    ],
    roadmap: [
      {
        phase: 1,
        title: 'Programming & Stats',
        duration: '3-4 months',
        skills: ['Python', 'Statistics', 'SQL', 'Pandas', 'NumPy'],
        resources: [
          { name: 'Python for Data Science', url: 'https://www.datacamp.com/', type: 'course' }
        ]
      },
      {
        phase: 2,
        title: 'Machine Learning',
        duration: '4-5 months',
        skills: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering'],
        resources: [
          { name: 'Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning', type: 'course' }
        ]
      },
      {
        phase: 3,
        title: 'Deploy & Interview',
        duration: '2-3 months',
        skills: ['Cloud Deployment', 'Interview Prep', 'Portfolio Projects'],
        resources: [
          { name: 'Kaggle Competitions', url: 'https://www.kaggle.com/', type: 'course' }
        ]
      }
    ],
    tools: [
      { name: 'Python', category: 'development' },
      { name: 'Jupyter Notebook', category: 'development' },
      { name: 'TensorFlow', category: 'development' },
      { name: 'Tableau', category: 'analytics' },
      { name: 'SQL', category: 'analytics' }
    ],
    dayInLife: [
      'Morning standup with product and engineering teams',
      'Clean and explore new dataset from marketing team',
      'Build predictive model for customer churn',
      'Create visualizations to present findings to stakeholders',
      'Collaborate with engineers on model deployment',
      'Review peer code and provide feedback'
    ],
    externalLinks: {
      careerGuide: 'https://www.coursera.org/articles/what-is-a-data-scientist',
      salaryData: 'https://www.glassdoor.com/Salaries/data-scientist-salary-SRCH_KO0,14.htm',
      jobBoard: 'https://www.indeed.com/q-Data-Scientist-jobs.html'
    }
  },
  'software-engineer': {
    id: 'software-engineer',
    title: 'Software Engineer',
    matchScore: 92,
    tagline: 'Build applications that power the digital world',
    description: 'Software Engineers design, develop, and maintain software applications. You will write code, solve technical challenges, and work in teams to build products used by millions.',
    imageSrc: '/images/software-engineer.jpg',
    salary: {
      min: '80,000',
      max: '140,000',
      currency: 'USD'
    },
    outlook: 'High Growth +25% by 2032',
    education: 'CS Degree, Bootcamp, or Self-taught',
    workStyle: 'Remote/Hybrid/Office',
    whyItFits: [
      {
        trait: 'Conscientiousness',
        explanation: 'Your focus and attention to detail help you write clean, bug-free code.'
      },
      {
        trait: 'Openness',
        explanation: 'Your learning mindset keeps you updated with new technologies and frameworks.'
      }
    ],
    roadmap: [
      {
        phase: 1,
        title: 'Programming Foundations',
        duration: '3-4 months',
        skills: ['JavaScript/Python', 'Data Structures', 'Algorithms', 'Git'],
        resources: [
          { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', type: 'course' }
        ]
      },
      {
        phase: 2,
        title: 'Full-Stack Development',
        duration: '4-6 months',
        skills: ['React', 'Node.js', 'Databases', 'APIs'],
        resources: [
          { name: 'Full Stack Open', url: 'https://fullstackopen.com', type: 'course' }
        ]
      },
      {
        phase: 3,
        title: 'Job Ready',
        duration: '2-3 months',
        skills: ['Portfolio', 'System Design', 'Interview Prep'],
        resources: [
          { name: 'LeetCode', url: 'https://leetcode.com', type: 'course' }
        ]
      }
    ],
    tools: [
      { name: 'VS Code', category: 'development' },
      { name: 'Git/GitHub', category: 'collaboration' },
      { name: 'React', category: 'development' },
      { name: 'Node.js', category: 'development' },
      { name: 'Docker', category: 'development' }
    ],
    dayInLife: [
      'Stand-up meeting with team',
      'Code review for teammate pull request',
      'Fix bugs reported by QA team',
      'Implement new feature using React',
      'Write unit tests for new code',
      'Deploy code to staging environment'
    ],
    externalLinks: {
      careerGuide: 'https://www.freecodecamp.org/news/what-is-software-engineering/',
      salaryData: 'https://www.glassdoor.com/Salaries/software-engineer-salary-SRCH_KO0,17.htm',
      jobBoard: 'https://www.indeed.com/q-Software-Engineer-jobs.html'
    }
  }
};

export function getAllCareers(): Career[] {
  return Object.values(careers);
}

export function getCareerById(id: string): Career | undefined {
  return careers[id];
}
