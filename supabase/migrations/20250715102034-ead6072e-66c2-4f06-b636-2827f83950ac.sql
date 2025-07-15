
-- Créer une table pour les quotas de congés
CREATE TABLE public.vacation_quotas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vacation DECIMAL(4,2) NOT NULL DEFAULT 25,
  rtt DECIMAL(4,2) NOT NULL DEFAULT 15,
  previous_year DECIMAL(4,2) NOT NULL DEFAULT 5,
  unpaid DECIMAL(4,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Créer une table pour les périodes de congés
CREATE TABLE public.vacation_periods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vacation', 'rtt', 'previousYear', 'unpaid')),
  working_days DECIMAL(4,2) NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('full', 'morning', 'afternoon')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activer RLS sur les tables
ALTER TABLE public.vacation_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_periods ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour vacation_quotas
CREATE POLICY "Users can view their own quotas" ON public.vacation_quotas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotas" ON public.vacation_quotas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotas" ON public.vacation_quotas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotas" ON public.vacation_quotas
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour vacation_periods
CREATE POLICY "Users can view their own vacation periods" ON public.vacation_periods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vacation periods" ON public.vacation_periods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vacation periods" ON public.vacation_periods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vacation periods" ON public.vacation_periods
  FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_vacation_quotas_updated_at 
  BEFORE UPDATE ON public.vacation_quotas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vacation_periods_updated_at 
  BEFORE UPDATE ON public.vacation_periods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
