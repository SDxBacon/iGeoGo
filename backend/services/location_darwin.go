package services

/*
#cgo CFLAGS: -x objective-c
#cgo LDFLAGS: -framework CoreLocation -framework Foundation

#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>

typedef struct {
	double lat;
	double lng;
	int    error; // 0=成功, 1=錯誤或超時
} NativeLocationResult;

// LocationDelegate：處理 CLLocationManager 的回調
@interface LocationDelegate : NSObject <CLLocationManagerDelegate>
@property (strong) CLLocationManager *manager;
@property (nonatomic) double latitude;
@property (nonatomic) double longitude;
@property (nonatomic) int status; // 0=等待中, 1=成功, 2=失敗
@property (strong) dispatch_semaphore_t semaphore;
@end

@implementation LocationDelegate

- (instancetype)init {
	self = [super init];
	if (self) {
		self.semaphore = dispatch_semaphore_create(0);
		self.status = 0;
		self.manager = [[CLLocationManager alloc] init];
		self.manager.delegate = self;
		self.manager.desiredAccuracy = kCLLocationAccuracyBest;
	}
	return self;
}

- (void)locationManager:(CLLocationManager *)manager
	 didUpdateLocations:(NSArray<CLLocation *> *)locations {
	CLLocation *location = locations.lastObject;
	self.latitude = location.coordinate.latitude;
	self.longitude = location.coordinate.longitude;
	self.status = 1;
	[self.manager stopUpdatingLocation];
	dispatch_semaphore_signal(self.semaphore);
}

- (void)locationManager:(CLLocationManager *)manager
	   didFailWithError:(NSError *)error {
	self.status = 2;
	[self.manager stopUpdatingLocation];
	dispatch_semaphore_signal(self.semaphore);
}

- (void)locationManagerDidChangeAuthorization:(CLLocationManager *)manager {
	CLAuthorizationStatus status = manager.authorizationStatus;
	if (status == kCLAuthorizationStatusAuthorized) {
		[self.manager startUpdatingLocation];
	} else if (status == kCLAuthorizationStatusDenied ||
			   status == kCLAuthorizationStatusRestricted) {
		self.status = 2;
		dispatch_semaphore_signal(self.semaphore);
	}
	// kCLAuthorizationStatusNotDetermined：等待用戶操作
}

@end

// 同步取得裝置位置（在 Go goroutine 中呼叫，不得在 main thread 呼叫）
NativeLocationResult get_native_location() {
	NativeLocationResult result = {0.0, 0.0, 1};

	__block LocationDelegate *delegate = nil;

	// CLLocationManager 必須在 main thread 建立
	dispatch_sync(dispatch_get_main_queue(), ^{
		delegate = [[LocationDelegate alloc] init];
		CLAuthorizationStatus status = delegate.manager.authorizationStatus;
		if (status == kCLAuthorizationStatusNotDetermined) {
			// 觸發系統授權對話框
			[delegate.manager requestWhenInUseAuthorization];
		} else if (status == kCLAuthorizationStatusAuthorized) {
			[delegate.manager startUpdatingLocation];
		} else {
			// 已拒絕或受限，直接回傳失敗
			delegate.status = 2;
			dispatch_semaphore_signal(delegate.semaphore);
		}
	});

	// 等待結果，最多 15 秒（包含用戶回應授權對話框的時間）
	dispatch_time_t timeout = dispatch_time(DISPATCH_TIME_NOW, 15LL * NSEC_PER_SEC);
	dispatch_semaphore_wait(delegate.semaphore, timeout);

	if (delegate.status == 1) {
		result.lat = delegate.latitude;
		result.lng = delegate.longitude;
		result.error = 0;
	}

	return result;
}
*/
import "C"

import "fmt"

// getNativeLocation 呼叫 CoreLocation 取得裝置 GPS 位置。
// 若授權狀態為 NotDetermined，會觸發系統授權對話框。
func getNativeLocation() (lat float64, lng float64, err error) {
	result := C.get_native_location()
	if result.error != 0 {
		return 0, 0, fmt.Errorf("無法取得裝置位置（授權被拒絕、超時或定位失敗）")
	}
	return float64(result.lat), float64(result.lng), nil
}
