-- ====================================================================
-- SUPABASE DATABASE SETUP & FIX SCRIPT
-- ====================================================================
-- INSTRUCTIONS:
-- 1. Copy the contents of this file.
-- 2. Go to your Supabase Dashboard (https://supabase.com).
-- 3. Navigate to the "SQL Editor" section on the left sidebar.
-- 4. Click "New Query" and paste this script.
-- 5. Click "Run" to execute.
-- ====================================================================

-- 1. Enable pgcrypto extension for password encryption (crypt & gen_salt)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- 2. Verify roles table exists and populate roles if needed
CREATE TABLE IF NOT EXISTS public.roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure default roles exist
INSERT INTO public.roles (id, name, description)
VALUES 
  (1, 'Administrador', 'Acceso completo al sistema e inventario'),
  (2, 'User', 'Acceso estándar para operaciones diarias')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Verify profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  role_id INT REFERENCES public.roles(id) DEFAULT 2,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create or replace the secure user creation function
CREATE OR REPLACE FUNCTION public.create_new_user(
  new_email TEXT,
  new_password TEXT,
  new_full_name TEXT,
  new_username TEXT,
  new_role_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, auth, extensions
AS $$
DECLARE
  new_user_id UUID;
  target_role_id INT;
  result JSONB;
BEGIN
  -- Check if the executor is authenticated and is an Administrator
  -- (Optional, but highly recommended for security. Uncomment the block below to enforce it):
  /*
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name = 'Administrador'
  ) THEN
    RAISE EXCEPTION 'Acceso denegado: Solo los administradores pueden crear nuevos usuarios.';
  END IF;
  */

  -- 1. Get the role ID from the roles table
  SELECT id INTO target_role_id FROM public.roles WHERE name = new_role_name;
  
  IF target_role_id IS NULL THEN
    RAISE EXCEPTION 'El rol % no existe en la base de datos.', new_role_name;
  END IF;

  -- 2. Verify if the email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email) THEN
    RAISE EXCEPTION 'El correo electrónico % ya está registrado.', new_email;
  END IF;

  -- 3. Verify if the username already exists in profiles
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username) THEN
    RAISE EXCEPTION 'El nombre de usuario % ya está registrado.', new_username;
  END IF;

  -- 4. Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    phone_change_token,
    email_change_token_current,
    reauthentication_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    new_email,
    extensions.crypt(new_password, extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    json_build_object('full_name', new_full_name, 'username', new_username),
    false,
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- 4b. Insert into auth.identities to link the auth provider (required by GoTrue / Supabase Auth)
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    new_user_id,
    new_user_id,
    json_build_object('sub', new_user_id, 'email', new_email, 'email_verified', true, 'phone_verified', false)::jsonb,
    'email',
    new_user_id::text,
    now(),
    now(),
    now()
  );

  -- 5. Upsert into public.profiles
  -- Using ON CONFLICT to handle cases where an automatic trigger (on_auth_user_created)
  -- might have already inserted the profile row.
  INSERT INTO public.profiles (id, full_name, username, role_id)
  VALUES (new_user_id, new_full_name, new_username, target_role_id)
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    role_id = EXCLUDED.role_id;

  -- 6. Return success status
  RETURN json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'Usuario creado exitosamente.'
  );
END;
$$;

-- Grant execution permissions to authenticated users and anon users (if client uses it)
GRANT EXECUTE ON FUNCTION public.create_new_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- 7. Helper function to resolve username to email (with SECURITY DEFINER to bypass normal restrictions on auth.users)
CREATE OR REPLACE FUNCTION public.get_user_email(username_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT u.email INTO user_email
  FROM auth.users u
  JOIN public.profiles p ON u.id = p.id
  WHERE p.username = username_input;
  
  RETURN user_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_email(TEXT) TO anon, authenticated, service_role;

