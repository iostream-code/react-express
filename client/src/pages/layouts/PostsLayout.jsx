import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusCircleIcon } from 'lucide-react';

const Posts = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-outline btn-sm flex items-center gap-2"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => navigate('/posts')}
                        className="btn btn-outline btn-sm flex items-center gap-2">
                        My Posts
                    </button>
                    <button
                        onClick={() => navigate('/posts/create')}
                        className="btn btn-success btn-outline btn-sm flex items-center gap-2"
                    >
                        <PlusCircleIcon className="w-4 h-4" />
                        New Post
                    </button>
                </div>
            </div>

            <div>
                <h1 className="text-3xl font-bold text-primary">Posts Management</h1>
                <p className="text-gray-500 mt-1">Manage Your posts here.</p>
            </div>

            <div className="bg-base-100 p-6 rounded-xl shadow-md">
                <Outlet />
            </div>
        </div >
    );
};

export default Posts;
