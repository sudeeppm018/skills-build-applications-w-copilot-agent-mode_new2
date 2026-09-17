import { Schema, model, models } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    team: { type: String, default: 'Unassigned' },
    streak: { type: Number, default: 0 },
    favoriteActivity: { type: String, default: 'Running' },
    goals: { type: [String], default: [] },
}, { timestamps: true });
const TeamSchema = new Schema({
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
    captain: { type: String, default: '' },
    members: { type: [String], default: [] },
}, { timestamps: true });
const ActivitySchema = new Schema({
    userName: { type: String, required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    distanceMiles: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
}, { timestamps: true });
const LeaderboardEntrySchema = new Schema({
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
    team: { type: String, default: 'Unassigned' },
    badge: { type: String, default: 'Rising Star' },
}, { timestamps: true });
const WorkoutSuggestionSchema = new Schema({
    title: { type: String, required: true },
    goal: { type: String, required: true },
    focus: { type: [String], default: [] },
    difficulty: { type: String, default: 'Moderate' },
}, { timestamps: true });
export const User = models.User || model('User', UserSchema);
export const Team = models.Team || model('Team', TeamSchema);
export const Activity = models.Activity || model('Activity', ActivitySchema);
export const LeaderboardEntry = models.LeaderboardEntry || model('LeaderboardEntry', LeaderboardEntrySchema);
export const WorkoutSuggestion = models.WorkoutSuggestion || model('WorkoutSuggestion', WorkoutSuggestionSchema);
