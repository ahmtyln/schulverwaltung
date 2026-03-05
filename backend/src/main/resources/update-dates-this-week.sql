-- Update all date/datetime columns to this week (Monday = start of week)
-- Run: mysql -u root -p schulverwaltung < update-dates-this-week.sql
-- Or execute in MySQL Workbench / your DB client

USE schulverwaltung;

-- This week: Monday through Friday
SET @mon = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
SET @tue = DATE_ADD(@mon, INTERVAL 1 DAY);
SET @wed = DATE_ADD(@mon, INTERVAL 2 DAY);
SET @thu = DATE_ADD(@mon, INTERVAL 3 DAY);
SET @fri = DATE_ADD(@mon, INTERVAL 4 DAY);

-- ========== LESSON: start_time, end_time → same time on this week's day (day 0=Mon .. 4=Fri)
UPDATE lesson
SET
  start_time = TIMESTAMP(DATE_ADD(@mon, INTERVAL IFNULL(day, 0) DAY), TIME(start_time)),
  end_time   = TIMESTAMP(DATE_ADD(@mon, INTERVAL IFNULL(day, 0) DAY), TIME(end_time))
WHERE start_time IS NOT NULL AND end_time IS NOT NULL;

-- ========== EVENT: date → spread across this week (by id)
-- PK column: event_id (Hibernate snake_case) or id
UPDATE event e
SET e.date = CASE
  WHEN e.event_id % 5 = 0 THEN TIMESTAMP(@mon, TIME(e.date))
  WHEN e.event_id % 5 = 1 THEN TIMESTAMP(@tue, TIME(e.date))
  WHEN e.event_id % 5 = 2 THEN TIMESTAMP(@wed, TIME(e.date))
  WHEN e.event_id % 5 = 3 THEN TIMESTAMP(@thu, TIME(e.date))
  ELSE TIMESTAMP(@fri, TIME(e.date))
END
WHERE e.date IS NOT NULL;

-- ========== ANNOUNCEMENT: date → spread across this week
UPDATE announcement a
SET a.date = CASE
  WHEN a.announcement_id % 5 = 0 THEN TIMESTAMP(@mon, TIME(a.date))
  WHEN a.announcement_id % 5 = 1 THEN TIMESTAMP(@tue, TIME(a.date))
  WHEN a.announcement_id % 5 = 2 THEN TIMESTAMP(@wed, TIME(a.date))
  WHEN a.announcement_id % 5 = 3 THEN TIMESTAMP(@thu, TIME(a.date))
  ELSE TIMESTAMP(@fri, TIME(a.date))
END
WHERE a.date IS NOT NULL;

-- ========== EXAM: start_time, end_time → this week (preserve time of day)
UPDATE exam
SET
  start_time = TIMESTAMP(@mon, TIME(start_time)),
  end_time   = TIMESTAMP(@mon, TIME(end_time))
WHERE start_time IS NOT NULL AND end_time IS NOT NULL;

-- ========== ASSIGNMENT: start_time = this week Mon, end_time = this week Fri (or preserve duration)
UPDATE assignment
SET
  start_time = TIMESTAMP(@mon, TIME(start_time)),
  end_time   = TIMESTAMP(@fri, TIME(end_time))
WHERE start_time IS NOT NULL AND end_time IS NOT NULL;

-- ========== ATTENDANCE: date → this week (spread by id)
UPDATE attendance
SET date = TIMESTAMP(DATE_ADD(@mon, INTERVAL (attendance_id % 5) DAY), TIME(date))
WHERE date IS NOT NULL;

-- ========== TEACHER / PARENT / STUDENT: createdAt → start of this week (if column exists)
-- Uncomment if your schema has created_at:
-- UPDATE teacher SET created_at = @mon WHERE created_at IS NOT NULL;
-- UPDATE parent SET created_at = @mon WHERE created_at IS NOT NULL;
-- UPDATE student SET created_at = @mon WHERE created_at IS NOT NULL;

SELECT 'Dates updated to this week (Mon–Fri).' AS result;
