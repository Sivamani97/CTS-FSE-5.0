USE event_portal;

SELECT
    u.user_id,
    u.full_name,
    e.event_id,
    e.title,
    e.city,
    e.start_date
FROM Users u
JOIN Registrations r ON u.user_id = r.user_id
JOIN Events e ON r.event_id = e.event_id
WHERE e.status = 'upcoming'
  AND e.city = u.city
ORDER BY e.start_date;

SELECT
    e.event_id,
    e.title,
    ROUND(AVG(f.rating), 2) AS average_rating,
    COUNT(f.feedback_id) AS total_feedback
FROM Events e
JOIN Feedback f ON e.event_id = f.event_id
GROUP BY e.event_id, e.title
HAVING COUNT(f.feedback_id) >= 10
ORDER BY average_rating DESC;

SELECT
    u.user_id,
    u.full_name,
    u.email,
    u.city
FROM Users u
WHERE u.user_id NOT IN (
    SELECT r.user_id
    FROM Registrations r
    WHERE r.registration_date >= CURDATE() - INTERVAL 90 DAY
);

SELECT
    e.event_id,
    e.title,
    COUNT(s.session_id) AS sessions_between_10_and_12
FROM Events e
JOIN Sessions s ON e.event_id = s.event_id
WHERE TIME(s.start_time) >= '10:00:00'
  AND TIME(s.start_time) < '12:00:00'
GROUP BY e.event_id, e.title;

SELECT
    e.city,
    COUNT(DISTINCT r.user_id) AS distinct_registrations
FROM Events e
JOIN Registrations r ON e.event_id = r.event_id
GROUP BY e.city
ORDER BY distinct_registrations DESC
LIMIT 5;

SELECT
    e.event_id,
    e.title,
    SUM(CASE WHEN res.resource_type = 'pdf'   THEN 1 ELSE 0 END) AS pdf_count,
    SUM(CASE WHEN res.resource_type = 'image' THEN 1 ELSE 0 END) AS image_count,
    SUM(CASE WHEN res.resource_type = 'link'  THEN 1 ELSE 0 END) AS link_count,
    COUNT(res.resource_id) AS total_resources
FROM Events e
LEFT JOIN Resources res ON e.event_id = res.event_id
GROUP BY e.event_id, e.title;

SELECT
    u.user_id,
    u.full_name,
    f.rating,
    f.comments,
    e.title AS event_name
FROM Feedback f
JOIN Users u ON f.user_id = u.user_id
JOIN Events e ON f.event_id = e.event_id
WHERE f.rating < 3;

SELECT
    e.event_id,
    e.title,
    COUNT(s.session_id) AS session_count
FROM Events e
LEFT JOIN Sessions s ON e.event_id = s.event_id
WHERE e.status = 'upcoming'
GROUP BY e.event_id, e.title;

SELECT
    u.user_id,
    u.full_name,
    e.status,
    COUNT(e.event_id) AS event_count
FROM Users u
JOIN Events e ON u.user_id = e.organizer_id
GROUP BY u.user_id, u.full_name, e.status
ORDER BY u.user_id, e.status;

SELECT
    e.event_id,
    e.title
FROM Events e
JOIN Registrations r ON e.event_id = r.event_id
WHERE e.event_id NOT IN (
    SELECT f.event_id FROM Feedback f
)
GROUP BY e.event_id, e.title;

SELECT
    registration_date,
    COUNT(user_id) AS new_users
FROM Users
WHERE registration_date >= CURDATE() - INTERVAL 7 DAY
GROUP BY registration_date
ORDER BY registration_date;

SELECT
    e.event_id,
    e.title,
    COUNT(s.session_id) AS session_count
FROM Events e
JOIN Sessions s ON e.event_id = s.event_id
GROUP BY e.event_id, e.title
HAVING COUNT(s.session_id) = (
    SELECT MAX(cnt)
    FROM (
        SELECT COUNT(session_id) AS cnt
        FROM Sessions
        GROUP BY event_id
    ) AS sub
);

SELECT
    e.city,
    ROUND(AVG(f.rating), 2) AS average_rating
FROM Events e
JOIN Feedback f ON e.event_id = f.event_id
GROUP BY e.city
ORDER BY average_rating DESC;

SELECT
    e.event_id,
    e.title,
    COUNT(r.registration_id) AS total_registrations
FROM Events e
JOIN Registrations r ON e.event_id = r.event_id
GROUP BY e.event_id, e.title
ORDER BY total_registrations DESC
LIMIT 3;

SELECT
    a.session_id AS session_a_id,
    a.title AS session_a_title,
    b.session_id AS session_b_id,
    b.title AS session_b_title,
    a.event_id
FROM Sessions a
JOIN Sessions b ON a.event_id = b.event_id
  AND a.session_id < b.session_id
  AND a.start_time < b.end_time
  AND b.start_time < a.end_time;

SELECT
    u.user_id,
    u.full_name,
    u.email,
    u.registration_date
FROM Users u
WHERE u.registration_date >= CURDATE() - INTERVAL 30 DAY
  AND u.user_id NOT IN (
      SELECT r.user_id FROM Registrations r
  );

SELECT
    speaker_name,
    COUNT(session_id) AS session_count
FROM Sessions
GROUP BY speaker_name
HAVING COUNT(session_id) > 1;

SELECT
    e.event_id,
    e.title
FROM Events e
WHERE e.event_id NOT IN (
    SELECT res.event_id FROM Resources res
);

SELECT
    e.event_id,
    e.title,
    COUNT(DISTINCT r.registration_id) AS total_registrations,
    ROUND(AVG(f.rating), 2) AS average_rating
FROM Events e
LEFT JOIN Registrations r ON e.event_id = r.event_id
LEFT JOIN Feedback f ON e.event_id = f.event_id
WHERE e.status = 'completed'
GROUP BY e.event_id, e.title;

SELECT
    u.user_id,
    u.full_name,
    COUNT(DISTINCT r.event_id) AS events_attended,
    COUNT(DISTINCT f.feedback_id) AS feedbacks_submitted
FROM Users u
LEFT JOIN Registrations r ON u.user_id = r.user_id
LEFT JOIN Feedback f ON u.user_id = f.user_id
GROUP BY u.user_id, u.full_name
ORDER BY u.user_id;

SELECT
    u.user_id,
    u.full_name,
    COUNT(f.feedback_id) AS feedback_count
FROM Users u
JOIN Feedback f ON u.user_id = f.user_id
GROUP BY u.user_id, u.full_name
ORDER BY feedback_count DESC
LIMIT 5;

SELECT
    user_id,
    event_id,
    COUNT(registration_id) AS registration_count
FROM Registrations
GROUP BY user_id, event_id
HAVING COUNT(registration_id) > 1;

SELECT
    DATE_FORMAT(registration_date, '%Y-%m') AS month,
    COUNT(registration_id) AS registration_count
FROM Registrations
WHERE registration_date >= CURDATE() - INTERVAL 12 MONTH
GROUP BY DATE_FORMAT(registration_date, '%Y-%m')
ORDER BY month;

SELECT
    e.event_id,
    e.title,
    ROUND(AVG(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time)), 2) AS avg_duration_minutes
FROM Events e
JOIN Sessions s ON e.event_id = s.event_id
GROUP BY e.event_id, e.title;

SELECT
    e.event_id,
    e.title
FROM Events e
WHERE e.event_id NOT IN (
    SELECT s.event_id FROM Sessions s
);
