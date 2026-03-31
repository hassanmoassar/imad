# Reservations & Enhanced Programs Setup Guide

## Overview

This guide explains the new features added to the admin panel:

1. **Enhanced Program Form** - Add category and price per person
2. **Reservation Management CRUD** - Create, read, update, and delete reservations

## Step 1: Update Database Schema

Go to your **Supabase SQL Editor** and run the SQL from `SETUP_RESERVATIONS.sql`:

```sql
-- Add missing columns to programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'transfers',
ADD COLUMN IF NOT EXISTS price_per_person DECIMAL(10, 2) DEFAULT 0;

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  program_title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  number_of_persons INTEGER NOT NULL CHECK (number_of_persons > 0),
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated insert on reservations"
ON reservations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated select on reservations"
ON reservations FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on reservations"
ON reservations FOR UPDATE USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on reservations"
ON reservations FOR DELETE USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reservations_program_id ON reservations(program_id);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
```

## Step 2: Enhanced Program Form

### Location
`/admin/programs/create`

### New Fields
- **Service Category** - Select from:
  - Transfers
  - Excursions
  - Tour Circuits
- **Price per Person** - Price in USD (decimal format)

### Example
```
Title: Marrakech Desert Adventure
Category: Excursions
Price per Person: 99.99
Description: Experience the magic of the Sahara...
```

## Step 3: Reservation Management

### List Reservations
**URL:** `/admin/reservations`

**Features:**
- View all reservations in a table
- Sort by date (newest first)
- Change reservation status (Pending → Confirmed → Cancelled)
- Edit or delete reservations
- Quick access to customer information

### Create Reservation
**URL:** `/admin/reservations/create`

**Fields:**
- Program (dropdown - shows price per person)
- Customer Name
- Customer Email
- Customer Phone
- Number of Persons
- **Auto-calculated Total Price** (price per person × persons)

### Edit Reservation
**URL:** `/admin/reservations/:id/edit`

**Features:**
- Modify any reservation detail
- Update customer information
- Change program or number of persons
- Total price automatically recalculates

### Delete Reservation
**Action:** Click "Delete" button in the reservations table
- Confirmation dialog before deletion
- Permanently removes the reservation

## Reservation Status Flow

| Status | Meaning | Color |
|--------|---------|-------|
| **Pending** | Awaiting confirmation | Yellow |
| **Confirmed** | Approved and confirmed | Green |
| **Cancelled** | Reservation cancelled | Red |

## Sidebar Navigation

The admin sidebar now includes:
- 📊 Dashboard
- 🎫 Programs
- ➕ Add Program
- **📅 Reservations** ← NEW
- 🏠 Back to Site

## Database Schema

### Programs Table (Updated)
```
id: TEXT (primary key)
title: TEXT
description: TEXT
category: TEXT (transfers, excursions, tour-circuits)
price_per_person: DECIMAL(10, 2)
image: TEXT
steps: JSONB
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Reservations Table (New)
```
id: TEXT (primary key)
program_id: TEXT (foreign key → programs)
program_title: TEXT
customer_name: TEXT
customer_email: TEXT
customer_phone: TEXT
number_of_persons: INTEGER
total_price: DECIMAL(10, 2)
status: TEXT (pending, confirmed, cancelled)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

## Testing Checklist

- [ ] Database schema updated with new columns and tables
- [ ] Can create a program with category and price
- [ ] Can view programs in the list
- [ ] Can access `/admin/reservations`
- [ ] Can create a new reservation
- [ ] Total price auto-calculates correctly
- [ ] Can edit a reservation
- [ ] Can change reservation status
- [ ] Can delete a reservation (with confirmation)
- [ ] Sidebar shows Reservations link

## Workflow Example

1. **Admin creates a program:**
   - Title: "Casablanca City Tour"
   - Category: "Tour Circuits"
   - Price per person: $150.00
   - Description: "Explore the modern city..."

2. **Customer books the program:**
   - Go to `/admin/reservations/create`
   - Select "Casablanca City Tour"
   - Enter customer: "Ahmed Hassan"
   - Number of persons: 3
   - **Total price auto-calculates: $450.00**

3. **Admin manages reservation:**
   - View all reservations at `/admin/reservations`
   - Change status: Pending → Confirmed
   - Customer can proceed with payment

## API Endpoints Used

- `GET /reservations` - Fetch all reservations
- `POST /reservations` - Create new reservation
- `UPDATE /reservations` - Update reservation (status, details)
- `DELETE /reservations` - Delete reservation
- `GET /programs` - Fetch programs with pricing

## Security Notes

- ✅ RLS policies enabled for authenticated users only
- ✅ Foreign key constraint on program_id
- ✅ Number of persons validated (> 0)
- ✅ Status restricted to valid values
- ✅ Soft-delete not implemented (permanent deletion)

## Future Enhancements

- [ ] Customer portal to view/manage their own reservations
- [ ] Automated email confirmations
- [ ] Payment integration
- [ ] Availability calendar
- [ ] Discount codes
- [ ] Group discounts
- [ ] Export reservations to CSV/PDF

## Troubleshooting

### "Table 'reservations' does not exist"
**Solution:** Run the SQL setup script in Supabase SQL Editor

### "Column 'category' does not exist"
**Solution:** Update programs table with new columns using the ALTER TABLE statement

### Can't create reservation
**Solution:** Make sure:
1. Programs table has price_per_person column
2. Reservations table exists
3. RLS policies are enabled for authenticated users
4. You're logged in as admin

### Prices not calculating
**Solution:** Ensure price_per_person is a DECIMAL type, not TEXT
