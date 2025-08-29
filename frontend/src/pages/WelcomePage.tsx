import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../lib/api';
import topLogo from '../assets/top.svg';
import '../pages.css';
import '../index.css';


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
			navigate('/signup');
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
		navigate('/signup');
	}

	const userLabel = useMemo(() => {
		if (!user) return '';
		return `${user.name || ''} ${user.email ? `(${user.email})` : ''}`.trim();
	}, [user]);

	const getUserInitials = (name: string) => {
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="dashboard-container">
			<header className="dashboard-header">
				<div className="dashboard-header-content">
					<div className="dashboard-title">
						<img src={topLogo} alt="Logo" />
						<h1>Note Dashboard</h1>
					</div>
					
					<div className="user-info">
						<div className="user-avatar">
							{user?.name ? getUserInitials(user.name) : 'U'}
						</div>
						<div>
							<div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
								{user?.name || 'User'}
							</div>
							<div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
								{user?.email}
							</div>
						</div>
						<button className="logout-btn" onClick={logout}>
							Logout
						</button>
					</div>
				</div>
			</header>

			<main className="dashboard-main">
				{error && <div className="error">{error}</div>}
				
				<div className="dashboard-content">
					<section className="create-note-section">
						<h3>Create New Note</h3>
						<form className="create-note-form" onSubmit={(e) => { e.preventDefault(); createNote(); }}>
							<div className="form-group">
								<label htmlFor="note-title">Note Title</label>
								<input 
									id="note-title"
									type="text"
									value={title} 
									onChange={(e) => setTitle(e.target.value)} 
									placeholder="Enter note title" 
								/>
							</div>
							
							<div className="form-group">
								<label htmlFor="note-content">Note Content</label>
								<textarea 
									id="note-content"
									value={content} 
									onChange={(e) => setContent(e.target.value)} 
									placeholder="Write your note content here..." 
								/>
							</div>
							
							<button type="submit" className="primary-btn">
								Create Note
							</button>
						</form>
					</section>

					<section className="notes-section">
						<h3>Your Notes ({notes.length})</h3>
						
						{notes.length === 0 ? (
							<div className="empty-notes">
								<h4>No notes yet</h4>
								<p>Create your first note to get started!</p>
							</div>
						) : (
							<ul className="notes-list">
								{notes.map((note) => (
									<li key={note.id || note._id} className="note-item">
										<div className="note-header">
											<h4 className="note-title">{note.title}</h4>
											<div className="note-actions">
												<button 
													className="delete-btn"
													onClick={() => deleteNote(String(note.id || note._id))}
												>
													Delete
												</button>
											</div>
										</div>
										<p className="note-content">{note.content}</p>
									</li>
								))}
							</ul>
						)}
					</section>
				</div>
			</main>
		</div>
	);
}
