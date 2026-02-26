FROM golang:1.25.1-alpine

ENV GO111MODULE=on

WORKDIR /app

# docker cli + compose plugin + bash + tzdata
RUN apk add --no-cache bash tzdata docker-cli docker-cli-compose

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o app .

EXPOSE 9000

CMD ["./app"]