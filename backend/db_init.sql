DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_roles WHERE rolname = 'pbi'
    ) THEN
        CREATE ROLE pbi WITH LOGIN SUPERUSER CREATEDB CREATEROLE INHERIT REPLICATION BYPASSRLS PASSWORD 'Pbi12345';
    ELSE
        ALTER ROLE pbi WITH LOGIN SUPERUSER CREATEDB CREATEROLE INHERIT REPLICATION BYPASSRLS PASSWORD 'Pbi12345';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE gvmd TO pbi;
GRANT USAGE ON SCHEMA public TO pbi;
GRANT CREATE ON SCHEMA public TO pbi;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pbi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pbi;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO pbi;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pg_read_all_data') THEN
        GRANT pg_read_all_data TO pbi;
    END IF;
END
$$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pg_write_all_data') THEN
        GRANT pg_write_all_data TO pbi;
    END IF;
END
$$;

DO $$
DECLARE
    s RECORD;
BEGIN
    FOR s IN
        SELECT schema_name FROM information_schema.schemata
        WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
          AND schema_name NOT LIKE 'pg_toast%'
    LOOP
        EXECUTE format('GRANT USAGE ON SCHEMA %I TO pbi', s.schema_name);
        EXECUTE format('GRANT CREATE ON SCHEMA %I TO pbi', s.schema_name);
        EXECUTE format('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA %I TO pbi', s.schema_name);
        EXECUTE format('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA %I TO pbi', s.schema_name);
        EXECUTE format('GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA %I TO pbi', s.schema_name);
    END LOOP;
END
$$;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO pbi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO pbi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO pbi;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT rolname FROM pg_roles
        WHERE rolname IN ('postgres', 'gvmd', 'gvm', 'pbi')
    LOOP
        EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO pbi', r.rolname);
        EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO pbi', r.rolname);
        EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO pbi', r.rolname);
    END LOOP;
END
$$;

DO $$
BEGIN
    IF to_regclass('public.tasks')      IS NOT NULL THEN GRANT ALL PRIVILEGES ON TABLE public.tasks      TO pbi; END IF;
    IF to_regclass('public.targets')    IS NOT NULL THEN GRANT ALL PRIVILEGES ON TABLE public.targets    TO pbi; END IF;
    IF to_regclass('public.reports')    IS NOT NULL THEN GRANT ALL PRIVILEGES ON TABLE public.reports    TO pbi; END IF;
    IF to_regclass('public.results')    IS NOT NULL THEN GRANT ALL PRIVILEGES ON TABLE public.results    TO pbi; END IF;
    IF to_regclass('public.nvts')       IS NOT NULL THEN GRANT ALL PRIVILEGES ON TABLE public.nvts       TO pbi; END IF;
    IF to_regclass('public.hosts')      IS NOT NULL THEN GRANT ALL PRIVILEGES ON TABLE public.hosts      TO pbi; END IF;
    IF to_regclass('public.port_lists') IS NOT NULL THEN GRANT ALL PRIVILEGES ON TABLE public.port_lists TO pbi; END IF;
END
$$;

DO $$
BEGIN
    IF to_regclass('public.tasks') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS trigger_scan_running ON public.tasks;
        DROP TRIGGER IF EXISTS trigger_scan_status_notify ON public.tasks;
    END IF;
END
$$;

DROP FUNCTION IF EXISTS public.notify_scan_running();
DROP FUNCTION IF EXISTS public.notify_scan_status();

CREATE FUNCTION public.notify_scan_status()
RETURNS trigger AS $function$
BEGIN
    IF NEW.run_status = 4 AND OLD.run_status IS DISTINCT FROM 4 THEN
        PERFORM pg_notify('scan_started', json_build_object('task_id', NEW.id, 'task_name', NEW.name, 'status', 'Running', 'run_status', NEW.run_status)::text);
    END IF;
    IF NEW.run_status = 12 AND OLD.run_status IS DISTINCT FROM 12 THEN
        PERFORM pg_notify('scan_stopped', json_build_object('task_id', NEW.id, 'task_name', NEW.name, 'status', 'Stopped', 'run_status', NEW.run_status)::text);
    END IF;
    IF NEW.run_status = 1 AND OLD.run_status IS DISTINCT FROM 1 THEN
        PERFORM pg_notify('scan_done', json_build_object('task_id', NEW.id, 'task_name', NEW.name, 'status', 'Done', 'run_status', NEW.run_status)::text);
    END IF;
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF to_regclass('public.tasks') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS trigger_scan_status_notify ON public.tasks;
        CREATE TRIGGER trigger_scan_status_notify
        AFTER UPDATE ON public.tasks
        FOR EACH ROW EXECUTE FUNCTION public.notify_scan_status();
    END IF;
END
$$;
