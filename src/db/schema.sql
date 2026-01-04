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
  email VARCHAR(100)
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
