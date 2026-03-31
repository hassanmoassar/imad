-- Programs table
create table if not exists programs (
  id text primary key,
  title text not null,
  description text,
  summary text,
  price text,
  city text,
  capacity integer,
  start_date date,
  guide text,
  type text,
  image text,
  steps jsonb,
  images text[],
  created_at timestamptz default now()
);

-- Clients table
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  phone text,
  blocked boolean default false,
  created_at timestamptz default now()
);

-- Reservations table
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  program_id text references programs(id) on delete set null,
  status text default 'pending',
  reserved_at timestamptz default now(),
  date date,
  people integer,
  total_price numeric
);

-- Admins table (for simple admin accounts)
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text default 'staff',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_programs_city on programs(city);
create index if not exists idx_reservations_status on reservations(status);
