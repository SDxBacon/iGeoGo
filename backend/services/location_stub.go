//go:build !darwin

package services

import "fmt"

// getNativeLocation 在非 macOS 平台不支援，回傳錯誤。
func getNativeLocation() (lat float64, lng float64, err error) {
	return 0, 0, fmt.Errorf("原生位置定位僅支援 macOS")
}
