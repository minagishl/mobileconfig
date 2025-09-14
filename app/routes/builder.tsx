import type { MetaFunction } from '@remix-run/cloudflare';
import type { Payload, PayloadType } from '~/types/base';
import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Profile Builder - Mobile Config Generator' },
    { name: 'description', content: 'Build custom mobileconfig profiles' },
  ];
};

export default function Builder() {
  const [profile, setProfile] = useState({
    PayloadDisplayName: 'My Configuration Profile',
    PayloadDescription: 'Generated configuration profile',
    PayloadIdentifier: 'com.example.profile',
    PayloadContent: [] as Payload[],
    ConsentText: '',
  });

  const [showAddPayload, setShowAddPayload] = useState(false);
  const [payloadTypes, setPayloadTypes] = useState<PayloadType[]>([]);
  const [editingPayload, setEditingPayload] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/payload-types')
      .then((res) => res.json())
      .then((data: unknown) => {
        const typedData = data as { payloadTypes: PayloadType[] };
        setPayloadTypes(typedData.payloadTypes);
      })
      .catch(console.error);
  }, []);

  const addPayload = (payloadType: string) => {
    const typeInfo = payloadTypes.find((pt) => pt.type === payloadType);
    const newPayload: Payload = {
      PayloadType: payloadType,
      PayloadDisplayName: typeInfo?.name
        ? `${typeInfo.name} Configuration`
        : `${payloadType} Configuration`,
      PayloadUUID: crypto.randomUUID(),
      PayloadIdentifier: `com.example.${payloadType.toLowerCase().replace(/\./g, '.')}`,
      PayloadVersion: 1,
    };

    // Set default values for fields
    if (typeInfo) {
      typeInfo.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          newPayload[field.name] = field.defaultValue;
        }
      });
    }

    setProfile((prev) => ({
      ...prev,
      PayloadContent: [...prev.PayloadContent, newPayload],
    }));
    setShowAddPayload(false);
    setEditingPayload(profile.PayloadContent.length); // Edit the newly added payload
  };

  const removePayload = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      PayloadContent: prev.PayloadContent.filter((_, i) => i !== index),
    }));
    if (editingPayload === index) {
      setEditingPayload(null);
    } else if (editingPayload !== null && editingPayload > index) {
      setEditingPayload(editingPayload - 1);
    }
  };

  const updatePayloadField = (
    index: number,
    fieldName: string,
    value: string | boolean | number | string[],
  ) => {
    setProfile((prev) => ({
      ...prev,
      PayloadContent: prev.PayloadContent.map((payload, i) =>
        i === index ? { ...payload, [fieldName]: value } : payload,
      ),
    }));
  };

  const renderFieldInput = (
    payload: Payload,
    field: PayloadType['fields'][0],
    payloadIndex: number,
  ) => {
    const value = payload[field.name];
    const fieldId = `${payloadIndex}-${field.name}`;

    switch (field.type) {
      case 'boolean':
        return (
          <div key={field.name} className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) =>
                  updatePayloadField(payloadIndex, field.name, e.target.checked)
                }
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                {field.name}
              </span>
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="mb-4">
            <label
              htmlFor={fieldId}
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              {field.name}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={fieldId}
              type="number"
              value={typeof value === 'number' ? value : ''}
              onChange={(e) =>
                updatePayloadField(
                  payloadIndex,
                  field.name,
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          </div>
        );

      case 'array': {
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {field.name}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {arrayValue.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={String(item)}
                    onChange={(e) => {
                      const newArray = [...arrayValue];
                      newArray[itemIndex] = e.target.value;
                      updatePayloadField(payloadIndex, field.name, newArray);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newArray = arrayValue.filter(
                        (_, i) => i !== itemIndex,
                      );
                      updatePayloadField(payloadIndex, field.name, newArray);
                    }}
                    className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newArray = [...arrayValue, ''];
                  updatePayloadField(payloadIndex, field.name, newArray);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add {field.name}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          </div>
        );
      }

      default: // string
        return (
          <div key={field.name} className="mb-4">
            <label
              htmlFor={fieldId}
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              {field.name}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={fieldId}
              type="text"
              value={typeof value === 'string' ? value : ''}
              onChange={(e) =>
                updatePayloadField(payloadIndex, field.name, e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          </div>
        );
    }
  };

  const generateProfile = async () => {
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
      a.download = 'profile.mobileconfig';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
          ← Back
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-6 text-gray-900">
        Profile Builder
      </h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-900">
            Profile Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="display-name"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Display Name
              </label>
              <input
                id="display-name"
                type="text"
                value={profile.PayloadDisplayName}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    PayloadDisplayName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Identifier
              </label>
              <input
                id="identifier"
                type="text"
                value={profile.PayloadIdentifier}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    PayloadIdentifier: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={profile.PayloadDescription}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    PayloadDescription: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="consent-text"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Consent Text (Optional)
              </label>
              <textarea
                id="consent-text"
                value={profile.ConsentText}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    ConsentText: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Text displayed to user before profile installation"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Payloads ({profile.PayloadContent.length})
            </h2>
            <button
              onClick={() => setShowAddPayload(!showAddPayload)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Payload
            </button>
          </div>

          {showAddPayload && (
            <div className="mb-4 p-4 border border-gray-200 rounded">
              <div className="text-sm font-medium mb-3 text-gray-900">
                Select Payload Type
              </div>
              <div className="grid grid-cols-2 gap-2">
                {payloadTypes.map(({ type, name }) => (
                  <button
                    key={type}
                    onClick={() => addPayload(type)}
                    className="p-2 text-left text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-900"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {profile.PayloadContent.map((payload, index) => {
              const typeInfo = payloadTypes.find(
                (pt) => pt.type === payload.PayloadType,
              );
              const isEditing = editingPayload === index;

              return (
                <div key={index} className="border border-gray-200 rounded">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-gray-900">
                        {payload.PayloadDisplayName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payload.PayloadType}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditingPayload(isEditing ? null : index)
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {isEditing ? 'Done' : 'Edit'}
                      </button>
                      <button
                        onClick={() => removePayload(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {isEditing && typeInfo && (
                    <div className="p-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Configure {typeInfo.name}
                      </h4>

                      {/* Base payload fields */}
                      <div className="mb-4">
                        <label
                          htmlFor={`payload-${index}-display-name`}
                          className="block text-sm font-medium mb-1 text-gray-700"
                        >
                          Display Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`payload-${index}-display-name`}
                          type="text"
                          value={payload.PayloadDisplayName}
                          onChange={(e) =>
                            updatePayloadField(
                              index,
                              'PayloadDisplayName',
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor={`payload-${index}-description`}
                          className="block text-sm font-medium mb-1 text-gray-700"
                        >
                          Description
                        </label>
                        <input
                          id={`payload-${index}-description`}
                          type="text"
                          value={payload.PayloadDescription || ''}
                          onChange={(e) =>
                            updatePayloadField(
                              index,
                              'PayloadDescription',
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor={`payload-${index}-identifier`}
                          className="block text-sm font-medium mb-1 text-gray-700"
                        >
                          Identifier <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`payload-${index}-identifier`}
                          type="text"
                          value={payload.PayloadIdentifier}
                          onChange={(e) =>
                            updatePayloadField(
                              index,
                              'PayloadIdentifier',
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Custom fields */}
                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="font-medium text-gray-900 mb-3">
                          {typeInfo.name} Settings
                        </h5>
                        {typeInfo.fields.map((field) =>
                          renderFieldInput(payload, field, index),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {profile.PayloadContent.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No payloads added yet.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={generateProfile}
            disabled={profile.PayloadContent.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            Generate Profile
          </button>
        </div>
      </div>
    </div>
  );
}
