import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import { connectDatabase } from './config/database.js';
import { Activity, LeaderboardEntry, Team, User, WorkoutSuggestion } from './models.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 8000);

const fallbackUsers = [
  {
    _id: 'u1',
    name: 'Ava Thompson',
    gradeLevel: '10',
    team: 'Blue Sharks',
    streak: 12,
    favoriteActivity: 'Running',
    goals: ['5K prep', 'Stronger core'],
  },
  {
    _id: 'u2',
    name: 'Noah Patel',
    gradeLevel: '11',
    team: 'Green Hawks',
    streak: 8,
    favoriteActivity: 'Cycling',
    goals: ['Cardio', 'Recovery'],
  },
  {
    _id: 'u3',
    name: 'Maya Chen',
    gradeLevel: '9',
    team: 'Red Falcons',
    streak: 15,
    favoriteActivity: 'Strength',
    goals: ['Upper body', 'Consistency'],
  },
];

const fallbackTeams = [
  { _id: 't1', name: 'Blue Sharks', points: 1280, captain: 'Ava Thompson', members: ['Ava Thompson', 'Leo Moss', 'Jade Kim'] },
  { _id: 't2', name: 'Green Hawks', points: 1195, captain: 'Noah Patel', members: ['Noah Patel', 'Iris Hall', 'Theo Gray'] },
  { _id: 't3', name: 'Red Falcons', points: 1345, captain: 'Maya Chen', members: ['Maya Chen', 'Sam Ortiz', 'Nia Singh'] },
];

const fallbackActivities = [
  { _id: 'a1', userName: 'Ava Thompson', type: 'Running', durationMinutes: 32, distanceMiles: 3.8, calories: 290, date: '2026-09-17T06:30:00.000Z' },
  { _id: 'a2', userName: 'Noah Patel', type: 'Cycling', durationMinutes: 45, distanceMiles: 11.4, calories: 360, date: '2026-09-17T07:15:00.000Z' },
  { _id: 'a3', userName: 'Maya Chen', type: 'Strength', durationMinutes: 40, distanceMiles: 0, calories: 420, date: '2026-09-16T17:00:00.000Z' },
];

const fallbackLeaderboard = [
  { _id: 'l1', name: 'Maya Chen', points: 1260, team: 'Red Falcons', badge: 'Trail Blazer' },
  { _id: 'l2', name: 'Ava Thompson', points: 1185, team: 'Blue Sharks', badge: 'Momentum Maker' },
  { _id: 'l3', name: 'Noah Patel', points: 1125, team: 'Green Hawks', badge: 'Sprint Star' },
];

const fallbackSuggestions = [
  { _id: 's1', title: 'Cardio Ladder', goal: 'Boost endurance', focus: ['Warm-up', 'Intervals', 'Cool down'], difficulty: 'Moderate' },
  { _id: 's2', title: 'Power Circuit', goal: 'Increase strength', focus: ['Push-ups', 'Squats', 'Rows'], difficulty: 'Challenging' },
  { _id: 's3', title: 'Mobility Reset', goal: 'Stay flexible', focus: ['Stretching', 'Balance', 'Recovery'], difficulty: 'Easy' },
];

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const safeList = async <T>(query: () => Promise<T[]>, fallback: T[]): Promise<T[]> => {
  try {
    const result = await query();
    return result.length > 0 ? result : fallback;
  } catch {
    return fallback;
  }
};

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'octofit-backend' });
});

app.get('/api/users', async (_req: Request, res: Response) => {
  const users = await safeList(() => User.find().lean(), fallbackUsers as never[]);
  res.json(users);
});

app.get('/api/teams', async (_req: Request, res: Response) => {
  const teams = await safeList(() => Team.find().lean(), fallbackTeams as never[]);
  res.json(teams);
});

app.get('/api/activities', async (_req: Request, res: Response) => {
  const activities = await safeList(() => Activity.find().sort({ date: -1 }).lean(), fallbackActivities as never[]);
  res.json(activities);
});

app.get('/api/leaderboard', async (_req: Request, res: Response) => {
  const leaderboard = await safeList(() => LeaderboardEntry.find().sort({ points: -1 }).lean(), fallbackLeaderboard as never[]);
  res.json(leaderboard);
});

app.get('/api/workout-suggestions', async (_req: Request, res: Response) => {
  const suggestions = await safeList(() => WorkoutSuggestion.find().lean(), fallbackSuggestions as never[]);
  res.json(suggestions);
});

app.post('/api/activities', async (req: Request, res: Response) => {
  const { userName, type, durationMinutes, distanceMiles, calories } = req.body ?? {};

  const newActivity = {
    _id: `a-${Date.now()}`,
    userName: userName ?? 'Guest Athlete',
    type: type ?? 'Running',
    durationMinutes: Number(durationMinutes ?? 30),
    distanceMiles: Number(distanceMiles ?? 0),
    calories: Number(calories ?? 0),
    date: new Date().toISOString(),
  };

  try {
    const created = await Activity.create(newActivity);
    res.status(201).json(created);
    return;
  } catch {
    fallbackActivities.unshift(newActivity as never);
    res.status(201).json(newActivity);
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  const payload = req.body ?? {};
  const newUser = {
    _id: `u-${Date.now()}`,
    name: payload.name ?? 'New User',
    gradeLevel: payload.gradeLevel ?? '9',
    team: payload.team ?? 'Unassigned',
    streak: Number(payload.streak ?? 0),
    favoriteActivity: payload.favoriteActivity ?? 'Running',
    goals: Array.isArray(payload.goals) ? payload.goals : [],
  };

  try {
    const created = await User.create(newUser);
    res.status(201).json(created);
    return;
  } catch {
    fallbackUsers.unshift(newUser as never);
    res.status(201).json(newUser);
  }
});

connectDatabase();

app.listen(port, '0.0.0.0', () => {
  console.log(`Octofit API is running on http://localhost:${port}`);
});
