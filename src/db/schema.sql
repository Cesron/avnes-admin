-- ==========================================
-- AVNES Admin - Base de datos inicial (UUID)
-- ==========================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================================
-- Drop tables (solo desarrollo)
-- ==========================================
DROP TABLE IF EXISTS children_groups;
DROP TABLE IF EXISTS children;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS mentors;
DROP TABLE IF EXISTS families;
DROP TABLE IF EXISTS clubs CASCADE;

-- ==========================================
-- Table: clubs
-- (puede quedarse SERIAL, pero lo paso a UUID por consistencia)
-- ==========================================
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================================
-- Table: mentors
-- ==========================================
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  user_id TEXT UNIQUE REFERENCES "user"(id) ON DELETE SET NULL
);

-- ==========================================
-- Table: groups
-- ==========================================
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE RESTRICT,
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE RESTRICT
);

-- ==========================================
-- Table: families
-- ==========================================
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Código penpal (ej: '0012')
  penpal_code CHAR(4) NOT NULL UNIQUE,

  -- Recursos compartidos
  family_biography_url TEXT,
  family_photo_url TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Table: children
-- ==========================================
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name VARCHAR(100) NOT NULL,
  gender CHAR(1) NOT NULL,
  birth_date DATE NOT NULL,

  -- Relación familiar (opcional)
  family_id UUID REFERENCES families(id) ON DELETE RESTRICT,

  -- Recursos individuales
  pamphlet_url TEXT,
  child_photo_url TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Table: children_groups
-- ==========================================
CREATE TABLE children_groups (
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (child_id, group_id)
);

-- ==========================================
-- Índices recomendados
-- ==========================================

-- Relaciones
CREATE INDEX idx_groups_club_id ON groups (club_id);
CREATE INDEX idx_groups_mentor_id ON groups (mentor_id);

CREATE INDEX idx_children_family_id ON children (family_id);

CREATE INDEX idx_children_groups_group_id ON children_groups (group_id);

-- Búsqueda frecuente por código penpal
CREATE UNIQUE INDEX idx_families_penpal_code ON families (penpal_code);

-- ==========================================
-- MÓDULO DE ACTIVIDADES Y ASISTENCIA
-- ==========================================

-- ==========================================
-- Drop tables (solo desarrollo)
-- ==========================================
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS activity_occurrences;
DROP TABLE IF EXISTS activity_recurrences;
DROP TABLE IF EXISTS activity_groups;
DROP TABLE IF EXISTS activities CASCADE;

-- ==========================================
-- Table: activities
-- Define una actividad general (única o recurrente)
-- ==========================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Table: activity_groups
-- Relaciona actividades con uno o varios grupos
-- ==========================================
CREATE TABLE activity_groups (
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, group_id)
);

-- ==========================================
-- Table: activity_recurrences
-- Define la regla de recurrencia de una actividad (opcional)
-- Una actividad solo puede tener una recurrencia
-- ==========================================
CREATE TABLE activity_recurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL UNIQUE REFERENCES activities(id) ON DELETE CASCADE,
  frequency VARCHAR(20) NOT NULL,
  interval INT NOT NULL DEFAULT 1,
  days_of_week VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Table: activity_occurrences
-- Cada fecha concreta en la que ocurre una actividad
-- ==========================================
CREATE TABLE activity_occurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Table: attendances
-- Registro de asistencia por niño y por ocurrencia
-- ==========================================
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  activity_occurrence_id UUID NOT NULL REFERENCES activity_occurrences(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  marked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, activity_occurrence_id)
);

-- ==========================================
-- Índices - Módulo Actividades y Asistencia
-- ==========================================

-- activity_groups
CREATE INDEX idx_activity_groups_group_id ON activity_groups (group_id);

-- activity_occurrences
CREATE INDEX idx_activity_occurrences_activity_id ON activity_occurrences (activity_id);
CREATE INDEX idx_activity_occurrences_start_datetime ON activity_occurrences (start_datetime);

-- attendances
CREATE INDEX idx_attendances_child_id ON attendances (child_id);
CREATE INDEX idx_attendances_activity_occurrence_id ON attendances (activity_occurrence_id);
