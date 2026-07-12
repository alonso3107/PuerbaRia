-- Activa Row Level Security en todas las tablas del esquema public.
-- El backend no se ve afectado: se conecta como dueno de las tablas y el
-- dueno ignora RLS. Sin politicas definidas, cualquier otro rol (por
-- ejemplo la Data API de Supabase con la anon key) queda bloqueado.
-- Se excluye flyway_schema_history: Flyway la tiene bloqueada con otra
-- conexion mientras corre esta migracion y el ALTER quedaria en espera.
DO $$
DECLARE
    tabla record;
BEGIN
    FOR tabla IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename <> 'flyway_schema_history'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tabla.tablename);
    END LOOP;
END $$;
