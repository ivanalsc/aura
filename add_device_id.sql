-- Run this in your Supabase SQL Editor

ALTER TABLE public.photos 
ADD COLUMN device_id text;

-- Optional: Create an index for faster lookups if you have many photos
CREATE INDEX idx_photos_device_id ON public.photos(device_id);
