package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type LocationService struct{}

type IPLocation struct {
	IP          string  `json:"ip"`
	City        string  `json:"city"`
	Region      string  `json:"region"`
	Country     string  `json:"country"`
	CountryName string  `json:"country_name"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Timezone    string  `json:"timezone"`
	Org         string  `json:"org"`
}

func (g *LocationService) GetLocationByIP() (*IPLocation, error) {
	resp, err := http.Get("https://ipapi.co/json/")
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	var loc IPLocation
	if err := json.NewDecoder(resp.Body).Decode(&loc); err != nil {
		return nil, fmt.Errorf("decode failed: %w", err)
	}

	return &loc, nil
}
