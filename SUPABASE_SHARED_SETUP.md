# 🔗 BhoomiX Main & Partner App - Shared Backend Setup Guide

This guide explains how to connect **BhoomiX Main** (this app) and **BhoomiX Partner** using a shared Supabase backend for real-time order delivery tracking.

---

## 📋 What's Already Set Up in BhoomiX Main

✅ **Database Tables:**
- `orders` - Now includes GPS coordinates (`gps_lat`, `gps_lng`) and partner assignment (`assigned_partner`)
- `partners` - New table for delivery partner profiles
- `profiles` - User profiles for farmers/shop owners

✅ **Features:**
- Auto-capture GPS location when placing orders
- Realtime database updates enabled on orders table
- RLS policies for secure data access
- Partner Orders page at `/partner-orders` (demo)

---

## 🎯 Current Supabase Project Details

**Project ID:** `psqrmrusmgacxtgsqvwg`

**Supabase URL:** `https://psqrmrusmgacxtgsqvwg.supabase.co`

**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcXJtcnVzbWdhY3h0Z3NxdndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDUzOTgsImV4cCI6MjA3ODUyMTM5OH0.1IZeor-MvUJHKZp84OjAhD51PQpE5csDBzHM7ZwU530`

---

## 🚀 How to Connect BhoomiX Partner App

### Option 1: If Building a Separate Partner App

1. **Create a new project** for "BhoomiX Partner".

2. **Connect to Same Supabase Project:**
   - In the new project, go to Settings → Integrations
   - Choose "Connect Existing Supabase Project"
   - Enter the Project URL and Anon Key from above

3. **Use the Same Auth System:**
   - Partners will sign up/login using the same Supabase Auth
   - Optionally create a `partners` profile entry for each delivery partner

4. **Build Partner UI:**
   - Fetch orders where `status = 'pending'`
   - Show "Accept Order" button
   - Update order with `assigned_partner` and `status = 'accepted'`
   - Use GPS coordinates to open Google Maps navigation

### Option 2: If Building Standalone Partner App

1. **Install Supabase Client:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Initialize Supabase:**
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(
     'https://psqrmrusmgacxtgsqvwg.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Use the Anon Key
   )
   ```

3. **Fetch Pending Orders:**
   ```typescript
   const { data: orders } = await supabase
     .from('orders')
     .select('*')
     .eq('status', 'pending')
     .order('created_at', { ascending: false })
   ```

4. **Accept an Order:**
   ```typescript
   const { error } = await supabase
     .from('orders')
     .update({ 
       status: 'accepted',
       assigned_partner: partner_user_id 
     })
     .eq('id', order_id)
   ```

5. **Enable Realtime Updates:**
   ```typescript
   supabase
     .channel('orders')
     .on('postgres_changes', 
       { event: '*', schema: 'public', table: 'orders' },
       (payload) => {
         console.log('Order updated:', payload)
         refreshOrders()
       }
     )
     .subscribe()
   ```

---

## 🗺️ GPS Navigation Integration

When an order has GPS coordinates, open Google Maps:

```typescript
const navigateToCustomer = (lat: number, lng: number) => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    '_blank'
  )
}
```

---

## 🔐 Security & Permissions

### Row-Level Security (RLS) is Enabled:

**Farmers/Customers can:**
- Insert their own orders
- View their own orders
- Update their own orders

**Partners can:**
- View pending orders
- View orders assigned to them
- Update orders (accept/complete)

### To Register as a Partner:

Insert a record in the `partners` table:

```typescript
const { error } = await supabase
  .from('partners')
  .insert({
    user_id: auth_user_id,
    full_name: 'Partner Name',
    phone_number: '9876543210',
    vehicle_type: 'Bike',
    is_active: true
  })
```

---

## 📊 Database Schema

### `orders` Table
```
- id (uuid)
- user_id (uuid) - Customer who placed order
- order_number (text)
- items (jsonb) - Array of product objects
- total_amount (integer)
- status (text) - 'pending', 'accepted', 'in_transit', 'delivered'
- delivery_address (text, nullable)
- phone_number (text, nullable)
- gps_lat (numeric, nullable) - Live GPS latitude
- gps_lng (numeric, nullable) - Live GPS longitude
- assigned_partner (uuid, nullable) - Partner user ID
- created_at (timestamp)
- updated_at (timestamp)
```

### `partners` Table
```
- id (uuid)
- user_id (uuid) - References auth.users
- full_name (text)
- phone_number (text, nullable)
- vehicle_type (text, nullable)
- is_active (boolean) - Whether partner is active
- created_at (timestamp)
- updated_at (timestamp)
```

---

## 🎬 Complete Workflow

1. **Customer places order** in BhoomiX Main
   - GPS location auto-captured
   - Order saved with `status = 'pending'`

2. **Partner sees new order** in BhoomiX Partner (realtime)
   - Order appears instantly via Supabase Realtime
   - Shows customer location, items, total amount

3. **Partner accepts order**
   - Order updated to `status = 'accepted'`
   - `assigned_partner` set to partner's user ID

4. **Partner navigates to customer**
   - Opens Google Maps with GPS coordinates
   - Delivers the order

5. **Partner marks complete**
   - Update order to `status = 'delivered'`
   - Customer sees status update in their orders list

---

## 🧪 Testing the Integration

**In BhoomiX Main (this app):**
- Visit `/partner-orders` to see the demo partner view
- Place an order in AgriMarket to test GPS capture

**Check Realtime:**
- Open both apps side by side
- Place order in Main app
- Should appear instantly in Partner app

---

## 🌟 Highlights

✅ **Real-time sync** - Orders appear instantly without refresh
✅ **Live GPS tracking** - Navigate directly to customer location
✅ **Secure** - RLS ensures partners only see appropriate orders
✅ **Built by our team** - Including Yashasvi AI for agri insights
✅ **10-15 minute delivery** - Fast local delivery system

---

## 📞 Support

For issues or questions, check:
- Supabase dashboard at https://supabase.com/dashboard
- View backend logs and data
- Monitor realtime connections

---

**Built with ❤️ for rural delivery tracking**
