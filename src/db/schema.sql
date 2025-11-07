-- ==========================================
-- AVNES Admin - Base inicial
-- ==========================================

-- Drop tables if exist (para desarrollo)
DROP TABLE IF EXISTS children_groups, children, groups, mentors, clubs CASCADE;

-- ==========================================
-- Table: clubs
-- ==========================================
CREATE TABLE clubs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar los clubes principales
INSERT INTO clubs (name) VALUES
  ('Moisés'),
  ('Samuel'),
  ('Josué');

-- ==========================================
-- Table: mentors
-- ==========================================
CREATE TABLE mentors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100)
);

-- ==========================================
-- Table: groups
-- ==========================================
CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  club_id INT NOT NULL REFERENCES clubs(id) ON DELETE RESTRICT,
  mentor_id INT NOT NULL REFERENCES mentors(id) ON DELETE RESTRICT
);

-- ==========================================
-- Table: children
-- ==========================================
CREATE TABLE children (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  gender VARCHAR(1) NOT NULL,
  birth_date DATE NOT NULL
);

-- ==========================================
-- Table: children_groups
-- ==========================================
CREATE TABLE children_groups (
  id SERIAL PRIMARY KEY,
  child_id INT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT TRUE
);

-- ==========================================
-- Optional: indices para búsquedas más rápidas
-- ==========================================
CREATE INDEX idx_groups_club_id ON groups (club_id);
CREATE INDEX idx_groups_mentor_id ON groups (mentor_id);
CREATE INDEX idx_children_groups_child_id ON children_groups (child_id);
CREATE INDEX idx_children_groups_group_id ON children_groups (group_id);
