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
          defaultValue: false,
        },
        {
          name: 'AutoJoin',
          required: false,
          type: 'boolean',
          description: 'Auto-join network',
          defaultValue: true,
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
          arrayItemType: 'string',
        },
      ],
    },
    {
      type: 'com.apple.webcontent-filter',
      name: 'Web Content Filter',
      description: 'Configure web content filtering (requires supervision)',
      fields: [
        {
          name: 'FilterType',
          required: true,
          type: 'string',
          description: 'Filter type (BuiltIn, Plugin)',
          defaultValue: 'BuiltIn',
        },
        {
          name: 'AutoFilterEnabled',
          required: false,
          type: 'boolean',
          description: 'Enable automatic content filtering',
          defaultValue: false,
        },
        {
          name: 'BlacklistedURLs',
          required: false,
          type: 'array',
          description: 'URLs to block',
          arrayItemType: 'string',
          defaultValue: [],
        },
        {
          name: 'WhitelistedURLs',
          required: false,
          type: 'array',
          description: 'URLs to allow',
          arrayItemType: 'string',
          defaultValue: [],
        },
      ],
    },
    {
      type: 'com.apple.mail.managed',
      name: 'Email',
      description: 'Configure email account settings',
      fields: [
        {
          name: 'EmailAddress',
          required: true,
          type: 'string',
          description: 'Email address',
        },
        {
          name: 'IncomingMailServerHostName',
          required: true,
          type: 'string',
          description: 'Incoming mail server hostname',
        },
        {
          name: 'IncomingMailServerPortNumber',
          required: false,
          type: 'number',
          description: 'Incoming mail server port',
          defaultValue: 993,
        },
        {
          name: 'OutgoingMailServerHostName',
          required: true,
          type: 'string',
          description: 'Outgoing mail server hostname',
        },
        {
          name: 'OutgoingMailServerPortNumber',
          required: false,
          type: 'number',
          description: 'Outgoing mail server port',
          defaultValue: 587,
        },
      ],
    },
  ];

  return json({ payloadTypes });
}
