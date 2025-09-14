import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { v4 as uuidv4 } from 'uuid';
import type { MobileConfigProfile } from '~/types/base';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const profileData = formData.get('profile');

    if (!profileData) {
      return json({ error: 'Profile data is required' }, { status: 400 });
    }

    // Parse profile data
    const profile = JSON.parse(profileData as string);

    // Generate mobileconfig XML
    const mobileconfig = generateMobileConfig(profile);

    return new Response(mobileconfig, {
      headers: {
        'Content-Type': 'application/x-apple-aspen-config',
        'Content-Disposition': 'attachment; filename="profile.mobileconfig"',
      },
    });
  } catch {
    return json({ error: 'Failed to generate mobileconfig' }, { status: 500 });
  }
}

function generateMobileConfig(profile: MobileConfigProfile): string {
  const payloadUUID = profile.PayloadUUID || uuidv4();

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <!-- Payloads will be added here -->
  </array>
  <key>PayloadDescription</key>
  <string>${profile.PayloadDescription || 'Generated Configuration Profile'}</string>
  <key>PayloadDisplayName</key>
  <string>${profile.PayloadDisplayName || 'Configuration Profile'}</string>
  <key>PayloadIdentifier</key>
  <string>${profile.PayloadIdentifier || 'com.example.profile'}</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${payloadUUID}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>${
    profile.ConsentText
      ? `
  <key>ConsentText</key>
  <string>${profile.ConsentText}</string>`
      : ''
  }
</dict>
</plist>`;
}
