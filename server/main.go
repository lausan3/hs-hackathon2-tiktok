package main

import (
	"context"
	"main/config"
	"main/db/connections"
	"main/infra/logger"
	"main/routers"
)

func main() {
	if err := config.SetupConfig(); err != nil {
		logger.Fatalf("config SetupConfig() error: %s", err)
	}

	db := connections.OpenMySQLConnection()
	defer db.Close()

	redis := connections.OpenRedisConnection()
	defer redis.Close()

	ctx := context.Background()

	router := routers.Routes(ctx, db, redis)

	logger.Fatalf("%v", router.Run(config.ServerConfig()))
}
