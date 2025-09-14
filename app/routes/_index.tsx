import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import { Plus, Settings, BookOpen } from 'lucide-react';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Mobile Config Generator' },
		{ name: 'description', content: 'Generate Apple mobileconfig configuration profiles' },
	];
};

export default function Index() {
	return (
		<div className='max-w-xl mx-auto px-4 py-8'>
			<h1 className='text-2xl font-semibold mb-4 text-gray-900'>Mobile Config Generator</h1>
			<p className='text-gray-600 mb-8'>
				Generate Apple mobileconfig configuration profiles for iOS and macOS devices.
			</p>

			<div className='space-y-4'>
				<Link
					to='/builder'
					className='block p-4 border border-gray-300 rounded hover:bg-gray-50 text-gray-900'
				>
					<div className='flex items-center gap-3'>
						<Plus className='w-5 h-5 text-gray-500' />
						<div>
							<h3 className='font-medium text-gray-900'>Create Profile</h3>
							<p className='text-sm text-gray-600'>Build a custom configuration profile</p>
						</div>
					</div>
				</Link>

				<Link
					to='/presets'
					className='block p-4 border border-gray-300 rounded hover:bg-gray-50 text-gray-900'
				>
					<div className='flex items-center gap-3'>
						<Settings className='w-5 h-5 text-gray-500' />
						<div>
							<h3 className='font-medium text-gray-900'>Use Presets</h3>
							<p className='text-sm text-gray-600'>Pre-configured templates for common use cases</p>
						</div>
					</div>
				</Link>

				<Link
					to='/docs'
					className='block p-4 border border-gray-300 rounded hover:bg-gray-50 text-gray-900'
				>
					<div className='flex items-center gap-3'>
						<BookOpen className='w-5 h-5 text-gray-500' />
						<div>
							<h3 className='font-medium text-gray-900'>Documentation</h3>
							<p className='text-sm text-gray-600'>Supported payload types and API reference</p>
						</div>
					</div>
				</Link>
			</div>

			<div className='mt-12'>
				<h2 className='text-lg font-medium mb-4 text-gray-900'>Supported Payload Types</h2>
				<div className='text-sm text-gray-600'>
					Wi-Fi, VPN, DNS, Email, Exchange, APN, Restrictions, WebClip, CalDAV, CardDAV, LDAP, SCEP,
					Certificates, Passcode, Single Sign-On
				</div>
			</div>
		</div>
	);
}
