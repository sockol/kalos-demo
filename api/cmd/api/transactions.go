package main

import (
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	Id          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Amount      float64   `json:"amount"`
	Currency    string    `json:"currency"`
	AmountInUsd float64   `json:"amountInUsd"`
	SalesRep    string    `json:"salesRep"`
	Region      string    `json:"region"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func (t *Transaction) CopyFromInput(in *TransactionInput) *Transaction {
	t.Name = in.Name
	t.Amount = in.Amount
	t.Currency = in.Currency
	t.SalesRep = in.SalesRep
	t.Region = in.Region

	return t
}

type TransactionInput struct {
	Name     string  `json:"name"`
	Amount   float64 `json:"amount"`
	Currency string  `json:"currency"`
	SalesRep string  `json:"salesRep"`
	Region   string  `json:"region"`
}
