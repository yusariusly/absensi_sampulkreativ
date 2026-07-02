const { Pool } = require('pg');
require('dotenv').config();

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/absensi_db',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

const scoreboardService = require('./src/modules/pkl-activity/services/scoreboard.service');

async function main() {
  try {
    const user = {
      id: 'usr-1782785475420',
      role: 'student'
    };
    const scoreboard = await scoreboardService.getScoreboard(pgPool, user, 1);
    console.log("=== SCOREBOARD RESULT FOR WEEK 1 ===");
    console.log("Week number:", scoreboard.week_number);
    console.log("Show scoreboard:", scoreboard.show_scoreboard);
    console.log("Rankings count:", scoreboard.rankings.length);
    console.log("Rankings list:", JSON.stringify(scoreboard.rankings, null, 2));
  } catch (err) {
    console.error("Error executing scoreboard service:", err);
  } finally {
    await pgPool.end();
  }
}

main();
