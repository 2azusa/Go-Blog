FROM golang:1.24-alpine AS builder
WORKDIR /app

ENV GOPROXY=https://goproxy.cn,direct

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags="-s -w" -o bin/Go-Blog ./main.go


FROM alpine:latest
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/bin/Go-Blog .
COPY --from=builder /app/config/ ./config/
COPY --from=builder /app/static/ ./static/
VOLUME ["/app/log"]

EXPOSE 8080 3000 5000

ENTRYPOINT ["./Go-Blog"]