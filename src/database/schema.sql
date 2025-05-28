
-- Database schema for the Event Management System
-- This file contains all the SQL commands needed to set up your database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user management
-- This extends Supabase auth.users with additional profile information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    full_name VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('active', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table for storing event information
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR,
    position VARCHAR,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_images table for storing image references
CREATE TABLE IF NOT EXISTS public.event_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    image_url VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_images_event_id ON public.event_images(event_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON public.events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can view all active profiles
CREATE POLICY "Users can view active profiles" ON public.profiles
    FOR SELECT USING (status = 'active' OR auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Events policies
-- All authenticated users can view events
CREATE POLICY "Authenticated users can view events" ON public.events
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can insert events
CREATE POLICY "Authenticated users can insert events" ON public.events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

-- Users can update their own events, admins can update all
CREATE POLICY "Users can update own events" ON public.events
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Users can delete their own events, admins can delete all
CREATE POLICY "Users can delete own events" ON public.events
    FOR DELETE USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Event images policies
-- Users can view all event images
CREATE POLICY "Users can view event images" ON public.event_images
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can insert images for events they can access
CREATE POLICY "Users can insert event images" ON public.event_images
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE id = event_id AND (
                created_by = auth.uid() OR 
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role IN ('admin', 'editor')
                )
            )
        )
    );

-- Users can delete images for events they own, admins can delete all
CREATE POLICY "Users can delete event images" ON public.event_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE id = event_id AND (
                created_by = auth.uid() OR 
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            )
        )
    );

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for event images
CREATE POLICY "Users can upload event images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'event-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can view event images" ON storage.objects
    FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Users can delete own event images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'event-images' AND 
        auth.role() = 'authenticated'
    );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'viewer',
        'pending'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default admin user (you should change these credentials)
-- Password: admin123 (you should change this immediately after setup)
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@localhost',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "System Administrator"}',
    false,
    'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Insert the admin profile
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    status
) SELECT 
    id,
    'admin@localhost',
    'System Administrator',
    'admin',
    'active'
FROM auth.users 
WHERE email = 'admin@localhost'
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'active';

-- Add some sample data for testing
INSERT INTO public.events (
    title,
    description,
    date,
    start_time,
    end_time,
    location,
    position,
    notes,
    created_by
) SELECT 
    'Δοκιμαστικό Συμβάν',
    'Αυτό είναι ένα δοκιμαστικό συμβάν για να ελέγξετε ότι το σύστημα λειτουργεί σωστά.',
    CURRENT_DATE,
    '09:00',
    '10:00',
    'ΕΦ ΠΛΑΓΙΕΣ',
    'ΕΦ ΠΛΑΓΙΕΣ',
    'Δοκιμαστικές σημειώσεις',
    profiles.id
FROM public.profiles 
WHERE email = 'admin@localhost'
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.events IS 'Event information and scheduling';
COMMENT ON TABLE public.event_images IS 'Image attachments for events';
COMMENT ON COLUMN public.profiles.role IS 'User role: admin, editor, or viewer';
COMMENT ON COLUMN public.profiles.status IS 'Account status: active or pending approval';
