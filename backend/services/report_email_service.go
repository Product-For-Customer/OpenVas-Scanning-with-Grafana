package services

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"mime/multipart"
	"net/smtp"
	"net/textproto"
	"os"
	"path/filepath"
)

func buildMIMEHeader(values map[string]string) textproto.MIMEHeader {
	h := textproto.MIMEHeader{}
	for k, v := range values {
		h.Set(k, v)
	}
	return h
}

func SendReportEmailWithAttachment(filePath string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	from := os.Getenv("SMTP_FROM")
	pass := os.Getenv("SMTP_PASS")
	to := os.Getenv("REPORT_EMAIL_TO")
	subject := os.Getenv("REPORT_EMAIL_SUBJECT")

	if smtpHost == "" || smtpPort == "" || from == "" || pass == "" || to == "" {
		return fmt.Errorf("smtp env is not complete")
	}

	if subject == "" {
		subject = "OpenVAS Capture Report"
	}

	fileBytes, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("read attachment failed: %w", err)
	}

	var emailBody bytes.Buffer
	writer := multipart.NewWriter(&emailBody)
	boundary := writer.Boundary()

	emailBody.WriteString(fmt.Sprintf("From: %s\r\n", from))
	emailBody.WriteString(fmt.Sprintf("To: %s\r\n", to))
	emailBody.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	emailBody.WriteString("MIME-Version: 1.0\r\n")
	emailBody.WriteString(fmt.Sprintf("Content-Type: multipart/mixed; boundary=%s\r\n", boundary))
	emailBody.WriteString("\r\n")

	textPart, err := writer.CreatePart(buildMIMEHeader(map[string]string{
		"Content-Type": "text/plain; charset=utf-8",
	}))
	if err != nil {
		return fmt.Errorf("create text part failed: %w", err)
	}

	textContent := "แนบภาพรายงานที่ backend แคปจาก frontend มาให้แล้ว"
	if _, err := textPart.Write([]byte(textContent)); err != nil {
		return fmt.Errorf("write text part failed: %w", err)
	}

	attachmentPart, err := writer.CreatePart(buildMIMEHeader(map[string]string{
		"Content-Type":              "image/png",
		"Content-Transfer-Encoding": "base64",
		"Content-Disposition":       fmt.Sprintf(`attachment; filename="%s"`, filepath.Base(filePath)),
	}))
	if err != nil {
		return fmt.Errorf("create attachment part failed: %w", err)
	}

	encoded := make([]byte, base64.StdEncoding.EncodedLen(len(fileBytes)))
	base64.StdEncoding.Encode(encoded, fileBytes)

	for i := 0; i < len(encoded); i += 76 {
		end := i + 76
		if end > len(encoded) {
			end = len(encoded)
		}
		if _, err := attachmentPart.Write(encoded[i:end]); err != nil {
			return fmt.Errorf("write attachment failed: %w", err)
		}
		if _, err := attachmentPart.Write([]byte("\r\n")); err != nil {
			return fmt.Errorf("write attachment newline failed: %w", err)
		}
	}

	if err := writer.Close(); err != nil {
		return fmt.Errorf("close mime writer failed: %w", err)
	}

	auth := smtp.PlainAuth("", from, pass, smtpHost)
	if err := smtp.SendMail(
		smtpHost+":"+smtpPort,
		auth,
		from,
		[]string{to},
		emailBody.Bytes(),
	); err != nil {
		return fmt.Errorf("send email failed: %w", err)
	}

	return nil
}