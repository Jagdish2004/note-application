import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { api, setAuthToken } from '../lib/api';
import { sendOTP } from '../services/otpService';
import topLogo from '../assets/top.svg';
import '../pages.css';
import '../index.css';

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
		<div className="page-container">
			<div className="auth-container">
				<div className="auth-left">
					<div className="auth-form-container">
						<div className="logo-container">
							<img src={topLogo} alt="Logo" />
							<span className="logo-text">HD</span>
						</div>
						
						<div className="auth-form">
							<h2>Sign In</h2>
							
							{error && <div className="error">{error}</div>}
							
							<div className="form-group">
								<label htmlFor="email">Email Address</label>
								<input 
									id="email"
									type="email"
									value={email} 
									onChange={(e) => setEmail(e.target.value)} 
									placeholder="Enter your email address" 
									disabled={otpRequested}
								/>
							</div>

							{otpRequested && (
								<div className="form-group">
									<label htmlFor="otp">OTP Code</label>
									<input 
										id="otp"
										type="text"
										value={code} 
										onChange={(e) => setCode(e.target.value)} 
										placeholder="Enter 6-digit OTP" 
										maxLength={6}
									/>
								</div>
							)}
							
							<div className="auth-buttons">
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
								<div className="google-auth">
									<GoogleOAuthProvider clientId={googleClientId}>
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
									</GoogleOAuthProvider>
								</div>
							)}

							<div className="auth-links">
								Don't have an account? <Link to="/signup">Sign up here</Link>
							</div>
						</div>
					</div>
				</div>
				
				<div className="auth-right">
					{/* Image background is handled by CSS */}
				</div>
			</div>
		</div>
	);
}
