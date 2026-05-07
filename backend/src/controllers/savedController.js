const pool = require('../config/db');

const getSavedColleges = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get full college info along with saved_at timestamp
    const query = `
      SELECT c.*, sc.saved_at 
      FROM colleges c
      JOIN saved_colleges sc ON c.id = sc.college_id
      WHERE sc.user_id = $1
      ORDER BY sc.saved_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching saved colleges:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const saveCollege = async (req, res) => {
  try {
    const userId = req.user.id;
    const { collegeId } = req.params;

    // Check if already saved
    const checkQuery = 'SELECT * FROM saved_colleges WHERE user_id = $1 AND college_id = $2';
    const checkResult = await pool.query(checkQuery, [userId, collegeId]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'College already saved' });
    }

    // Save
    const insertQuery = 'INSERT INTO saved_colleges (user_id, college_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(insertQuery, [userId, collegeId]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error saving college:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const removeSavedCollege = async (req, res) => {
  try {
    const userId = req.user.id;
    const { collegeId } = req.params;

    const deleteQuery = 'DELETE FROM saved_colleges WHERE user_id = $1 AND college_id = $2 RETURNING *';
    const result = await pool.query(deleteQuery, [userId, collegeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Saved college not found' });
    }

    res.json({ success: true, data: { id: collegeId } });
  } catch (err) {
    console.error('Error removing saved college:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getSavedColleges,
  saveCollege,
  removeSavedCollege,
};
