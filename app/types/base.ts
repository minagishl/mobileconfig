/**
 * Base types for mobileconfig payloads
 */

export interface BasePayload {
	PayloadUUID: string;
	PayloadIdentifier: string;
	PayloadType: string;
	PayloadVersion: number;
	PayloadDisplayName: string;
	PayloadDescription?: string;
	PayloadOrganization?: string;
}

export interface MobileConfigProfile {
	PayloadContent: Payload[];
	PayloadDescription: string;
	PayloadDisplayName: string;
	PayloadIdentifier: string;
	PayloadOrganization?: string;
	PayloadRemovalDisallowed?: boolean;
	PayloadScope?: 'System' | 'User';
	PayloadType: 'Configuration';
	PayloadUUID: string;
	PayloadVersion: number;
}

// Payload types will be defined as needed
export type Payload = BasePayload & {
	[key: string]: string | boolean | number | undefined;
};

export interface Preset {
	id: string;
	name: string;
	description: string;
	payloads: Payload[];
}

export interface PayloadType {
	type: string;
	name: string;
	description: string;
	fields: PayloadTypeField[];
}

export interface PayloadTypeField {
	name: string;
	type: string;
	required: boolean;
	description: string;
}
