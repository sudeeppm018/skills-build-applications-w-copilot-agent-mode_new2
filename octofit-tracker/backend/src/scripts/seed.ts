// Seed command: npm run seed
// Description: populates the octofit_db with demo users, teams, activities, leaderboard data, and workout suggestions.
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Activity, LeaderboardEntry, Team, User, WorkoutSuggestion } from '../models.js';

dotenv.config();

async function seedDatabase() {
  await connectDatabase();

  const users = [
    { name: 'Ava Thompson', gradeLevel: '10', team: 'Blue Sharks', streak: 12, favoriteActivity: 'Running', goals: ['5K prep', 'Improve speed'] },
    { name: 'Noah Patel', gradeLevel: '11', team: 'Green Hawks', streak: 8, favoriteActivity: 'Cycling', goals: ['Cardio', 'Recovery'] },
    { name: 'Maya Chen', gradeLevel: '9', team: 'Red Falcons', streak: 15, favoriteActivity: 'Strength', goals: ['Upper body', 'Consistency'] },
  ];

  const teams = [
    { name: 'Blue Sharks', points: 1280, captain: 'Ava Thompson', members: ['Ava Thompson', 'Leo Moss', 'Jade Kim'] },
    { name: 'Green Hawks', points: 1195, captain: 'Noah Patel', members: ['Noah Patel', 'Iris Hall', 'Theo Gray'] },
    { name: 'Red Falcons', points: 1345, captain: 'Maya Chen', members: ['Maya Chen', 'Sam Ortiz', 'Nia Singh'] },
  ];

  const activities = [
    { userName: 'Ava Thompson', type: 'Running', durationMinutes: 32, distanceMiles: 3.8, calories: 290, date: new Date('2026-09-17T06:30:00Z') },
    { userName: 'Noah Patel', type: 'Cycling', durationMinutes: 45, distanceMiles: 11.4, calories: 360, date: new Date('2026-09-17T07:15:00Z') },
    { userName: 'Maya Chen', type: 'Strength', durationMinutes: 40, distanceMiles: 0, calories: 420, date: new Date('2026-09-16T17:00:00Z') },
  ];

  const leaderboard = [
    { name: 'Maya Chen', points: 1260, team: 'Red Falcons', badge: 'Trail Blazer' },
    { name: 'Ava Thompson', points: 1185, team: 'Blue Sharks', badge: 'Momentum Maker' },
    { name: 'Noah Patel', points: 1125, team: 'Green Hawks', badge: 'Sprint Star' },
  ];

  const suggestions = [
    { title: 'Cardio Ladder', goal: 'Boost endurance', focus: ['Warm-up', 'Intervals', 'Cool down'], difficulty: 'Moderate' },
    { title: 'Power Circuit', goal: 'Increase strength', focus: ['Push-ups', 'Squats', 'Rows'], difficulty: 'Challenging' },
    { title: 'Mobility Reset', goal: 'Stay flexible', focus: ['Stretching', 'Balance', 'Recovery'], difficulty: 'Easy' },
  ];

  await User.deleteMany({});
  await Team.deleteMany({});
  await Activity.deleteMany({});
  await LeaderboardEntry.deleteMany({});
  await WorkoutSuggestion.deleteMany({});

  await User.insertMany(users);
  await Team.insertMany(teams);
  await Activity.insertMany(activities);
  await LeaderboardEntry.insertMany(leaderboard);
  await WorkoutSuggestion.insertMany(suggestions);

  console.log('Database seeding complete');
  await mongoose.disconnect();
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
