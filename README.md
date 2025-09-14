# Mobile Config Generator

A full-stack Remix application for generating Apple mobileconfig configuration profiles. This application allows you to create, customize, and download configuration profiles for iOS and macOS devices without requiring environment variables.

## Features

- **Profile Builder**: Create custom configuration profiles with multiple payload types
- **Pre-configured Presets**: Quick-start templates for common use cases
- **Comprehensive Payload Support**: Support for Wi-Fi, VPN, DNS, Email, Exchange, and more
- **Self-contained**: No environment variables required - works out of the box
- **Cloudflare Pages Ready**: Optimized for deployment on Cloudflare Pages
- **TypeScript**: Full type safety with strict mode enabled
- **Tailwind CSS v4**: Modern, utility-first styling

## Supported Payload Types

- **Wi-Fi** (`com.apple.wifi.managed`) - Configure Wi-Fi network settings
- **VPN** (`com.apple.vpn.managed`) - Set up VPN connections
- **DNS** (`com.apple.dnsProxy.managed`) - Configure DNS settings
- **Email** (`com.apple.mail.managed`) - Email account configuration
- **Exchange** (`com.apple.eas.managed`) - Microsoft Exchange settings
- **Web Clip** (`com.apple.webClip.managed`) - Add web apps to home screen
- **APN** (`com.apple.cellular.managed`) - Cellular data settings
- **Restrictions** (`com.apple.applicationaccess.managed`) - Device restrictions
- **CalDAV** (`com.apple.caldav.account`) - Calendar synchronization
- **CardDAV** (`com.apple.carddav.account`) - Contact synchronization
- **LDAP** (`com.apple.ldap.account`) - LDAP directory services
- **SCEP** (`com.apple.security.scep`) - Certificate enrollment
- **Certificates** (`com.apple.security.pkcs1`) - Certificate installation
- **Passcode** (`com.apple.mobiledevice.passwordpolicy`) - Password policies
- **Single Sign-On** (`com.apple.sso.extension`) - SSO configuration
- **Global HTTP Proxy** (`com.apple.globalhttpProxy.managed`) - HTTP proxy settings

## Installation and Setup

### Prerequisites

- Node.js 20 or higher
- pnpm package manager

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mobileconfig
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Building for Production

```bash
pnpm build
```

### Deployment to Cloudflare Pages

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Deploy using Wrangler**

   ```bash
   pnpm deploy
   ```

3. **Or connect to Cloudflare Pages dashboard**
   - Connect your GitHub repository
   - Set build command: `pnpm build`
   - Set build output directory: `build/client`

## API Reference

### POST /api/generate

Generates a mobileconfig file from profile data.

**Request:**

```javascript
const formData = new FormData();
formData.append(
  'profile',
  JSON.stringify({
    PayloadDisplayName: 'My Profile',
    PayloadDescription: 'Description',
    PayloadIdentifier: 'com.example.profile',
    PayloadContent: [
      {
        PayloadType: 'com.apple.wifi.managed',
        PayloadDisplayName: 'Wi-Fi Network',
        SSID_STR: 'MyNetwork',
        AutoJoin: true,
      },
    ],
  }),
);

fetch('/api/generate', {
  method: 'POST',
  body: formData,
});
```

**Response:**

- Content-Type: `application/x-apple-aspen-config`
- Content-Disposition: `attachment; filename="profile.mobileconfig"`
- Body: Valid mobileconfig XML file

### GET /api/payload-types

Returns a catalog of supported payload types and their configuration fields.

**Response:**

```json
{
  "payloadTypes": [
    {
      "type": "com.apple.wifi.managed",
      "name": "Wi-Fi",
      "description": "Configure Wi-Fi network settings",
      "fields": [
        {
          "name": "SSID_STR",
          "required": true,
          "type": "string",
          "description": "Network name"
        }
      ]
    }
  ]
}
```

### GET /api/presets

Returns pre-configured profile templates.

**Response:**

```json
{
  "presets": [
    {
      "id": "wifi-only",
      "name": "Wi-Fi Only",
      "description": "Basic Wi-Fi configuration profile",
      "payloads": [...]
    }
  ]
}
```

## Usage

### Creating a Profile

1. Navigate to the **Builder** page
2. Configure profile metadata (name, description, identifier)
3. Add payloads by clicking "Add Payload" and selecting the desired type
4. Configure each payload's settings
5. Click "Generate Profile" to download the mobileconfig file

### Using Presets

1. Navigate to the **Presets** page
2. Choose from available templates
3. Click "Download Profile" to get the pre-configured mobileconfig file

### Installing on Devices

1. **iOS**: Transfer the mobileconfig file to your device and open it in Safari
2. **macOS**: Double-click the mobileconfig file or use System Preferences > Profiles

## Project Structure

```
mobileconfig/
├── app/
│   ├── routes/
│   │   ├── _index.tsx           # Dashboard
│   │   ├── builder.tsx          # Profile builder
│   │   ├── presets.tsx          # Pre-configured templates
│   │   ├── docs.tsx             # Documentation
│   │   └── api/
│   │       ├── generate.ts      # Mobileconfig generation
│   │       ├── payload-types.ts # Payload catalog
│   │       └── presets.ts       # Preset templates
│   ├── types/
│   │   └── base.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── site.ts              # Site utility functions
│   ├── root.tsx                 # Root layout with navigation
│   └── tailwind.css             # Tailwind CSS styles
├── functions/
│   └── [[path]].ts              # Cloudflare Pages Functions
├── public/                      # Static assets
├── package.json
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── wrangler.jsonc               # Cloudflare configuration
```

## Development

### TypeScript Configuration

The project uses strict TypeScript configuration with:

- `strict: true` enabled
- No `any` types allowed (enforced by ESLint)
- Strict null checks and type checking

### Code Style

- **ESLint**: Configured with strict rules and no `any` types
- **Prettier**: Code formatting
- **Tailwind CSS v4**: Utility-first styling (no custom CSS files)

### Testing

```bash
# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass and code is properly formatted
5. Submit a pull request

## Support

For issues and questions:

- Check the documentation page in the application
- Review Apple's official Device Management documentation
- Open an issue in the repository

## Acknowledgments

- Built with [Remix](https://remix.run/)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)
- Styled with [Tailwind CSS v4](https://tailwindcss.com/)
- Icons by [Lucide React](https://lucide.dev/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
