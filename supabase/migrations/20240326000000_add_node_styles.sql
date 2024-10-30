ALTER TABLE public.node
ADD COLUMN IF NOT EXISTS visual_style VARCHAR(50),
ADD COLUMN IF NOT EXISTS position_x NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS position_y NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS width NUMERIC(10,2) DEFAULT 200,
ADD COLUMN IF NOT EXISTS height NUMERIC(10,2) DEFAULT 100,
ADD COLUMN IF NOT EXISTS node_type VARCHAR(50) DEFAULT 'generic';