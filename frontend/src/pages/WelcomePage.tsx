import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../lib/api';

type Note = { id?: string; _id?: string; title: string; content: string };

type User = { id: string; email: string; name?: string };

export default function WelcomePage() {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [notes, setNotes] = useState<Note[]>([]);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const userStr = localStorage.getItem('user');
		if (!token || !userStr) {
			navigate('/auth');
			return;
		}
		setAuthToken(token);
		setUser(JSON.parse(userStr));
		void loadNotes();
	}, [navigate]);

	async function loadNotes() {
		try {
			const res = await api.get('/notes');
			setNotes(res.data.notes || []);
		} catch (e: any) {
			setError(e?.response?.data?.error || 'Failed to load notes');
		}
	}

	async function createNote() {
		setError(null);
		if (!title.trim()) {
			setError('Title is required');
			return;
		}
		try {
			const res = await api.post('/notes', { title, content });
			setNotes((n) => [res.data.note, ...n]);
			setTitle('');
			setContent('');
		} catch (e: any) {
			setError(e?.response?.data?.error || 'Failed to create note');
		}
	}

	async function deleteNote(id: string) {
		setError(null);
		try {
			await api.delete(`/notes/${id}`);
			setNotes((n) => n.filter((x) => (x.id || x._id) !== id));
		} catch (e: any) {
			setError(e?.response?.data?.error || 'Failed to delete note');
		}
	}

	function logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setAuthToken(null);
		navigate('/auth');
	}

	const userLabel = useMemo(() => {
		if (!user) return '';
		return `${user.name || ''} ${user.email ? `(${user.email})` : ''}`.trim();
	}, [user]);

	return (
		<div style={{ padding: 24, display: 'flex', gap: 24, flexDirection: 'column' }}>
			<h2>Welcome</h2>
			{user && <div>User: {userLabel}</div>}
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<div style={{ display: 'flex', gap: 8, flexDirection: 'column', maxWidth: 480 }}>
				<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
				<textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Note content" />
				<button onClick={createNote}>Create Note</button>
			</div>
			<div>
				<h3>Your Notes</h3>
				<ul>
					{notes.map((n) => (
						<li key={n.id || n._id}>
							<strong>{n.title}</strong>
							<button style={{ marginLeft: 8 }} onClick={() => deleteNote(String(n.id || n._id))}>Delete</button>
							<div>{n.content}</div>
						</li>
					))}
				</ul>
			</div>
			<button onClick={logout}>Logout</button>
		</div>
	);
}
