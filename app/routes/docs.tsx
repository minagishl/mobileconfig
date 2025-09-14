import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json, useLoaderData, Link } from '@remix-run/react';
import type { PayloadType, PayloadTypeField } from '~/types/base';
import {
  PAGE_CONFIG,
  generateMetaTags,
  generateStructuredData,
} from '~/utils/seo';

export const meta: MetaFunction = () => {
  return generateMetaTags({
    title: PAGE_CONFIG.docs.title,
    description: PAGE_CONFIG.docs.description,
    keywords: PAGE_CONFIG.docs.keywords,
    path: PAGE_CONFIG.docs.path,
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch(new URL('/api/payload-types', request.url));
  const data = await response.json();
  return json(data);
}

export default function Docs() {
  const { payloadTypes } = useLoaderData<typeof loader>() as {
    payloadTypes: PayloadType[];
  };
  const structuredData = generateStructuredData('docs');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Back
          </Link>
        </div>

        <header>
          <h1 className="text-2xl font-semibold mb-4 text-gray-900">
            Documentation
          </h1>
        </header>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium mb-3 text-gray-900">About</h2>
            <p className="text-gray-600 text-sm">
              Create Apple mobileconfig configuration profiles for iOS and macOS
              devices. Configure Wi-Fi networks, VPN settings, email accounts,
              and more.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3 text-gray-900">
              Supported Payload Types
            </h2>
            <div className="space-y-4">
              {payloadTypes.map((payloadType: PayloadType) => (
                <div
                  key={payloadType.type}
                  className="border border-gray-200 rounded p-4"
                >
                  <h3 className="font-medium mb-1 text-gray-900">
                    {payloadType.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {payloadType.description}
                  </p>
                  <div className="space-y-2">
                    {payloadType.fields.map(
                      (field: PayloadTypeField, index: number) => (
                        <div key={index} className="text-sm">
                          <span className="font-mono text-gray-900">
                            {field.name}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({field.type}
                            {field.required ? ', required' : ''})
                          </span>
                          <div className="text-gray-600 text-xs mt-1">
                            {field.description}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3 text-gray-900">Usage</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Create a profile using the Builder or choose from Presets</li>
              <li>Configure payloads and settings as needed</li>
              <li>Generate and download the mobileconfig file</li>
              <li>Install on your iOS or macOS device</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3 text-gray-900">API</h2>
            <div className="space-y-4 text-sm">
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  POST /api/generate
                </code>
                <div className="text-gray-600 mt-1">
                  Generate mobileconfig file from profile data
                </div>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  GET /api/payload-types
                </code>
                <div className="text-gray-600 mt-1">
                  List supported payload types and fields
                </div>
              </div>
              <div>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  GET /api/presets
                </code>
                <div className="text-gray-600 mt-1">
                  List pre-configured profile templates
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <a
              href="https://developer.apple.com/documentation/devicemanagement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Apple Device Management Documentation →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
