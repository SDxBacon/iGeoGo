package services

import (
	"math/rand/v2"
	"time"
)

type SearchService struct{}

// SearchResult 代表一筆地點搜尋結果。
// Latlng 對應前端 [number, number] tuple。
type SearchResult struct {
	ID          string     `json:"id"`
	DisplayName string     `json:"displayName"`
	Description string     `json:"description"`
	Latlng      [2]float64 `json:"latlng"`
}

// dummyPlaces 是台北地區的假資料地點庫。
var dummyPlaces = []SearchResult{
	{
		ID:          "1",
		DisplayName: "台北 101",
		Description: "台北市信義區信義路五段7號",
		Latlng:      [2]float64{25.0338, 121.5645},
	},
	{
		ID:          "2",
		DisplayName: "台北車站",
		Description: "台北市中正區北平西路3號",
		Latlng:      [2]float64{25.0478, 121.5170},
	},
	{
		ID:          "3",
		DisplayName: "國立故宮博物院",
		Description: "台北市士林區至善路二段221號",
		Latlng:      [2]float64{25.1023, 121.5484},
	},
	{
		ID:          "4",
		DisplayName: "西門町",
		Description: "台北市萬華區西門町",
		Latlng:      [2]float64{25.0424, 121.5079},
	},
	{
		ID:          "5",
		DisplayName: "大安森林公園",
		Description: "台北市大安區新生南路二段1號",
		Latlng:      [2]float64{25.0298, 121.5353},
	},
	{
		ID:          "6",
		DisplayName: "松山機場",
		Description: "台北市松山區敦化北路340號-2",
		Latlng:      [2]float64{25.0697, 121.5523},
	},
	{
		ID:          "7",
		DisplayName: "淡水老街",
		Description: "新北市淡水區中正路",
		Latlng:      [2]float64{25.1694, 121.4407},
	},
	{
		ID:          "8",
		DisplayName: "陽明山國家公園",
		Description: "台北市士林區陽明山",
		Latlng:      [2]float64{25.1524, 121.5484},
	},
}

// SearchLocation 依關鍵字搜尋地點，隨機回傳：空陣列、單筆或多筆結果。
// query 為使用者輸入的搜尋字串（留待後端串接真實 API 時使用）。
func (s *SearchService) SearchLocation(query string) ([]SearchResult, error) {
	// 模擬網路延遲
	time.Sleep(time.Duration(300+rand.IntN(400)) * time.Millisecond)

	switch rand.IntN(3) {
	case 0:
		// 查無結果
		return []SearchResult{}, nil
	case 1:
		// 單筆結果
		idx := rand.IntN(len(dummyPlaces))
		return []SearchResult{dummyPlaces[idx]}, nil
	default:
		// 多筆結果：隨機取 3～5 筆（不重複）
		count := 3 + rand.IntN(3)
		indices := rand.Perm(len(dummyPlaces))
		results := make([]SearchResult, 0, count)
		for i := range count {
			results = append(results, dummyPlaces[indices[i]])
		}
		return results, nil
	}
}
