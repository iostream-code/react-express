import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            const redirectPath = result.user?.role === 'admin' ? '/admin' : '/';
            navigate(redirectPath);
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden">
                {/* Kiri - Ilustrasi atau Branding */}
                <div className="md:w-1/2 bg-primary text-white flex flex-col items-center justify-center p-10 relative">
                    <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-lg text-center">
                        We&apos;re glad to see you again. Please login to continue.
                    </p>
                    <div className="mt-6">
                        <img
                            src="img/login.svg"
                            alt="Login Illustration"
                            className="w-64"
                        />
                    </div>
                </div>

                {/* Kanan - Form Login */}
                <div className="md:w-1/2 bg-base-100 p-10">
                    <h1 className="text-3xl font-bold text-center mb-6">Login to Your Account</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="input input-bordered w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="******"
                                className="input input-bordered w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="label justify-end">
                                <Link to="/register" className="label-text-alt link link-hover">
                                    Don&apos;t have an account? Register
                                </Link>
                            </label>
                        </div>

                        {error && (
                            <div className="alert alert-error shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.414M5 12H3m18 0h-2m-9-9v2m0 18v-2m8.485-8.485l1.414-1.414M6.343 6.343L4.929 4.929" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="btn btn-success w-full transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
