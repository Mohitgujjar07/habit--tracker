export type OccupationType =
  | "student"
  | "employee"
  | "entrepreneur"
  | "freelancer"
  | "job_seeker"
  | "other";

export type FreeTimeSlot =
  | "<30 minutes"
  | "30–60 minutes"
  | "1–2 hours"
  | "2–4 hours"
  | "4+ hours";

export type CoachingStyle = "GENTLE" | "DIRECT" | "ANALYTICAL" | "BALANCED";

export type AccountabilityStyle =
  | "Gentle reminder"
  | "Recovery plan"
  | "Direct feedback"
  | "Only mention it if important"
  | "Don't remind me repeatedly";

export interface StudentProfile {
  course?: string;
  year?: string;
  subjects?: string[];
  collegeSchedule?: string;
  examSchedule?: string;
  skills?: string[];
  careerInterests?: string[];
}

export interface DeveloperProfile {
  languages?: string[];
  frameworks?: string[];
  databases?: string[];
  cloud?: string[];
  aiTools?: string[];
  currentSkillLevel?: string;
  githubUrl?: string;
  portfolioStatus?: string;
}

export interface EntrepreneurProfile {
  businessIdea?: string;
  currentStage?: string;
  teamSize?: string;
  revenueStatus?: string;
  mainBottleneck?: string;
}

export interface EmployeeProfile {
  role?: string;
  industry?: string;
  skills?: string[];
  careerGoals?: string;
  currentProjects?: string;
}

export interface BehavioralPreferences {
  onImportantTask: string;
  onDifficultTask: string;
  onMissedRoutineDay: string;
  primaryNeed: string;
}

export interface DigitalBehaviorProfile {
  screenTimeHours: string;
  consumingActivities: string[];
  distractingApps: string[];
  distractionTimes: string[];
  distractionTriggers: string[];
}

export interface RoutineSchedule {
  typicalWake: string;
  desiredWake: string;
  typicalSleep: string;
  desiredSleep: string;
  workStart: string;
  workEnd: string;
  commuteTime: string;
  exerciseAvailability: string;
  preferredWorkHours: string;
}

export interface EnergyProfile {
  energeticWindow: string;
  tiredWindow: string;
  hardestWorkWindow: string;
}

export interface GoalEntry {
  category: "BECOME" | "BUILD" | "LEARN" | "IMPROVE" | "STOP" | "START" | "EXPERIENCE";
  text: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  preferredName: string;
  fullName?: string;
  ageRange?: string;
  country?: string;
  timezone: string;
  occupation: OccupationType;
  currentOccupationDetail?: string;
  weekdayRoutine?: string;
  weekendRoutine?: string;
  freeTimeDaily: FreeTimeSlot;
  responsibilities?: string;

  // Step 2 & 3
  selectedLifeAreas: string[];
  priorityLifeAreas: string[];
  primaryBottleneck: string;
  secondaryBottlenecks: string[];

  // Step 4
  behaviorProfile: BehavioralPreferences;

  // Step 5
  digitalProfile: DigitalBehaviorProfile;

  // Step 6
  routine: RoutineSchedule;

  // Step 7
  energyProfile: EnergyProfile;

  // Step 8: Branching Profile
  studentProfile?: StudentProfile;
  developerProfile?: DeveloperProfile;
  entrepreneurProfile?: EntrepreneurProfile;
  employeeProfile?: EmployeeProfile;

  // Step 9 & 10
  goals90Days: GoalEntry[];
  personalDefinitionOfSuccess: string;
  coachStyle: CoachingStyle;
  notificationStyle?: string;
  dislikedExperiencePatterns: string[];
  accountabilityStyle: AccountabilityStyle;

  // Evolution & metadata
  northStarVision?: string;
  transformationPhase?: string;
  onboardingCompleted: boolean;
  onboardingStep: number;
  transformationDay: number; // e.g. 1 to 90
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  userId: string;
  theme: "dark" | "light" | "system";
  soundEffects: boolean;
  ambientAudio: boolean;
  minimalMode: boolean;
  allowAI: boolean;
  allowHealthTracking: boolean;
  allowJournalAI: boolean;
  privacyStrict: boolean;
  activeMode: "standard" | "college" | "developer" | "bad_day" | "recovery";
}
