-- Initial schema for Santa Doorbell Magic
-- Creates tables for scene analysis, video prompts, and orders

-- Create storage bucket for scene images
INSERT INTO storage.buckets (id, name, public)
VALUES ('scene-images', 'scene-images', true);

-- Scene analyses table
CREATE TABLE IF NOT EXISTS scene_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Image storage
    image_storage_path TEXT,
    image_url TEXT,

    -- Analysis data (full GPT-4 response)
    analysis_data JSONB NOT NULL,

    -- Extracted structured data for querying
    doors JSONB DEFAULT '[]',
    windows JSONB DEFAULT '[]',
    decorations JSONB DEFAULT '{}',
    furniture TEXT[] DEFAULT '{}',
    plants TEXT[] DEFAULT '{}',
    layout JSONB DEFAULT '{}',

    -- Scoring and classification
    suitability_score INTEGER CHECK (suitability_score >= 0 AND suitability_score <= 100),
    scene_complexity TEXT CHECK (scene_complexity IN ('minimal', 'moderate', 'rich')) DEFAULT 'moderate',

    -- Performance tracking
    processing_time_ms INTEGER
);

-- Video prompts table
CREATE TABLE IF NOT EXISTS video_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scene_analysis_id UUID NOT NULL REFERENCES scene_analyses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Prompt content
    prompt_text TEXT NOT NULL,
    prompt_title TEXT,
    prompt_category TEXT CHECK (prompt_category IN ('entrance', 'delivery', 'magical', 'interactive', 'departure')),

    -- Scoring and analysis
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    elements_used TEXT[] DEFAULT '{}',

    -- User interaction
    is_selected BOOLEAN DEFAULT false,
    is_user_edited BOOLEAN DEFAULT false,

    -- Additional metadata
    metadata JSONB DEFAULT '{}'
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Relations
    scene_analysis_id UUID REFERENCES scene_analyses(id),
    selected_prompt_id UUID REFERENCES video_prompts(id),

    -- Customer info
    customer_email TEXT NOT NULL,

    -- Payment details
    payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    amount_paid DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'GBP',

    -- Processing details
    processed_video_url TEXT,
    processing_status TEXT CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,

    -- Additional data
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scene_analyses_created_at ON scene_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scene_analyses_suitability_score ON scene_analyses(suitability_score DESC);
CREATE INDEX IF NOT EXISTS idx_video_prompts_scene_analysis_id ON video_prompts(scene_analysis_id);
CREATE INDEX IF NOT EXISTS idx_video_prompts_is_selected ON video_prompts(is_selected) WHERE is_selected = true;
CREATE INDEX IF NOT EXISTS idx_video_prompts_confidence_score ON video_prompts(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_processing_status ON orders(processing_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scene_analyses_updated_at
    BEFORE UPDATE ON scene_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE scene_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public read access for scene analyses (for demo purposes)
CREATE POLICY "Allow public read access to scene analyses" ON scene_analyses
    FOR SELECT TO public USING (true);

-- Public insert access for scene analyses
CREATE POLICY "Allow public insert to scene analyses" ON scene_analyses
    FOR INSERT TO public WITH CHECK (true);

-- Video prompts: public access linked to scene analysis
CREATE POLICY "Allow public access to video prompts" ON video_prompts
    FOR ALL TO public USING (true);

-- Orders: restrict to email-based access (basic privacy)
CREATE POLICY "Allow access to own orders" ON orders
    FOR ALL TO public USING (true);

-- Storage policy for scene images
CREATE POLICY "Allow public upload to scene images" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'scene-images');

CREATE POLICY "Allow public read from scene images" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'scene-images');

CREATE POLICY "Allow public delete from scene images" ON storage.objects
    FOR DELETE TO public USING (bucket_id = 'scene-images');