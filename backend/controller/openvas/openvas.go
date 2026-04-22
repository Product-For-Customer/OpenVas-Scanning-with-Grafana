package openvas

import (
	"context"
	"encoding/xml"
	"fmt"
	"net/http"
	"os/exec"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type OpenVASController struct{}

func NewOpenVASController() *OpenVASController {
	return &OpenVASController{}
}

type StartTaskResponse struct {
	Status        string `json:"status"`
	Message       string `json:"message"`
	TaskID        string `json:"task_id"`
	ReportID      string `json:"report_id,omitempty"`
	GMPStatus     string `json:"gmp_status,omitempty"`
	GMPStatusText string `json:"gmp_status_text,omitempty"`
	RawResponse   string `json:"raw_response,omitempty"`
}

type TaskStatusResponse struct {
	Status        string `json:"status"`
	Message       string `json:"message"`
	TaskID        string `json:"task_id"`
	TaskName      string `json:"task_name,omitempty"`
	ScanStatus    string `json:"scan_status,omitempty"`
	Progress      string `json:"progress,omitempty"`
	LastReportID  string `json:"last_report_id,omitempty"`
	GMPStatus     string `json:"gmp_status,omitempty"`
	GMPStatusText string `json:"gmp_status_text,omitempty"`
	RawResponse   string `json:"raw_response,omitempty"`
}

type gmpStartTaskEnvelope struct {
	XMLName xml.Name             `xml:"start_task_response"`
	Status  string               `xml:"status,attr"`
	Text    string               `xml:"status_text,attr"`
	Report  gmpStartTaskReportID `xml:"report_id"`
}

type gmpStartTaskReportID struct {
	Value string `xml:",chardata"`
}

type gmpGetTasksEnvelope struct {
	XMLName xml.Name      `xml:"get_tasks_response"`
	Status  string        `xml:"status,attr"`
	Text    string        `xml:"status_text,attr"`
	Task    gmpTaskStatus `xml:"task"`
}

type gmpTaskStatus struct {
	ID       string            `xml:"id,attr"`
	Name     string            `xml:"name"`
	Status   string            `xml:"status"`
	Progress string            `xml:"progress"`
	LastRpt  gmpTaskLastReport `xml:"last_report>report"`
}

type gmpTaskLastReport struct {
	ID string `xml:"id,attr"`
}

const (
	openvasUsername = "admin"
	openvasPassword = "admin"
	openvasSocket   = "/run/gvmd/gvmd.sock"
	openvasTimeout  = 120
)

func (o *OpenVASController) StartTask(c *gin.Context) {
	taskID := strings.TrimSpace(c.Param("task_id"))
	if taskID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "task_id is required",
		})
		return
	}

	rawXML := fmt.Sprintf(`<start_task task_id="%s"/>`, xmlEscape(taskID))

	output, err := runGVMCLI(c.Request.Context(), rawXML)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "failed to start task",
			"error":   err.Error(),
		})
		return
	}

	var parsed gmpStartTaskEnvelope
	if err := xml.Unmarshal([]byte(output), &parsed); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":       "error",
			"message":      "cannot parse GMP start_task response",
			"task_id":      taskID,
			"raw_response": output,
			"error":        err.Error(),
		})
		return
	}

	ok := strings.HasPrefix(parsed.Status, "2")
	if !ok {
		c.JSON(http.StatusBadRequest, StartTaskResponse{
			Status:        "error",
			Message:       "openvas rejected start_task",
			TaskID:        taskID,
			ReportID:      strings.TrimSpace(parsed.Report.Value),
			GMPStatus:     parsed.Status,
			GMPStatusText: parsed.Text,
			RawResponse:   output,
		})
		return
	}

	c.JSON(http.StatusOK, StartTaskResponse{
		Status:        "success",
		Message:       "task started successfully",
		TaskID:        taskID,
		ReportID:      strings.TrimSpace(parsed.Report.Value),
		GMPStatus:     parsed.Status,
		GMPStatusText: parsed.Text,
		RawResponse:   output,
	})
}

func (o *OpenVASController) GetTaskStatus(c *gin.Context) {
	taskID := strings.TrimSpace(c.Param("task_id"))
	if taskID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "task_id is required",
		})
		return
	}

	rawXML := fmt.Sprintf(`<get_tasks task_id="%s" details="1"/>`, xmlEscape(taskID))

	output, err := runGVMCLI(c.Request.Context(), rawXML)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "failed to get task status",
			"error":   err.Error(),
		})
		return
	}

	var parsed gmpGetTasksEnvelope
	if err := xml.Unmarshal([]byte(output), &parsed); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":       "error",
			"message":      "cannot parse GMP get_tasks response",
			"task_id":      taskID,
			"raw_response": output,
			"error":        err.Error(),
		})
		return
	}

	ok := strings.HasPrefix(parsed.Status, "2")
	if !ok {
		c.JSON(http.StatusBadRequest, TaskStatusResponse{
			Status:        "error",
			Message:       "openvas rejected get_tasks",
			TaskID:        taskID,
			GMPStatus:     parsed.Status,
			GMPStatusText: parsed.Text,
			RawResponse:   output,
		})
		return
	}

	c.JSON(http.StatusOK, TaskStatusResponse{
		Status:        "success",
		Message:       "task status fetched successfully",
		TaskID:        taskID,
		TaskName:      strings.TrimSpace(parsed.Task.Name),
		ScanStatus:    strings.TrimSpace(parsed.Task.Status),
		Progress:      strings.TrimSpace(parsed.Task.Progress),
		LastReportID:  strings.TrimSpace(parsed.Task.LastRpt.ID),
		GMPStatus:     parsed.Status,
		GMPStatusText: parsed.Text,
		RawResponse:   output,
	})
}

func runGVMCLI(parentCtx context.Context, xmlCommand string) (string, error) {
	ctx, cancel := context.WithTimeout(parentCtx, time.Duration(openvasTimeout)*time.Second)
	defer cancel()

	args := []string{
		"--gmp-username", openvasUsername,
		"--gmp-password", openvasPassword,
		"socket",
		"--socketpath", openvasSocket,
		"--xml", xmlCommand,
	}

	cmd := exec.CommandContext(ctx, "gvm-cli", args...)
	out, err := cmd.CombinedOutput()

	if ctx.Err() == context.DeadlineExceeded {
		return "", fmt.Errorf("gvm-cli timeout after %d seconds", openvasTimeout)
	}

	output := strings.TrimSpace(string(out))
	if err != nil {
		return output, fmt.Errorf("gvm-cli failed: %w | output: %s", err, output)
	}

	return output, nil
}

func xmlEscape(s string) string {
	replacer := strings.NewReplacer(
		"&", "&amp;",
		`"`, "&quot;",
		"'", "&apos;",
		"<", "&lt;",
		">", "&gt;",
	)
	return replacer.Replace(s)
}