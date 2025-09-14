import type { MetaFunction } from '@remix-run/cloudflare';
import type { Payload } from '~/types/base';
import { useState } from 'react';
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
	});

	const [showAddPayload, setShowAddPayload] = useState(false);

	const addPayload = (payloadType: string) => {
		const newPayload = {
			PayloadType: payloadType,
			PayloadDisplayName: `${payloadType} Configuration`,
			PayloadUUID: crypto.randomUUID(),
			PayloadIdentifier: `com.example.${payloadType.toLowerCase()}`,
			PayloadVersion: 1,
		};

		setProfile((prev) => ({
			...prev,
			PayloadContent: [...prev.PayloadContent, newPayload],
		}));
		setShowAddPayload(false);
	};

	const removePayload = (index: number) => {
		setProfile((prev) => ({
			...prev,
			PayloadContent: prev.PayloadContent.filter((_, i) => i !== index),
		}));
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

	const payloadTypes = [
		{ type: 'com.apple.wifi.managed', name: 'Wi-Fi' },
		{ type: 'com.apple.vpn.managed', name: 'VPN' },
		{ type: 'com.apple.dnsProxy.managed', name: 'DNS' },
		{ type: 'com.apple.mail.managed', name: 'Email' },
		{ type: 'com.apple.webClip.managed', name: 'Web Clip' },
	];

	return (
		<div className='max-w-xl mx-auto px-4 py-8'>
			<div className='flex items-center gap-4 mb-6'>
				<Link to='/' className='text-gray-600 hover:text-gray-900 text-sm'>
					← Back
				</Link>
			</div>

			<h1 className='text-2xl font-semibold mb-6 text-gray-900'>Profile Builder</h1>

			<div className='space-y-6'>
				<div>
					<h2 className='text-lg font-medium mb-4 text-gray-900'>Profile Settings</h2>
					<div className='space-y-4'>
						<div>
							<label
								htmlFor='display-name'
								className='block text-sm font-medium mb-1 text-gray-700'
							>
								Display Name
							</label>
							<input
								id='display-name'
								type='text'
								value={profile.PayloadDisplayName}
								onChange={(e) =>
									setProfile((prev) => ({ ...prev, PayloadDisplayName: e.target.value }))
								}
								className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
							/>
						</div>
						<div>
							<label htmlFor='identifier' className='block text-sm font-medium mb-1 text-gray-700'>
								Identifier
							</label>
							<input
								id='identifier'
								type='text'
								value={profile.PayloadIdentifier}
								onChange={(e) =>
									setProfile((prev) => ({ ...prev, PayloadIdentifier: e.target.value }))
								}
								className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
							/>
						</div>
						<div>
							<label htmlFor='description' className='block text-sm font-medium mb-1 text-gray-700'>
								Description
							</label>
							<textarea
								id='description'
								value={profile.PayloadDescription}
								onChange={(e) =>
									setProfile((prev) => ({ ...prev, PayloadDescription: e.target.value }))
								}
								rows={3}
								className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
							/>
						</div>
					</div>
				</div>

				<div>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>
							Payloads ({profile.PayloadContent.length})
						</h2>
						<button
							onClick={() => setShowAddPayload(!showAddPayload)}
							className='text-sm text-blue-600 hover:text-blue-800'
						>
							+ Add Payload
						</button>
					</div>

					{showAddPayload && (
						<div className='mb-4 p-4 border border-gray-200 rounded'>
							<div className='text-sm font-medium mb-3 text-gray-900'>Select Payload Type</div>
							<div className='grid grid-cols-2 gap-2'>
								{payloadTypes.map(({ type, name }) => (
									<button
										key={type}
										onClick={() => addPayload(type)}
										className='p-2 text-left text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-900'
									>
										{name}
									</button>
								))}
							</div>
						</div>
					)}

					<div className='space-y-2'>
						{profile.PayloadContent.map((payload, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-3 border border-gray-200 rounded'
							>
								<div>
									<div className='font-medium text-gray-900'>{payload.PayloadDisplayName}</div>
									<div className='text-sm text-gray-500'>{payload.PayloadType}</div>
								</div>
								<button
									onClick={() => removePayload(index)}
									className='text-red-600 hover:text-red-800 text-sm'
								>
									Remove
								</button>
							</div>
						))}

						{profile.PayloadContent.length === 0 && (
							<div className='text-center py-8 text-gray-500 text-sm'>No payloads added yet.</div>
						)}
					</div>
				</div>

				<div className='pt-4 border-t border-gray-200'>
					<button
						onClick={generateProfile}
						disabled={profile.PayloadContent.length === 0}
						className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm'
					>
						Generate Profile
					</button>
				</div>
			</div>
		</div>
	);
}
