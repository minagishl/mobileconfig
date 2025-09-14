import { json } from '@remix-run/cloudflare';

export async function loader() {
  const payloadTypes = [
    {
      type: 'com.apple.wifi.managed',
      name: 'Wi-Fi',
      description: 'Configure Wi-Fi network settings',
      fields: [
        {
          name: 'SSID_STR',
          required: true,
          type: 'string',
          description: 'Network name',
        },
        {
          name: 'HIDDEN_NETWORK',
          required: false,
          type: 'boolean',
          description: 'Hidden network',
        },
        {
          name: 'AutoJoin',
          required: false,
          type: 'boolean',
          description: 'Auto-join network',
        },
      ],
    },
    {
      type: 'com.apple.vpn.managed',
      name: 'VPN',
      description: 'Configure VPN settings',
      fields: [
        {
          name: 'UserDefinedName',
          required: true,
          type: 'string',
          description: 'VPN name',
        },
        {
          name: 'VPNType',
          required: true,
          type: 'string',
          description: 'VPN type (IKEv2, L2TP, etc.)',
        },
        {
          name: 'RemoteAddress',
          required: true,
          type: 'string',
          description: 'Server address',
        },
      ],
    },
    {
      type: 'com.apple.dnsProxy.managed',
      name: 'DNS',
      description: 'Configure DNS settings',
      fields: [
        {
          name: 'AppBundleIdentifier',
          required: true,
          type: 'string',
          description: 'App bundle ID',
        },
        {
          name: 'ServerAddresses',
          required: true,
          type: 'array',
          description: 'DNS server addresses',
        },
      ],
    },
  ];

  return json({ payloadTypes });
}
