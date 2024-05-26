from supabase import create_client, Client
import os

supabase_url = os.getenv('PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('PUBLIC_SUPABASE_ANON_KEY')

supabase: Client = create_client(supabase_url, supabase_key)
