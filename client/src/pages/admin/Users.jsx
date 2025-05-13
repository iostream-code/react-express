import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userServices';
import { Table, Select, Button, Modal, Alert } from 'react-daisyui';

export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers(currentUser.token);
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentUser.token]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.updateRole(userId, newRole, currentUser.token);
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmDelete = (user) => setUserToDelete(user);

    const handleDelete = async () => {
        try {
            await userService.deleteUser(userToDelete.id, currentUser.token);
            setUsers(users.filter(user => user.id !== userToDelete.id));
            setUserToDelete(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading loading-spinner loading-lg"></div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            {error && (
                <Alert status="error" className="mb-4">
                    {error}
                </Alert>
            )}

            <Table className="w-full">
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
                                    disabled={user.id === currentUser.id}
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
                                    disabled={user.id === currentUser.id}
                                >
                                    Delete
                                </Button>
                            </span>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            {/* Delete Confirmation Modal */}
            <Modal open={!!userToDelete} onClickBackdrop={() => setUserToDelete(null)}>
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Body>
                    Delete user {userToDelete?.email} permanently?
                </Modal.Body>
                <Modal.Actions>
                    <Button onClick={() => setUserToDelete(null)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>Confirm</Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}