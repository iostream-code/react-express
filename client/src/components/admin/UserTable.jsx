import { useState } from 'react';
import { updateUserRole, deleteUser } from '../../../services/userService';
import EditRoleModal from './EditRoleModal';

const UserTable = ({ users, currentUser, setUsers, setError }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole, currentUser.token);
            setUsers(users.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId, currentUser.token);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                        disabled={user.id === currentUser.id || user.role === 'admin'}
                                        className="select select-bordered select-sm"
                                    >
                                        <option value="visitor">Visitor</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setModalOpen(true);
                                        }}
                                        disabled={user.id === currentUser.id || user.role === 'admin'}
                                        className="btn btn-error btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditRoleModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                user={selectedUser}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default UserTable;