import { supabaseAdmin } from '@/lib/supabase_admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // 1. Check if the user exists in profiles to identify their role and data
    const { data: profile, error: profileFetchError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (profileFetchError && profileFetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileFetchError)
    }

    // 2. Cleanup Public Data (Order matters for foreign keys)
    
    // - Delete Applications
    await supabaseAdmin.from('applications').delete().eq('seeker_id', userId)
    
    // - Delete Jobs (if they are a hirer)
    // Note: If they have jobs, we should delete them. 
    // This will trigger cascade delete for applications if set in DB.
    await supabaseAdmin.from('jobs').delete().eq('hirer_id', userId)

    // - Delete Conversations & Messages
    // Since messages reference conversation_id ON DELETE CASCADE, 
    // we only need to delete the conversations.
    await supabaseAdmin.from('conversations')
      .delete()
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)

    // - Delete Portfolio Items
    await supabaseAdmin.from('portfolio_items').delete().eq('profile_id', userId)

    // - Delete Escrows & Disputes (optional? maybe keep for financial records? 
    // but user wants TOTAL delete, so we should clean up)
    await supabaseAdmin.from('escrows').delete().or(`hirer_id.eq.${userId},seeker_id.eq.${userId}`)

    // 3. Delete Profile (This should be done before auth delete if no cascade exists)
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileDeleteError) {
      console.error('Profile delete error:', profileDeleteError)
    }

    // 4. Finally, Delete the User from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      // If auth delete fails (maybe user doesn't exist in auth anymore but still in profiles)
      // we still return success if profile was cleaned up or at least log the error.
      console.error('Auth delete error:', authError)
      if (authError.message !== 'User not found') {
          return NextResponse.json({ error: `Auth deletion failed: ${authError.message}` }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Account and all related data have been totally removed.' 
    })

  } catch (error: any) {
    console.error('Global delete error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
