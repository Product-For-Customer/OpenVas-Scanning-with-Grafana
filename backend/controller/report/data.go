package report

import (
	"net/http"
	"strings"

	"github.com/Tawunchai/openvas/config"
	"github.com/gin-gonic/gin"
)

type CriticalForReportDTO struct {
	TaskName            string  `json:"task_name"`
	IP                  string  `json:"ip"`
	VulnerabilityName   string  `json:"vulnerability_name"`
	VulnerabilityFamily string  `json:"vulnerability_family"`
	Level               string  `json:"level"`
	Summary             string  `json:"summary"`
	Insight             string  `json:"insight"`
	CVEList             string  `json:"cve_list"`
	Severity            float64 `json:"severity"`
}

// GET /reports/critical
// Optional query:
//   - task_id=3
//   - limit=50
func ListCriticalForReport(c *gin.Context) {
	db := config.DB()

	taskID := strings.TrimSpace(c.Query("task_id"))
	limit := strings.TrimSpace(c.DefaultQuery("limit", "50"))

	query := `
WITH FilteredTasks AS (
    SELECT
        t.id::text AS task_id,
        t.name AS task_name
    FROM public.tasks t
    WHERE ($1 = '' OR t.id::text = $1)
),

LatestReportPerTask AS (
    SELECT DISTINCT ON (rp.task)
        rp.task::text AS task_id,
        rp.id AS report_id,
        rp.creation_time
    FROM public.reports rp
    JOIN FilteredTasks ft
      ON ft.task_id = rp.task::text
    ORDER BY rp.task, rp.creation_time DESC
),

Fact AS (
    SELECT
        ft.task_name,
        COALESCE(NULLIF(BTRIM(r.host), ''), 'N/A') AS ip,
        r.nvt AS nvt_oid,
        ROUND(COALESCE(r.severity, 0)::numeric, 2)::float8 AS severity,

        COALESCE(NULLIF(BTRIM(n.name), ''), r.nvt::text, 'N/A') AS vulnerability_name,
        COALESCE(NULLIF(BTRIM(n.family), ''), 'N/A') AS vulnerability_family,

        NULLIF(BTRIM(n.summary), '') AS summary,
        NULLIF(BTRIM(n.insight), '') AS insight,
        NULLIF(BTRIM(n.tag), '') AS tag_text

    FROM public.results r
    JOIN LatestReportPerTask lr
      ON r.report = lr.report_id
    JOIN FilteredTasks ft
      ON ft.task_id = lr.task_id
    LEFT JOIN public.nvts n
      ON n.oid = r.nvt
    WHERE r.nvt IS NOT NULL
      AND COALESCE(r.severity, 0) >= 9.0
),

TagParsed AS (
    SELECT
        f.*,
        NULLIF((regexp_match(COALESCE(f.tag_text, ''), '(^|[|;])summary=([^|;]+)'))[2], '') AS tag_summary,
        NULLIF((regexp_match(COALESCE(f.tag_text, ''), '(^|[|;])insight=([^|;]+)'))[2], '') AS tag_insight
    FROM Fact f
),

DistinctCVERefs AS (
    SELECT DISTINCT
        vr.vt_oid AS nvt_oid,
        UPPER(BTRIM(vr.ref_id)) AS cve_id
    FROM public.vt_refs vr
    WHERE LOWER(BTRIM(vr.type)) = 'cve'
      AND vr.ref_id IS NOT NULL
      AND BTRIM(vr.ref_id) <> ''
      AND UPPER(BTRIM(vr.ref_id)) ~ '^CVE-\d{4}-\d+$'
),

RankedCVERefs AS (
    SELECT
        d.nvt_oid,
        d.cve_id,
        ROW_NUMBER() OVER (
            PARTITION BY d.nvt_oid
            ORDER BY d.cve_id
        ) AS rn
    FROM DistinctCVERefs d
),

CVEListPerNVT AS (
    SELECT
        r.nvt_oid,
        STRING_AGG(r.cve_id, ', ' ORDER BY r.cve_id) AS cve_list
    FROM RankedCVERefs r
    WHERE r.rn <= 3
    GROUP BY r.nvt_oid
)

SELECT
    tp.task_name,
    tp.ip,
    tp.vulnerability_name,
    tp.vulnerability_family,
    'Critical' AS level,
    COALESCE(tp.summary, tp.tag_summary, 'N/A') AS summary,
    COALESCE(tp.insight, tp.tag_insight, 'N/A') AS insight,
    COALESCE(ca.cve_list, 'N/A') AS cve_list,
    tp.severity
FROM TagParsed tp
LEFT JOIN CVEListPerNVT ca
  ON ca.nvt_oid = tp.nvt_oid
ORDER BY
    tp.severity DESC,
    tp.task_name ASC,
    tp.ip ASC,
    tp.vulnerability_name ASC
LIMIT COALESCE(NULLIF($2, '')::int, 50);
`

	var out []CriticalForReportDTO
	if err := db.Raw(query, taskID, limit).Scan(&out).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to load critical findings for report",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  out,
		"count": len(out),
	})
}