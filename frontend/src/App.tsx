import { Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import './pages.css';

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/signup" replace />} />
			<Route path="/signup" element={<SignupPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/welcome" element={<WelcomePage />} />
		</Routes>
	);
}

