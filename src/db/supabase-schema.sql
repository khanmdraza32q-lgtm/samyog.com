-- ==============================================================================
-- SAMYOJ x RAZA AI - Supabase Database Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. RAZA Conversations Table
CREATE TABLE IF NOT EXISTS public.raza_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Civic Consultation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. RAZA Messages Table
CREATE TABLE IF NOT EXISTS public.raza_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.raza_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'raza', 'system')),
    text TEXT NOT NULL,
    structured_plan JSONB,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_raza_conversations_user_id ON public.raza_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_raza_messages_conversation_id ON public.raza_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_raza_messages_created_at ON public.raza_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.raza_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raza_messages ENABLE ROW LEVEL SECURITY;

-- Conversations RLS Policies
CREATE POLICY "Users can view their own conversations"
    ON public.raza_conversations FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own conversations"
    ON public.raza_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own conversations"
    ON public.raza_conversations FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own conversations"
    ON public.raza_conversations FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Messages RLS Policies
CREATE POLICY "Users can view messages from their conversations"
    ON public.raza_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.raza_conversations
            WHERE public.raza_conversations.id = public.raza_messages.conversation_id
            AND (public.raza_conversations.user_id = auth.uid() OR public.raza_conversations.user_id IS NULL)
        )
    );

CREATE POLICY "Users can insert messages into their conversations"
    ON public.raza_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.raza_conversations
            WHERE public.raza_conversations.id = public.raza_messages.conversation_id
            AND (public.raza_conversations.user_id = auth.uid() OR public.raza_conversations.user_id IS NULL)
        )
    );
