import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixDatabase() {
  console.log('--- STARTING DATABASE DIAGNOSIS (Anon Key) ---');

  // 1. Get all profiles
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('id, name, username');

  if (pError) {
    console.error('Error fetching profiles:', pError.message);
    if (!profiles || profiles.length === 0) return;
  }

  console.log(`Found ${profiles?.length || 0} profiles:`);
  profiles?.forEach(p => {
    console.log(`- ID: ${p.id}, Name: ${p.name}, Username: ${p.username}`);
  });

  // 2. Identify Reggie profiles
  const reggieProfiles = profiles?.filter(p => 
    p.name?.toLowerCase().includes('reggie') || 
    p.username?.toLowerCase().includes('reggie')
  ) || [];
  
  console.log('\nReggie-related profiles:');
  reggieProfiles.forEach(p => {
    console.log(`- ${p.name} (ID: ${p.id}, Username: ${p.username})`);
  });

  // 3. Try specifically to find if 'reggieambrocio1993' exists
  const target = profiles?.find(p => p.username === 'reggieambrocio1993');
  if (target) {
    console.log(`\nFound exact username match for 'reggieambrocio1993': ${target.name} (${target.id})`);
  } else {
    console.log(`\nNo profile has the username 'reggieambrocio1993'.`);
  }

  // 4. Check old items
  const { data: items } = await supabase.from('portfolio_items').select('*');
  console.log(`\nFound ${items?.length || 0} items in old portfolio_items table.`);
  if (items && items.length > 0) {
    const owners = [...new Set(items.map(i => i.profile_id))];
    console.log('Unique owners in old table:', owners);
  }

  console.log('--- FINISHED ---');
}

fixDatabase();
