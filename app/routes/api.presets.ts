import { json } from '@remix-run/cloudflare';

export async function loader() {
	const presets = [
		{
			id: 'wifi-only',
			name: 'Wi-Fi Only',
			description: 'Basic Wi-Fi configuration profile',
			payloads: [
				{
					PayloadType: 'com.apple.wifi.managed',
					PayloadDisplayName: 'Wi-Fi Network',
					SSID_STR: 'Example Network',
					AutoJoin: true,
				},
			],
		},
		{
			id: 'wifi-vpn',
			name: 'Wi-Fi + VPN',
			description: 'Wi-Fi network with VPN configuration',
			payloads: [
				{
					PayloadType: 'com.apple.wifi.managed',
					PayloadDisplayName: 'Wi-Fi Network',
					SSID_STR: 'Example Network',
					AutoJoin: true,
				},
				{
					PayloadType: 'com.apple.vpn.managed',
					PayloadDisplayName: 'VPN Connection',
					UserDefinedName: 'Corporate VPN',
					VPNType: 'IKEv2',
					RemoteAddress: 'vpn.example.com',
				},
			],
		},
		{
			id: 'webclip',
			name: 'Web Clip',
			description: 'Add web app to home screen',
			payloads: [
				{
					PayloadType: 'com.apple.webClip.managed',
					PayloadDisplayName: 'Web App',
					Label: 'My Web App',
					URL: 'https://example.com',
					Icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
				},
			],
		},
	];

	return json({ presets });
}
