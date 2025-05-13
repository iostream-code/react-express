import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUsers, updateUserRole, deleteUser } from '../../services/userService';
import { Table, Select, Button, Modal, Alert } from 'react-daisyui';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getUsers(currentUser.token);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentUser.token]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole, currentUser.token);
            setUsers(users.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmDelete = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deleteUser(selectedUser.id, currentUser.token);
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="flex justify-center mt-8"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {error && <Alert status="error" className="mb-4">{error}</Alert>}

            <div className="overflow-x-auto">
                <Table hover zebra className="w-full">
                    <Table.Head>
                        <span>Name</span>
                        <span>Email</span>
                        <span>Role</span>
                        <span>Actions</span>
                    </Table.Head>

                    <Table.Body>
                        {users.map(user => (
                            <Table.Row key={user.id}>
                                <span>{user.name}</span>
                                <span>{user.email}</span>
                                <span>
                                    <Select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        disabled={user.id === currentUser.id || user.role === 'admin'}
                                        size="sm"
                                    >
                                        <option value="visitor">Visitor</option>
                                        <option value="author">Author</option>
                                        <option value="admin">Admin</option>
                                    </Select>
                                </span>
                                <span>
                                    <Button
                                        color="error"
                                        size="sm"
                                        onClick={() => confirmDelete(user)}
                                        disabled={user.id === currentUser.id || user.role === 'admin'}
                                    >
                                        Delete
                                    </Button>
                                </span>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Modal open={modalOpen} onClickBackdrop={() => setModalOpen(false)}>
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Body>
                    Delete user {selectedUser?.email} permanently?
                </Modal.Body>
                <Modal.Actions>
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>Confirm</Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
};