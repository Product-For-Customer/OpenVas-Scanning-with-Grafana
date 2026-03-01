-- db.sql
-- ใช้กับ service db-init เพื่อเตรียม PostgreSQL สำหรับ backend/grafana/query + trigger notify

-- =========================================================
-- 1) CREATE ROLE pbi (ถ้ายังไม่มี) + ตั้งรหัสผ่านให้ตรงกับ backend
-- =========================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'pbi'
    ) THEN
        CREATE ROLE pbi WITH LOGIN PASSWORD 'Pbi12345';
    ELSE
        -- เผื่อมี role อยู่แล้ว แต่รหัสผ่านเปลี่ยนในอนาคต
        ALTER ROLE pbi WITH LOGIN PASSWORD 'Pbi12345';
    END IF;
END
$$;

-- =========================================================
-- 2) Grant สิทธิ์สำหรับอ่านข้อมูล (backend/grafana/query)
-- =========================================================
GRANT CONNECT ON DATABASE gvmd TO pbi;
GRANT USAGE ON SCHEMA public TO pbi;

-- ให้สิทธิ์อ่านทุกตาราง/sequence ที่มีอยู่ใน schema public ตอนนี้
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pbi;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO pbi;

-- ✅ Grant แบบเจาะจงตารางสำคัญที่ backend ใช้งาน
-- เผื่อบางกรณี table ถูก recreate / restore / owner เปลี่ยน
GRANT SELECT ON TABLE public.tasks TO pbi;
GRANT SELECT ON TABLE public.targets TO pbi;
GRANT SELECT ON TABLE public.reports TO pbi;
GRANT SELECT ON TABLE public.results TO pbi;
GRANT SELECT ON TABLE public.nvts TO pbi;

-- ถ้ามีตารางอื่นที่ backend ใช้อ่านบ่อย จะใส่เพิ่มตรงนี้ได้
-- ตัวอย่าง:
-- GRANT SELECT ON TABLE public.hosts TO pbi;
-- GRANT SELECT ON TABLE public.port_lists TO pbi;

-- =========================================================
-- 3) Default privileges สำหรับ object ใหม่ในอนาคต
-- หมายเหตุ: คำสั่งนี้มีผลกับ object ใหม่ที่ถูกสร้าง "โดย role ที่รันคำสั่งนี้"
-- =========================================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO pbi;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON SEQUENCES TO pbi;

-- =========================================================
-- 4) ลบทริกเกอร์/ฟังก์ชันเก่า (ของเดิม)
-- =========================================================
DROP TRIGGER IF EXISTS trigger_scan_running ON public.tasks;
DROP TRIGGER IF EXISTS trigger_scan_status_notify ON public.tasks;

DROP FUNCTION IF EXISTS public.notify_scan_running();
DROP FUNCTION IF EXISTS public.notify_scan_status();

-- =========================================================
-- 5) สร้างฟังก์ชัน notify scan status ใหม่
-- =========================================================
CREATE FUNCTION public.notify_scan_status()
RETURNS trigger AS $function$
BEGIN
    -- ✅ RUNNING = 4
    IF NEW.run_status = 4 AND OLD.run_status IS DISTINCT FROM 4 THEN
        PERFORM pg_notify(
            'scan_started',
            json_build_object(
                'task_id', NEW.id,
                'task_name', NEW.name,
                'status', 'Running',
                'run_status', NEW.run_status
            )::text
        );
    END IF;

    -- ✅ STOPPED = 12
    IF NEW.run_status = 12 AND OLD.run_status IS DISTINCT FROM 12 THEN
        PERFORM pg_notify(
            'scan_stopped',
            json_build_object(
                'task_id', NEW.id,
                'task_name', NEW.name,
                'status', 'Stopped',
                'run_status', NEW.run_status
            )::text
        );
    END IF;

    -- ✅ DONE = 1
    IF NEW.run_status = 1 AND OLD.run_status IS DISTINCT FROM 1 THEN
        PERFORM pg_notify(
            'scan_done',
            json_build_object(
                'task_id', NEW.id,
                'task_name', NEW.name,
                'status', 'Done',
                'run_status', NEW.run_status
            )::text
        );
    END IF;

    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

-- =========================================================
-- 6) สร้าง trigger ใหม่ (ตัวเดียว)
-- =========================================================
CREATE TRIGGER trigger_scan_status_notify
AFTER UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.notify_scan_status();

-- =========================================================
-- 7) แสดงผลยืนยันใน log db-init
-- =========================================================
DO $$
BEGIN
    RAISE NOTICE 'db.sql init completed: role pbi + grants + trigger_scan_status_notify';
END
$$;