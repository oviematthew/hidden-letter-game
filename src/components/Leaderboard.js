import React from "react";
import "../App.css";

function Leaderboard({ leaderboard, latestEntry }) {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="leaderboard">
        <p className="empty-leaderboard">No games played yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h3>🏆 Top 10 Leaderboard (Best Time)</h3>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, idx) => {
            const isLatest =
              latestEntry &&
              entry.name === latestEntry.name &&
              entry.time === latestEntry.time;

            return (
              <tr key={idx} className={isLatest ? "orange" : ""}>
                <td>{idx + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
