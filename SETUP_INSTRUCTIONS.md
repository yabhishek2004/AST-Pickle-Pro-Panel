# Pickle Pro Panel - Setup Instructions

## Issue Identified: Add Product Button Not Working

The "Add Product" button is not working because the Supabase database connection is not configured. Here's how to fix it:

## Quick Fix

1. **Create a Supabase Project** (if you don't have one):
   - Go to [supabase.com](https://supabase.com)
   - Sign up/Login and create a new project
   - Note down your project URL and anon key

2. **Configure Environment Variables**:
   - Create a `.env` file in the project root
   - Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

3. **Set up the Database**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration file: `supabase/migrations/20251019104740_create_pickle_business_schema.sql`
   - This will create all necessary tables (products, customers, orders, order_items)

## Current Status

✅ **npm is installed** (version 10.9.3)  
✅ **Dependencies are installed** (288 packages)  
✅ **Dev server works** (running on http://localhost:5173/)  
❌ **Database connection missing** (Supabase not configured)

## What's Working

- The React application loads successfully
- The UI components are rendered
- The "Add Product" button appears and opens the modal
- The form validation works

## What's Not Working

- Database operations (fetching, adding, editing, deleting products)
- The modal form submission fails silently
- No products are displayed because database queries fail

## Next Steps

1. Set up Supabase project and get credentials
2. Create `.env` file with proper credentials
3. Run the database migration
4. Restart the dev server
5. Test the "Add Product" functionality

## Testing the Fix

After setting up Supabase:
1. Open http://localhost:5173/
2. Navigate to the Products page
3. Click "Add Product" button
4. Fill in the form and submit
5. The product should be saved and appear in the list

## Files Modified

- `src/lib/supabase.ts` - Added fallback values and warning messages
- `src/components/Products.tsx` - Added better error handling
- Created `.env.example` - Template for environment variables
