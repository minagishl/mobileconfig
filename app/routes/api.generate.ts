import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { v4 as uuidv4 } from 'uuid';
import type { MobileConfigProfile, Payload } from '~/types/base';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const profileData = formData.get('profile');

    if (!profileData) {
      return json({ error: 'Profile data is required' }, { status: 400 });
    }

    // Parse profile data
    const profile = JSON.parse(profileData as string);

    // Generate mobileconfig as stream
    return generateMobileConfigResponse(profile);
  } catch {
    return json({ error: 'Failed to generate mobileconfig' }, { status: 500 });
  }
}

type PlistValue =
  | string
  | number
  | boolean
  | PlistValue[]
  | { [key: string]: PlistValue };

interface PlistDict {
  [key: string]: PlistValue;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function serializePlistValue(value: PlistValue, indent = 0): string {
  const spaces = '  '.repeat(indent);

  if (typeof value === 'string') {
    return `${spaces}<string>${escapeXml(value)}</string>`;
  }

  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? `${spaces}<integer>${value}</integer>`
      : `${spaces}<real>${value}</real>`;
  }

  if (typeof value === 'boolean') {
    return value ? `${spaces}<true/>` : `${spaces}<false/>`;
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => serializePlistValue(item, indent + 1))
      .join('\n');
    return `${spaces}<array>\n${items}\n${spaces}</array>`;
  }

  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value)
      .map(([key, val]) => {
        return `${spaces}  <key>${escapeXml(key)}</key>\n${serializePlistValue(val, indent + 1)}`;
      })
      .join('\n');
    return `${spaces}<dict>\n${entries}\n${spaces}</dict>`;
  }

  return `${spaces}<string></string>`;
}

function generateMobileConfigResponse(profile: MobileConfigProfile): Response {
  const payloadUUID = profile.PayloadUUID || uuidv4();

  // Build plist object, excluding undefined/empty values
  const plistData: PlistDict = {
    PayloadContent: profile.PayloadContent.map((payload) =>
      buildPayloadDict(payload),
    ),
    PayloadDescription:
      profile.PayloadDescription || 'Generated Configuration Profile',
    PayloadDisplayName: profile.PayloadDisplayName || 'Configuration Profile',
    PayloadIdentifier: profile.PayloadIdentifier || 'com.example.profile',
    PayloadType: 'Configuration',
    PayloadUUID: payloadUUID,
    PayloadVersion: 1,
  };

  // Add optional fields only if they have values
  if (profile.PayloadOrganization?.trim()) {
    plistData.PayloadOrganization = profile.PayloadOrganization;
  }

  if (profile.PayloadRemovalDisallowed !== undefined) {
    plistData.PayloadRemovalDisallowed = profile.PayloadRemovalDisallowed;
  }

  if (profile.PayloadScope) {
    plistData.PayloadScope = profile.PayloadScope;
  }

  if (profile.ConsentText?.trim()) {
    plistData.ConsentText = profile.ConsentText;
  }

  const xmlContent = serializePlistValue(plistData);

  const xmlDocument = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">`,
    `<plist version="1.0">`,
    xmlContent,
    `</plist>`,
  ].join('\n');

  return new Response(xmlDocument, {
    headers: {
      'Content-Type': 'application/x-apple-aspen-config',
      'Content-Disposition': 'attachment; filename="profile.mobileconfig"',
    },
  });
}

function buildPayloadDict(payload: Payload): PlistDict {
  const dict: PlistDict = {
    PayloadType: payload.PayloadType,
    PayloadDisplayName: payload.PayloadDisplayName,
    PayloadIdentifier: payload.PayloadIdentifier,
    PayloadUUID: payload.PayloadUUID,
    PayloadVersion: payload.PayloadVersion,
  };

  // Add optional base fields only if they have values
  if (payload.PayloadDescription?.trim()) {
    dict.PayloadDescription = payload.PayloadDescription;
  }

  if (payload.PayloadOrganization?.trim()) {
    dict.PayloadOrganization = payload.PayloadOrganization;
  }

  // Add payload-specific fields, excluding undefined/empty values
  Object.entries(payload).forEach(([key, value]) => {
    if (key.startsWith('Payload')) return; // Skip base payload fields already handled

    if (value !== undefined && value !== null && value !== '') {
      dict[key] = value;
    }
  });

  return dict;
}
