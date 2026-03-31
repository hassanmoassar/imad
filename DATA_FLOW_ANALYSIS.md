# Data Flow Analysis & Issues

## Current Architecture Issues

### 🔴 CRITICAL ISSUES FOUND

#### 1. **Program Display is 100% Hardcoded**
- **File**: `/app/program/page.tsx` (Lines 1-291)
  - Hardcoded static program: "Sahara Desert 3-Day Tour"
  - Hardcoded price: $299
  - Never fetches from database
  - Category filtering doesn't work because data is hardcoded

- **File**: `/app/program/[id]/page.tsx` (Lines 1-519)
  - Contains mock `programsData` object with hardcoded entries:
    - `sahara-3day`
    - `marrakech-atlas`
    - And others...
  - Never fetches from Supabase
  - Uses slug-based ID lookup in hardcoded data, NOT database ID

**Impact**: Admin-added programs NEVER appear on website because they're ignored in favor of hardcoded data

---

#### 2. **No Reservation Form on Public Website**
- **File**: `/app/program/page.tsx`
  - Has booking form UI (date picker, guest count)
  - "Book Now" button is non-functional
  - No submission logic
  - No connection to database

- **File**: `/app/program/[id]/page.tsx`
  - Has "Book Now" button
  - No form submission handling
  - No reservation creation logic
  - No validation

**Impact**: Website visitors cannot submit reservations. Form data is never captured or saved.

---

#### 3. **Admin Program Creation → Database ✓ (Working)**
- **File**: `/app/admin/programs/create/page.tsx`
  - Correctly saves to `programs` table with:
    - `title`, `description`, `category`, `price_per_person`, `image`, `steps`
  - Uploads images to Supabase Storage
  - Categories: 'transfers', 'excursions', 'tour-circuits'
  - **Status**: ✓ Works correctly

---

#### 4. **Admin Reservations Display ✓ (Working)**
- **File**: `/app/admin/reservations/page.tsx` (Recently updated)
  - Correctly fetches from `reservations` table
  - Shows submitted reservations
  - Status update functionality working
  - **Status**: ✓ Works correctly
  - **But**: No reservations appear because public form doesn't exist

---

## Data Flow Diagram

### Current (Broken) Flow

```
ADMIN SIDE:
Admin Program Form → Supabase DB ✓
                ↓
            Database
                ↑
         NO CONNECTION ✗

PUBLIC SIDE:
Website Programs Page → Hardcoded Data (WRONG) ✗
Website Program Detail → Hardcoded Data (WRONG) ✗
Website Reservation Form → NO SUBMISSION LOGIC ✗
                ↓
            Database (Never reaches)
                ↑
         NO CONNECTION ✗

ADMIN DASHBOARD:
Reservations Page → Supabase DB ✓ (But always empty)
```

### Required (Fixed) Flow

```
ADMIN SIDE:
Admin Program Form → Supabase DB (programs table) ✓
                ↓
            programs table
                ↑
   Website Fetches (FIX NEEDED)

PUBLIC SIDE:
Website Programs Page → Supabase DB (fetch with category filter) ✓
Website Program Detail → Supabase DB (fetch by ID) ✓
Website Reservation Form → Submit to Supabase DB ✓
                ↓
        reservations table
                ↑
       Admin Fetches ✓

ADMIN DASHBOARD:
Reservations Page → Supabase DB (reservations table) ✓
```

---

## Files to Fix

| File | Issue | Fix |
|------|-------|-----|
| `/app/program/page.tsx` | Hardcoded program "Sahara Desert" | Already working! Delete hardcoded data |
| `/app/program/[id]/page.tsx` | Hardcoded mock programs | Replace with dynamic fetch by ID |
| `/app/program/[id]/page.tsx` | "Book Now" button non-functional | Add reservation form submission |
| `/app/admin/programs/create/page.tsx` | ✓ Working correctly | No changes needed |
| `/app/admin/reservations/page.tsx` | ✓ Fetching correctly | No changes needed |
| `/app/admin/reservations/create/page.tsx` | ✓ Form working | Verify still working |

---

## Step-by-Step Fix Plan

### Step 1: Fix Dynamic Program Detail Page
**File**: `/app/program/[id]/page.tsx`
- Remove hardcoded `programsData` object
- Fetch program from Supabase by ID in useEffect
- Display dynamic data: title, description, price, image, steps
- Add proper loading/error states

### Step 2: Add Reservation Form Submission
**File**: `/app/program/[id]/page.tsx`
- Make "Book Now" button functional
- Create form with: customer_name, customer_email, customer_phone, number_of_persons
- On submit: Create record in `reservations` table
- Show success/error messages
- Redirect to confirmation page

### Step 3: Remove Redundant Static Page
**File**: `/app/program/page.tsx`
- This page displays already-working list with database fetch
- Keep as is ✓

---

## Expected Results After Fixes

✅ Admin adds program with category → Appears on website within seconds  
✅ Website visitor books program → Appears in admin dashboard within seconds  
✅ No hardcoded data anywhere  
✅ All data flows from database  
✅ Bidirectional integration working  

---

## Testing Checklist

- [ ] Admin creates new program with category
- [ ] Navigate to /programs
- [ ] New program appears in list with correct category
- [ ] Click program to view details
- [ ] Program details load from database
- [ ] Fill and submit booking form
- [ ] Visit admin dashboard → reservations tab
- [ ] New booking appears in admin panel
