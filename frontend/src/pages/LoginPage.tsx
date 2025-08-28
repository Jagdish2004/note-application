import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { api, setAuthToken } from '../lib/api';
import { sendOTP } from '../services/otpService';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [otpRequested, setOtpRequested] = useState(false);
	const [code, setCode] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const user = localStorage.getItem('user');
		if (token && user) {
			setAuthToken(token);
			navigate('/welcome');
		}
	}, [navigate]);

	async function requestOtp() {
		setError(null);
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			setError('Enter a valid email');
			return;
		}
		setLoading(true);
		try {
			// Check if user exists first
			try {
				await api.get(`/auth/check-user/${email}`);
			} catch (e: any) {
				if (e?.response?.status === 404) {
					setError('User not found. Please signup first.');
					return;
				}
			}
			
			// Send OTP using simple service
			const result = await sendOTP(email);
			if (!result.success) {
				setError(result.error || 'Failed to send OTP');
				return;
			}
			
			// Store OTP temporarily in localStorage
			localStorage.setItem('tempLoginOtp', result.otp!);
			localStorage.setItem('tempLoginEmail', email);
			
			setOtpRequested(true);
		} catch (e: any) {
			setError('Failed to send OTP. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	async function verifyOtp() {
		setError(null);
		if (!/^[0-9]{6}$/.test(code)) {
			setError('Enter a valid 6-digit OTP');
			return;
		}
		
		// Verify OTP from localStorage
		const storedOtp = localStorage.getItem('tempLoginOtp');
		const storedEmail = localStorage.getItem('tempLoginEmail');
		
		if (!storedOtp || !storedEmail) {
			setError('OTP expired. Please request a new one.');
			return;
		}
		
		if (code !== storedOtp) {
			setError('Invalid OTP code');
			return;
		}
		
		setLoading(true);
		try {
			const res = await api.post('/auth/login', { email: storedEmail });
			const { token, user } = res.data;
			
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
			
			// Clean up temporary data
			localStorage.removeItem('tempLoginOtp');
			localStorage.removeItem('tempLoginEmail');
			
			setAuthToken(token);
			navigate('/welcome');
		} catch (e: any) {
			setError(e?.response?.data?.error || 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div style={{ padding: 24, display: 'flex', gap: 24, flexDirection: 'column', maxWidth: 420 }}>
			<h2>Login</h2>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			
			<label>
				Email *
				<input 
					value={email} 
					onChange={(e) => setEmail(e.target.value)} 
					placeholder="you@example.com" 
					disabled={otpRequested}
				/>
			</label>

			{otpRequested && (
				<label>
					OTP Code *
					<input 
						value={code} 
						onChange={(e) => setCode(e.target.value)} 
						placeholder="6-digit code from email" 
						maxLength={6}
					/>
				</label>
			)}
			
			<div style={{ display: 'flex', gap: 8 }}>
				{!otpRequested ? (
					<button onClick={requestOtp} disabled={loading}>
						{loading ? 'Sending...' : 'Send OTP'}
					</button>
				) : (
					<button onClick={verifyOtp} disabled={loading}>
						{loading ? 'Verifying...' : 'Verify OTP'}
					</button>
				)}
			</div>

			{googleClientId && (
				<GoogleOAuthProvider clientId={googleClientId}>
					<div>
						<GoogleLogin
							onSuccess={async (cred) => {
								console.log('Google OAuth: Success callback triggered');
								console.log('Google OAuth: Credential received:', cred.credential ? 'Yes' : 'No');
								
								setError(null);
								try {
									console.log('Google OAuth: Making API call to backend...');
									const res = await api.post('/auth/google', { idToken: cred.credential });
									console.log('Google OAuth: Backend response:', res.data);
									
									const { token, user } = res.data;
									localStorage.setItem('token', token);
									localStorage.setItem('user', JSON.stringify(user));
									setAuthToken(token);
									navigate('/welcome');
								} catch (e: any) {
									console.error('Google OAuth: Error details:', {
										message: e?.message,
										response: e?.response?.data,
										status: e?.response?.status
									});
									setError(e?.response?.data?.error || 'Google login failed');
								}
							}}
							onError={() => {
								console.error('Google OAuth: Error callback triggered');
								setError('Google login failed');
							}}
						/>
					</div>
				</GoogleOAuthProvider>
			)}

			<div style={{ textAlign: 'center', marginTop: 16 }}>
				Don't have an account? <Link to="/signup">Sign up here</Link>
			</div>
		</div>
	);
}
