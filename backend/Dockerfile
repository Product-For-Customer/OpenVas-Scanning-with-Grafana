FROM golang:1-alpine AS builder

ENV GO111MODULE=on
WORKDIR /app

RUN apk add --no-cache git ca-certificates tzdata

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o app .

FROM alpine:3.20

WORKDIR /app

RUN apk add --no-cache \
    bash \
    tzdata \
    docker-cli \
    docker-cli-compose \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && mkdir -p /app/tmp/reports

ENV CHROME_PATH=/usr/bin/chromium
ENV TZ=Asia/Bangkok

COPY --from=builder /app/app ./app
COPY --from=builder /app/scripts ./scripts

RUN chmod +x ./scripts/* 2>/dev/null || true

EXPOSE 9000

CMD ["./app"]