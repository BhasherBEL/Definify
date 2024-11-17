import { customType } from 'drizzle-orm/sqlite-core';

export const customUint8Array = customType<{ data: Uint8Array; driverData: string }>({
	dataType() {
		return 'Uint8Array';
	},
	fromDriver(data: string): Uint8Array {
		return new TextEncoder().encode(data);
	},
	toDriver(data: Uint8Array): string {
		return new TextDecoder().decode(data);
	}
});
