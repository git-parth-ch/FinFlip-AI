// Persona Types
export interface Persona {
  id: string;
  name: string;
  avatar: string;
  type: 'student' | 'professional';
  monthlyIncome: number;
  description: string;
}

export const personas: Persona[] = [
  {
    id: 'priya',
    name: 'Priya',
    avatar: '👩🏽‍🎓',
    type: 'student',
    monthlyIncome: 3000,
    description: 'College student, part-time tutor'
  },
  {
    id: 'arjun',
    name: 'Arjun',
    avatar: '👨🏽‍💼',
    type: 'professional',
    monthlyIncome: 22000,
    description: 'Junior Software Developer'
  }
];

// Transaction Categories
export type CategoryType = 
  | 'food' 
  | 'transport' 
  | 'shopping' 
  | 'entertainment' 
  | 'education' 
  | 'family' 
  | 'health' 
  | 'utilities' 
  | 'subscriptions' 
  | 'personal' 
  | 'savings' 
  | 'other';

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍕', color: 'category-food' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'category-transport' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'category-shopping' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'category-entertainment' },
  { id: 'education', name: 'Education', icon: '📚', color: 'category-education' },
  { id: 'family', name: 'Family Support', icon: '👨‍👩‍👧', color: 'category-family' },
  { id: 'health', name: 'Health', icon: '💊', color: 'category-health' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: 'category-utilities' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: 'category-subscriptions' },
  { id: 'personal', name: 'Personal Care', icon: '💅', color: 'category-personal' },
  { id: 'savings', name: 'Savings', icon: '🏦', color: 'category-savings' },
  { id: 'other', name: 'Other', icon: '📦', color: 'category-other' },
];

// Transaction Interface
export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: CategoryType;
  merchant: string;
}

// Generate 30 days of mock transactions
const generateTransactions = (personaId: string): Transaction[] => {
  const isStudent = personaId === 'priya';
  const baseMultiplier = isStudent ? 1 : 7;
  
  const merchants = {
    food: ['Swiggy', 'Zomato', 'McDonald\'s', 'Domino\'s', 'Campus Canteen', 'Chai Point'],
    transport: ['Uber', 'Ola', 'Rapido', 'Metro Card', 'Bus Pass'],
    shopping: ['Amazon', 'Flipkart', 'Myntra', 'Nykaa', 'Local Market'],
    entertainment: ['Netflix', 'Spotify', 'PVR Cinemas', 'BookMyShow', 'Gaming'],
    education: ['Coursera', 'Unacademy', 'Books', 'Stationery'],
    family: ['Family Transfer', 'Gift', 'Family Expense'],
    health: ['Apollo Pharmacy', 'Gym', 'Doctor Visit'],
    utilities: ['Jio Recharge', 'Airtel', 'Electricity'],
    subscriptions: ['YouTube Premium', 'Amazon Prime', 'Hotstar'],
    personal: ['Salon', 'Grooming', 'Personal Items'],
  };

  const transactions: Transaction[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add 1-2 transactions per day (reduced to stay within budget)
    const numTransactions = Math.floor(Math.random() * 2) + 1;
    
    for (let j = 0; j < numTransactions; j++) {
      const categoryKeys = Object.keys(merchants) as CategoryType[];
      const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
      const merchantList = merchants[category] || ['Unknown'];
      const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
      
      let baseAmount: number;
      switch (category) {
        case 'food':
          baseAmount = Math.floor(Math.random() * 150) + 30;
          break;
        case 'transport':
          baseAmount = Math.floor(Math.random() * 80) + 20;
          break;
        case 'shopping':
          baseAmount = Math.floor(Math.random() * 200) + 50;
          break;
        case 'entertainment':
          baseAmount = Math.floor(Math.random() * 300) + 50;
          break;
        case 'education':
          baseAmount = Math.floor(Math.random() * 400) + 50;
          break;
        case 'family':
          baseAmount = Math.floor(Math.random() * 1000) + 200;
          break;
        case 'health':
          baseAmount = Math.floor(Math.random() * 500) + 100;
          break;
        case 'utilities':
          baseAmount = Math.floor(Math.random() * 300) + 100;
          break;
        case 'subscriptions':
          baseAmount = Math.floor(Math.random() * 200) + 99;
          break;
        case 'personal':
          baseAmount = Math.floor(Math.random() * 300) + 50;
          break;
        default:
          baseAmount = Math.floor(Math.random() * 200) + 50;
      }

      transactions.push({
        id: `txn-${i}-${j}-${Date.now()}`,
        date,
        description: `${merchant} purchase`,
        amount: Math.floor(baseAmount * (isStudent ? 0.5 : 1)),
        category,
        merchant,
      });
    }
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const priyaTransactions = generateTransactions('priya');
export const arjunTransactions = generateTransactions('arjun');

// Budget Templates
export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  needs: number;
  wants: number;
  savings: number;
}

export const budgetTemplates: BudgetTemplate[] = [
  {
    id: 'student',
    name: 'Student-Optimized',
    description: 'Higher savings for education goals',
    needs: 60,
    wants: 25,
    savings: 15,
  },
  {
    id: 'standard',
    name: 'Standard 50/30/20',
    description: 'Balanced approach for most people',
    needs: 50,
    wants: 30,
    savings: 20,
  },
];

// Learning Modules
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  lessons: Lesson[];
  badge: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  xp: number;
}

export const learningModules: LearningModule[] = [
  {
    id: 'money-mindset',
    title: 'Money Mindset',
    description: 'Transform how you think about money',
    icon: '🧠',
    xpReward: 500,
    badge: '💎',
    lessons: [
      { id: 'mm-1', title: 'Money is a Tool', content: 'Learn how to view money as a tool for achieving your goals, not an end goal.', completed: true, xp: 100 },
      { id: 'mm-2', title: 'Your Money Story', content: 'Understand the beliefs about money you grew up with and how they affect you today.', completed: true, xp: 100 },
      { id: 'mm-3', title: 'Abundance vs Scarcity', content: 'Shift from a scarcity mindset to an abundance mindset.', completed: false, xp: 150 },
      { id: 'mm-4', title: 'Financial Goals', content: 'Set SMART financial goals that motivate and inspire you.', completed: false, xp: 150 },
    ],
  },
  {
    id: 'budgeting-basics',
    title: 'Budgeting Basics',
    description: 'Master the art of budgeting',
    icon: '📊',
    xpReward: 750,
    badge: '🏆',
    lessons: [
      { id: 'bb-1', title: 'What is a Budget?', content: 'A budget is a spending plan based on income and expenses.', completed: true, xp: 100 },
      { id: 'bb-2', title: 'Track Your Expenses', content: 'Learn different methods to track where your money goes.', completed: false, xp: 150 },
      { id: 'bb-3', title: 'The 50/30/20 Rule', content: 'Understand the popular budgeting framework and customize it.', completed: false, xp: 200 },
      { id: 'bb-4', title: 'Budget Adjustments', content: 'Learn when and how to adjust your budget as life changes.', completed: false, xp: 150 },
      { id: 'bb-5', title: 'Budget Challenge', content: 'Complete a 7-day budget tracking challenge.', completed: false, xp: 150 },
    ],
  },
  {
    id: 'saving-fundamentals',
    title: 'Saving Fundamentals',
    description: 'Build your savings muscle',
    icon: '🐷',
    xpReward: 600,
    badge: '⭐',
    lessons: [
      { id: 'sf-1', title: 'Why Save?', content: 'Understand the importance of saving for your future self.', completed: false, xp: 100 },
      { id: 'sf-2', title: 'Emergency Fund', content: 'Build your first line of financial defense.', completed: false, xp: 150 },
      { id: 'sf-3', title: 'Saving Strategies', content: 'Discover proven strategies like "pay yourself first".', completed: false, xp: 150 },
      { id: 'sf-4', title: 'Automate Savings', content: 'Set up systems that make saving effortless.', completed: false, xp: 200 },
    ],
  },
];

// Peer Benchmark Data
export interface PeerBenchmark {
  category: string;
  userSpending: number;
  peerAverage: number;
}

export const getPeerBenchmarks = (personaId: string): PeerBenchmark[] => {
  const isStudent = personaId === 'priya';
  
  return [
    { category: 'Food', userSpending: isStudent ? 1200 : 4500, peerAverage: isStudent ? 800 : 3500 },
    { category: 'Transport', userSpending: isStudent ? 300 : 2000, peerAverage: isStudent ? 400 : 1800 },
    { category: 'Shopping', userSpending: isStudent ? 500 : 3000, peerAverage: isStudent ? 400 : 2500 },
    { category: 'Entertainment', userSpending: isStudent ? 400 : 1500, peerAverage: isStudent ? 300 : 1200 },
    { category: 'Subscriptions', userSpending: isStudent ? 200 : 800, peerAverage: isStudent ? 150 : 600 },
  ];
};

// AI Chat Messages
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const getInitialMessages = (persona: Persona): ChatMessage[] => {
  const isStudent = persona.type === 'student';
  
  return [
    {
      id: '1',
      role: 'assistant',
      content: `Hey ${persona.name}! 👋 Main hoon aapka FinEd buddy. I've been analyzing your spending patterns, and I noticed something interesting...`,
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'assistant',
      content: isStudent 
        ? `You've spent ₹4,500 on food delivery this month (40% of your income!) 😅 Most students your age spend around 20%. Kya aapko ek laptop ke liye ₹2,000 ka savings goal set karna hai?`
        : `Arjun, your Swiggy + Zomato spending is ₹6,200 this month - that's 28% of income! 🍕 Your peers typically spend 15-18% on food. Want me to help you create a meal prep budget?`,
      timestamp: new Date(),
    },
  ];
};

// User Stats
export interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  badges: string[];
  completedModules: number;
  totalModules: number;
}

export const getUserStats = (personaId: string): UserStats => ({
  totalXP: personaId === 'priya' ? 450 : 1250,
  level: personaId === 'priya' ? 3 : 7,
  streak: personaId === 'priya' ? 5 : 12,
  badges: personaId === 'priya' ? ['🌟', '📚'] : ['🌟', '📚', '💎', '🏆', '⭐'],
  completedModules: personaId === 'priya' ? 1 : 2,
  totalModules: 3,
});
