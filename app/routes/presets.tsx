import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json, useLoaderData, Link } from '@remix-run/react';
import type { Preset, Payload } from '~/types/base';
import {
  PAGE_CONFIG,
  generateMetaTags,
  generateStructuredData,
} from '~/utils/seo';

export const meta: MetaFunction = () => {
  return generateMetaTags({
    title: PAGE_CONFIG.presets.title,
    description: PAGE_CONFIG.presets.description,
    keywords: PAGE_CONFIG.presets.keywords,
    path: PAGE_CONFIG.presets.path,
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch(new URL('/api/presets', request.url));
  const data = await response.json();
  return json(data);
}

export default function Presets() {
  const { presets } = useLoaderData<typeof loader>() as { presets: Preset[] };
  const structuredData = generateStructuredData('presets');

  const handleUsePreset = async (preset: Preset) => {
    const profile = {
      PayloadDisplayName: preset.name,
      PayloadDescription: preset.description,
      PayloadIdentifier: `com.example.${preset.id}`,
      PayloadContent: preset.payloads,
    };

    const formData = new FormData();
    formData.append('profile', JSON.stringify(profile));

    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${preset.id}.mobileconfig`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

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
            Configuration Presets
          </h1>
          <p className="text-gray-600 mb-6">
            Pre-configured templates for common use cases.
          </p>
        </header>

        <div className="space-y-4">
          {presets.map((preset: Preset) => (
            <div key={preset.id} className="border border-gray-200 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{preset.name}</h3>
                  <p className="text-sm text-gray-600">{preset.description}</p>
                </div>
                <button
                  onClick={() => handleUsePreset(preset)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Download
                </button>
              </div>
              <div className="text-xs text-gray-500">
                {preset.payloads.map((payload: Payload, index: number) => (
                  <span key={index}>
                    {payload.PayloadType.split('.').pop()}
                    {index < preset.payloads.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/builder"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Create custom profile →
          </Link>
        </div>
      </div>
    </>
  );
}
