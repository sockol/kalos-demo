package main

import (
	"github.com/benbjohnson/clock"
	"github.com/google/uuid"
)

type DB struct {
	transactions []*Transaction
	clock        clock.Clock
}

func NewDB() DB {
	return DB{
		transactions: []*Transaction{},
		clock:        clock.New(),
	}
}

func (db *DB) Add(t *Transaction) *Transaction {
	// O(1) insert, because no need to optimize.
	id := uuid.New()
	t.Id = id
	t.UpdatedAt = db.clock.Now()
	t.CreatedAt = db.clock.Now()
	db.transactions = append(db.transactions, t)
	return t
}

func (db *DB) Get(id uuid.UUID) *Transaction {
	// Sequential scan, because no need to optimize.
	for _, r := range db.transactions {
		if r.Id == id {
			return r
		}
	}
	return nil
}

func (db *DB) GetAll() []*Transaction {
	return db.transactions
}

func (db *DB) GetStats() Stats {
	s := Stats{}
	repToRevenue := map[string]float64{}
	regToRevenue := map[string]float64{}
	for _, t := range db.GetAll() {
		s.TotalRevenue += t.AmountInUsd
		repToRevenue[t.SalesRep] = t.AmountInUsd
		regToRevenue[t.Region] = t.AmountInUsd
	}

	maxRep := ""
	for rep, amount := range repToRevenue {
		max, ok := repToRevenue[maxRep]
		if !ok {
			maxRep = rep
		} else if amount > max {
			maxRep = rep
		}
	}

	maxRegion := ""
	for reg, amount := range regToRevenue {
		max, ok := regToRevenue[maxRegion]
		if !ok {
			maxRegion = reg
		} else if amount > max {
			maxRegion = reg
		}
	}
	s.HighestPerformingSalesRep = maxRep
	s.HighestSellingRegion = maxRegion
	return s
}
