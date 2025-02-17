package main

import (
	"api/internal/request"
	"api/internal/response"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

func (app *application) createTransaction(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var input TransactionInput
	err := request.DecodeJSONStrict(w, r, &input)
	if err != nil {
		app.badRequest(w, r, err)
		return
	}

	transaction := Transaction{}
	transaction.CopyFromInput(&input)

	rate, err := getExchangeRate(input.Currency)
	if err != nil {
		app.serverError(w, r, err)
	}
	transaction.AmountInUsd = transaction.Amount / rate

	transaction = *app.db.Add(&transaction)

	err = response.JSON(w, http.StatusOK, transaction)
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) getTransactions(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	_, err := strconv.Atoi(p.ByName("orgId"))
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	transactions := app.db.GetAll()

	err = response.JSON(w, http.StatusOK, transactions)
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) getStats(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	_, err := strconv.Atoi(p.ByName("orgId"))
	if err != nil {
		app.serverError(w, r, err)
		return
	}

	stats := app.db.GetStats()
	err = response.JSON(w, http.StatusOK, stats)
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) health(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data := map[string]string{
		"Status": "OK",
	}

	err := response.JSON(w, http.StatusOK, data)
	if err != nil {
		app.serverError(w, r, err)
	}
}

// getExchangeRate makes a request to exchangerate-api.com and provides the exchange rate of that pair against USD.
func getExchangeRate(target string) (float64, error) {
	key := os.Getenv("EXCHANGE_API")
	url := fmt.Sprintf("https://v6.exchangerate-api.com/v6/%s/latest/USD", key)

	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	type ExchangeResult struct {
		Result          string             `json:"result"`
		ConversionRates map[string]float64 `json:"conversion_rates"`
	}
	var input ExchangeResult
	err = json.Unmarshal(body, &input)
	if err != nil {
		return 0, err
	}

	if input.Result != "success" {
		return 0, fmt.Errorf("exchnage api failed with status:%s", input.Result)
	}
	rate, ok := input.ConversionRates[target]
	if !ok {
		return 0, fmt.Errorf("exchnage api failed to find currency:%s", target)
	}
	return rate, nil
}
