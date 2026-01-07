-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (we'll filter in the app)
CREATE POLICY "Allow public read access" ON public.events
    FOR SELECT USING (true);

-- Create policy to allow insert
CREATE POLICY "Allow public insert access" ON public.events
    FOR INSERT WITH CHECK (true);
