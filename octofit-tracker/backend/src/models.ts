import mongoose, { type Document } from 'mongoose';

const { Schema, model, models } = mongoose;

export interface IUser extends Document {
  name: string;
  gradeLevel: string;
  team: string;
  streak: number;
  favoriteActivity: string;
  goals: string[];
}

export interface ITeam extends Document {
  name: string;
  points: number;
  captain: string;
  members: string[];
}

export interface IActivity extends Document {
  userName: string;
  type: string;
  durationMinutes: number;
  distanceMiles: number;
  calories: number;
  date: Date;
}

export interface ILeaderboardEntry extends Document {
  name: string;
  points: number;
  team: string;
  badge: string;
}

export interface IWorkoutSuggestion extends Document {
  title: string;
  goal: string;
  focus: string[];
  difficulty: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  team: { type: String, default: 'Unassigned' },
  streak: { type: Number, default: 0 },
  favoriteActivity: { type: String, default: 'Running' },
  goals: { type: [String], default: [] },
}, { timestamps: true });

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  captain: { type: String, default: '' },
  members: { type: [String], default: [] },
}, { timestamps: true });

const ActivitySchema = new Schema<IActivity>({
  userName: { type: String, required: true },
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  distanceMiles: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  team: { type: String, default: 'Unassigned' },
  badge: { type: String, default: 'Rising Star' },
}, { timestamps: true });

const WorkoutSuggestionSchema = new Schema<IWorkoutSuggestion>({
  title: { type: String, required: true },
  goal: { type: String, required: true },
  focus: { type: [String], default: [] },
  difficulty: { type: String, default: 'Moderate' },
}, { timestamps: true });

export const User = models.User || model<IUser>('User', UserSchema);
export const Team = models.Team || model<ITeam>('Team', TeamSchema);
export const Activity = models.Activity || model<IActivity>('Activity', ActivitySchema);
export const LeaderboardEntry = models.LeaderboardEntry || model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);
export const WorkoutSuggestion = models.WorkoutSuggestion || model<IWorkoutSuggestion>('WorkoutSuggestion', WorkoutSuggestionSchema);
