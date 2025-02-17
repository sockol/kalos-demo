package main

type Stats struct {
	TotalRevenue              float64 `json:"totalRevenue"`
	HighestPerformingSalesRep string  `json:"highestPerformingSalesRep"`
	HighestSellingRegion      string  `json:"highestSellingRegion"`
}
