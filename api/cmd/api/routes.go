package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	mux := httprouter.New()

	mux.NotFound = http.HandlerFunc(app.notFound)
	mux.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowed)

	mux.GET("/", app.health)
	mux.GET("/api/v1/orgs/:orgId/transactions", app.getTransactions)
	mux.GET("/api/v1/orgs/:orgId/stats", app.getStats)

	mux.POST("/api/v1/orgs/:orgId/transactions", app.createTransaction)

	return app.logAccess(app.recoverPanic(mux))
}
