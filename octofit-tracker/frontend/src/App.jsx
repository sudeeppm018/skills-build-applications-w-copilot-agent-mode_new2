import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import appLogo from '../../../docs/octofitapp-small.png';
import './App.css';

const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api';
  }

  const { hostname } = window.location;
  if (hostname.includes('app.github.dev')) {
    return `https://${hostname.replace('-5173', '-8000')}/api`;
  }

  return 'http://localhost:8000/api';
};

const apiBaseUrl = getApiBaseUrl();

const emptyDashboard = {
  users: [],
  teams: [],
  activities: [],
  leaderboard: [],
  suggestions: [],
};

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

function StatCard({ label, value, accent }) {
  return (
    <div className="col-md-3">
      <div className="metric-card shadow-sm border-0">
        <div className={`metric-accent ${accent}`} />
        <div className="metric-body">
          <span className="metric-label">{label}</span>
          <strong className="metric-value">{value}</strong>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [activityForm, setActivityForm] = useState({
    userName: 'Maya Chen',
    type: 'Running',
    durationMinutes: 35,
    distanceMiles: 3.4,
    calories: 280,
  });

  const loadDashboard = async () => {
    try {
      const [users, teams, activities, leaderboard, suggestions] = await Promise.all([
        fetchJson(`${apiBaseUrl}/users`),
        fetchJson(`${apiBaseUrl}/teams`),
        fetchJson(`${apiBaseUrl}/activities`),
        fetchJson(`${apiBaseUrl}/leaderboard`),
        fetchJson(`${apiBaseUrl}/workout-suggestions`),
      ]);

      setDashboard({ users, teams, activities, leaderboard, suggestions });
    } catch (error) {
      console.error('Unable to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalPoints = dashboard.leaderboard.reduce((sum, entry) => sum + entry.points, 0);

  const onChange = (event) => {
    const { name, value } = event.target;
    setActivityForm((current) => ({
      ...current,
      [name]: name === 'durationMinutes' || name === 'distanceMiles' || name === 'calories' ? Number(value) : value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    await fetch(`${apiBaseUrl}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityForm),
    });

    setActivityForm({
      userName: 'Maya Chen',
      type: 'Running',
      durationMinutes: 35,
      distanceMiles: 3.4,
      calories: 280,
    });

    loadDashboard();
  };

  return (
    <main className="page-shell container py-4">
      <header className="hero-panel mb-4">
        <div>
          <p className="eyebrow">Mergington High School</p>
          <h1>OctoFit Tracker</h1>
          <p className="hero-copy">
            Track workouts, motivate teams, and turn PE into a friendly competition.
          </p>
        </div>
        <img src={appLogo} alt="Octofit app logo" className="hero-logo" />
      </header>

      {loading ? (
        <div className="loading-box">Loading campus fitness data…</div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <StatCard label="Active athletes" value={dashboard.users.length} accent="mint" />
            <StatCard label="Team count" value={dashboard.teams.length} accent="blue" />
            <StatCard label="Total points" value={totalPoints} accent="gold" />
            <StatCard label="Suggestions" value={dashboard.suggestions.length} accent="purple" />
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="panel-card">
                <div className="panel-header">
                  <h2>Leaderboard</h2>
                  <span className="badge bg-success-subtle text-success">This week</span>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Student</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Badge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.leaderboard.map((entry, index) => (
                        <tr key={entry._id ?? `${entry.name}-${index}`}>
                          <td>#{index + 1}</td>
                          <td>{entry.name}</td>
                          <td>{entry.team}</td>
                          <td>{entry.points}</td>
                          <td>{entry.badge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="panel-card">
                <div className="panel-header">
                  <h2>Log activity</h2>
                </div>
                <form className="activity-form" onSubmit={onSubmit}>
                  <label>
                    Athlete
                    <input name="userName" value={activityForm.userName} onChange={onChange} />
                  </label>
                  <label>
                    Activity
                    <select name="type" value={activityForm.type} onChange={onChange}>
                      <option>Running</option>
                      <option>Walking</option>
                      <option>Cycling</option>
                      <option>Strength</option>
                    </select>
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <label>
                        Minutes
                        <input name="durationMinutes" type="number" value={activityForm.durationMinutes} onChange={onChange} />
                      </label>
                    </div>
                    <div className="col-6">
                      <label>
                        Distance
                        <input name="distanceMiles" type="number" step="0.1" value={activityForm.distanceMiles} onChange={onChange} />
                      </label>
                    </div>
                  </div>
                  <label>
                    Calories
                    <input name="calories" type="number" value={activityForm.calories} onChange={onChange} />
                  </label>
                  <button className="btn btn-primary w-100" type="submit">Save workout</button>
                </form>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-1">
            <div className="col-lg-6">
              <div className="panel-card">
                <div className="panel-header">
                  <h2>Teams</h2>
                </div>
                <div className="team-list">
                  {dashboard.teams.map((team) => (
                    <div className="team-pill" key={team._id ?? team.name}>
                      <div>
                        <strong>{team.name}</strong>
                        <small>{team.members.length} athletes</small>
                      </div>
                      <span>{team.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="panel-card">
                <div className="panel-header">
                  <h2>Workout suggestions</h2>
                </div>
                <div className="suggestion-list">
                  {dashboard.suggestions.map((suggestion) => (
                    <div className="suggestion-item" key={suggestion._id ?? suggestion.title}>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{suggestion.title}</strong>
                        <span className="suggestion-difficulty">{suggestion.difficulty}</span>
                      </div>
                      <p>{suggestion.goal}</p>
                      <div className="focus-tags">
                        {suggestion.focus.map((focus) => (
                          <span key={`${suggestion.title}-${focus}`} className="focus-tag">{focus}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center gap-2 mb-0">
            <img src={appLogo} alt="Octofit logo" className="brand-mark" />
            OctoFit
          </div>
          <div className="navbar-nav d-flex flex-row gap-3 ms-auto">
            <NavLink className="nav-link" to="/">Dashboard</NavLink>
            <NavLink className="nav-link" to="/teams">Teams</NavLink>
            <NavLink className="nav-link" to="/activities">Activities</NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/teams" element={<DashboardPage />} />
        <Route path="/activities" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
