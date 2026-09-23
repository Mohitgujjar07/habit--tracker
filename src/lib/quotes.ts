export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: "comeback" | "momentum" | "discipline" | "focus" | "identity" | "small-steps";
  actionAdvice: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: "q-1",
    text: "Small steps every single day create massive changes over time. Your comeback starts this morning.",
    author: "comeback.mjg",
    category: "small-steps",
    actionAdvice: "Pick your single highest-leverage task and work on it for just 25 minutes.",
  },
  {
    id: "q-2",
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    category: "discipline",
    actionAdvice: "Do not wait for motivation. Execute the morning routine you committed to.",
  },
  {
    id: "q-3",
    text: "The secret of getting ahead is getting started. Break the complex into small, manageable tasks.",
    author: "Mark Twain",
    category: "momentum",
    actionAdvice: "If a task feels too big, shrink it to a 2-minute micro action.",
  },
  {
    id: "q-4",
    text: "Every morning you have two choices: continue to sleep with your dreams, or wake up and chase them.",
    author: "Carmelo Anthony",
    category: "comeback",
    actionAdvice: "Drink a glass of water, step away from screens, and clarify today's priority.",
  },
  {
    id: "q-5",
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: "discipline",
    actionAdvice: "Protect your first 90 minutes from low-value distractions.",
  },
  {
    id: "q-6",
    text: "Action breeds confidence and courage. To conquer fear, do not sit home and think. Go out and get busy.",
    author: "Dale Carnegie",
    category: "momentum",
    actionAdvice: "Momentum comes from motion, not contemplation.",
  },
  {
    id: "q-7",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant",
    category: "identity",
    actionAdvice: "Cast a vote for the person you want to become with one focused block.",
  },
  {
    id: "q-8",
    text: "The difference between who you are and who you want to be is what you do today.",
    author: "Anonymous",
    category: "comeback",
    actionAdvice: "Yesterday is data. Today is execution. Build your proof.",
  },
  {
    id: "q-9",
    text: "Consistency is not about perfection. It is about never giving up on the return.",
    author: "comeback.mjg",
    category: "resilience" as any,
    actionAdvice: "If yesterday was missed, returning today proves unbreakable resilience.",
  },
  {
    id: "q-10",
    text: "Focus is a muscle. The more you say no to the trivial, the more strength you bring to the vital.",
    author: "Marcus Aurelius",
    category: "focus",
    actionAdvice: "Silence unnecessary notifications and start your Focus Studio session.",
  },
  {
    id: "q-11",
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "small-steps",
    actionAdvice: "Progress of 1% today compounds into an entirely transformed life over time.",
  },
  {
    id: "q-12",
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    category: "momentum",
    actionAdvice: "Start with the resources at hand right now. Friction disappears in action.",
  },
  {
    id: "q-13",
    text: "An hour of deep work in the morning is worth three hours of distracted struggle in the evening.",
    author: "Execution Science",
    category: "focus",
    actionAdvice: "Seize this early window before the world demands your attention.",
  },
  {
    id: "q-14",
    text: "Your identity is shaped by evidence. Give yourself evidence today that you finish what you start.",
    author: "comeback.mjg",
    category: "identity",
    actionAdvice: "Complete one milestone task before noon and bank it in your evidence log.",
  },
  {
    id: "q-15",
    text: "The most difficult thing is the decision to act, the rest is merely tenacity.",
    author: "Amelia Earhart",
    category: "comeback",
    actionAdvice: "Make the decision now. The discomfort lasts 3 minutes; the momentum lasts all day.",
  },
  {
    id: "q-16",
    text: "Motivation gets you going, but discipline keeps you growing.",
    author: "John C. Maxwell",
    category: "discipline",
    actionAdvice: "Lean on your Next Action Engine rather than your mood.",
  },
  {
    id: "q-17",
    text: "Be not afraid of going slowly, be afraid only of standing still.",
    author: "Chinese Proverb",
    category: "small-steps",
    actionAdvice: "Even 15 minutes of dedicated execution creates momentum.",
  },
  {
    id: "q-18",
    text: "Great things are done by a series of small things brought together.",
    author: "Vincent Van Gogh",
    category: "small-steps",
    actionAdvice: "Every milestone is built from individual focus blocks. Complete one today.",
  },
  {
    id: "q-19",
    text: "You don't have to be extreme, just consistent.",
    author: "Anonymous",
    category: "discipline",
    actionAdvice: "Consistent daily execution beats occasional frantic sprints every time.",
  },
  {
    id: "q-20",
    text: "Waking up with determination allows you to go to bed with satisfaction.",
    author: "comeback.mjg",
    category: "comeback",
    actionAdvice: "Review today's mission and commit to the top 3 priority tasks.",
  },
];

/**
 * Returns a deterministic quote for the current calendar day.
 */
export function getDailyQuote(date: Date = new Date()): MotivationalQuote {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = Math.abs(dayOfYear) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}

/**
 * Returns a random quote from the bank.
 */
export function getRandomQuote(): MotivationalQuote {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}
