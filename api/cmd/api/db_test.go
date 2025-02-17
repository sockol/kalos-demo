package main

import (
	"testing"
)

func TestGetStats(t *testing.T) {

	NewTransaction := func(rep string, amount float64, region string) *Transaction {
		return &Transaction{
			Name:        "fake name",
			Amount:      amount,
			Currency:    "USD",
			AmountInUsd: amount,
			SalesRep:    rep,
			Region:      region,
		}
	}
	tests := []struct {
		description   string
		transactions  []*Transaction
		expectedStats Stats
	}{
		{
			description: "Empty base case",
		},
		{
			description: "One rep - max",
			transactions: []*Transaction{
				NewTransaction("rep-1", 1, "USA"),
			},
			expectedStats: Stats{
				TotalRevenue:              1,
				HighestPerformingSalesRep: "rep-1",
				HighestSellingRegion:      "USA",
			},
		},
		{
			description: "2 reps - 2nd is higher",
			transactions: []*Transaction{
				NewTransaction("rep-1", 1, "USA"),
				NewTransaction("rep-2", 2, "MARS"),
			},
			expectedStats: Stats{
				TotalRevenue:              3,
				HighestPerformingSalesRep: "rep-2",
				HighestSellingRegion:      "MARS",
			},
		},
		{
			description: "2 reps - 2nd is higher in revenue but USA is highest region",
			transactions: []*Transaction{
				NewTransaction("rep-1", 1, "USA"),
				NewTransaction("rep-2", 2, "MARS"),
				NewTransaction("rep-3", 3, "USA"),
			},
			expectedStats: Stats{
				TotalRevenue:              6,
				HighestPerformingSalesRep: "rep-3",
				HighestSellingRegion:      "USA",
			},
		},
	}

	for _, tc := range tests {
		t.Run(tc.description, func(t *testing.T) {
			db := NewDB()
			for _, r := range tc.transactions {
				db.Add(r)
			}
			s := db.GetStats()

			if tc.expectedStats.TotalRevenue != s.TotalRevenue {
				t.Fatalf("expected: %v, got: %v", tc.expectedStats.TotalRevenue, s.TotalRevenue)
			}
			if tc.expectedStats.HighestPerformingSalesRep != s.HighestPerformingSalesRep {
				t.Fatalf("expected: %v, got: %v", tc.expectedStats.HighestPerformingSalesRep, s.HighestPerformingSalesRep)
			}
			if tc.expectedStats.HighestSellingRegion != s.HighestSellingRegion {
				t.Fatalf("expected: %v, got: %v", tc.expectedStats.HighestSellingRegion, s.HighestSellingRegion)
			}
		})
	}
}
