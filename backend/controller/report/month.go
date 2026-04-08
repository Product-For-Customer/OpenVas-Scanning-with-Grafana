package report

import (
	"net/http"

	"github.com/Tawunchai/openvas/config"
	"github.com/gin-gonic/gin"
)

type ReportVulnerabilityMonthDTO struct {
	TaskID        string  `json:"task_id"`
	TaskName      string  `json:"task_name"`
	IP            string  `json:"ip"`
	Month         string  `json:"month"`
	MonthNo       int     `json:"month_no"`
	Vulnerability int     `json:"vulnerability"`
	RiskScore     float64 `json:"risk_score"`
}

// GET /report/vulnerability-month
//
// Logic:
// - ใช้ latest report ต่อ host + task_name
// - คำนวณ vulnerability_total และ risk_score ต่อ asset
// - 1 row = 1 asset (task_id + task_name + ip) ในเดือนนั้น
// - frontend ค่อย aggregate เองเป็นรายเดือน
func ListDataForReportVulnerabilityMonth(c *gin.Context) {
	query := `
WITH
-- =========================================================
-- 1) หา latest report ต่อ host + task_name
-- =========================================================
LatestReportPerHostTask AS (
  SELECT DISTINCT ON (r.host, COALESCE(t.name, ''))
    r.host AS host_ip,
    rp.id AS report_id,
    rp.task AS task_id,
    COALESCE(t.name, '') AS task_name,
    rp.creation_time
  FROM public.results r
  JOIN public.reports rp
    ON rp.id = r.report
  LEFT JOIN public.tasks t
    ON t.id = rp.task
  WHERE r.host IS NOT NULL
    AND BTRIM(r.host) <> ''
  ORDER BY
    r.host,
    COALESCE(t.name, ''),
    rp.creation_time DESC,
    rp.id DESC
),

-- =========================================================
-- 2) fact ของ latest snapshot ต่อ asset
-- =========================================================
ResultFact AS (
  SELECT
    lrht.task_id::text AS task_id,
    lrht.task_name,
    lrht.host_ip,
    lrht.creation_time,
    COALESCE(r.severity, 0) AS severity
  FROM LatestReportPerHostTask lrht
  JOIN public.results r
    ON r.report = lrht.report_id
   AND r.host = lrht.host_ip
),

-- =========================================================
-- 3) aggregate ต่อ asset
--    vulnerability = จำนวน findings ทั้งหมดของ asset นั้น
--    risk_score = AVG(severity > 0) ของ asset นั้น
-- =========================================================
AssetAgg AS (
  SELECT
    rf.task_id,
    rf.task_name,
    rf.host_ip,
    rf.creation_time,

    COUNT(*)::int AS vulnerability,

    COALESCE(
      ROUND(
        AVG(
          CASE
            WHEN rf.severity > 0 THEN rf.severity
            ELSE NULL
          END
        )::numeric,
        2
      ),
      0
    )::float8 AS risk_score

  FROM ResultFact rf
  GROUP BY
    rf.task_id,
    rf.task_name,
    rf.host_ip,
    rf.creation_time
)

SELECT
  aa.task_id,
  aa.task_name,
  aa.host_ip AS ip,

  TO_CHAR(
    (
      to_timestamp(aa.creation_time)
      AT TIME ZONE 'UTC'
      AT TIME ZONE 'Asia/Bangkok'
    ),
    'Mon'
  ) AS month,

  EXTRACT(
    MONTH FROM (
      to_timestamp(aa.creation_time)
      AT TIME ZONE 'UTC'
      AT TIME ZONE 'Asia/Bangkok'
    )
  )::int AS month_no,

  aa.vulnerability,
  aa.risk_score

FROM AssetAgg aa
ORDER BY
  month_no ASC,
  aa.task_name ASC,
  aa.host_ip ASC;
`

	out := make([]ReportVulnerabilityMonthDTO, 0)

	if err := config.DB().Raw(query).Scan(&out).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if out == nil {
		out = make([]ReportVulnerabilityMonthDTO, 0)
	}

	c.JSON(http.StatusOK, out)
}