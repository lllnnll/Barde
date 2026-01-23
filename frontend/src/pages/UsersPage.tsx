import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/userService';
import Aurora from '../components/Auror';
import GlassSurface from '../components/GlassSurfaceProps';
import { Link } from 'react-router-dom';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const result = await getUsers(page, pagination.limit);
            setUsers(result.data);
            setPagination(result.meta);
            setError(null);
        } catch (err: any) {
            setError("Erreur lors de la récupération des utilisateurs");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(pagination.page);
    }, [pagination.page]);

    const handleDelete = async (userId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try {
                await deleteUser(userId);
                fetchUsers(pagination.page);
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <Aurora amplitude={1.0} blend={0.6} colorStops={['#5227FF', '#7CFF67', '#5227FF']} />
            </div>

            <div className="min-h-screen w-full flex flex-col items-center py-12 px-4">
                <GlassSurface width="100%" height="auto" className="max-w-[1000px]">
                    <div className="flex flex-col w-full">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-4 text-white/70 font-medium">ID</th>
                                        <th className="p-4 text-white/70 font-medium">Nom d'utilisateur</th>
                                        <th className="p-4 text-white/70 font-medium">Email</th>
                                        <th className="p-4 text-white/70 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-white/50">Chargement...</td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-white/50">Aucun utilisateur trouvé</td>
                                        </tr>
                                    ) : (
                                        users.map((user: any) => (
                                            <tr key={user.user_id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-white/90">{user.user_id}</td>
                                                <td className="p-4 text-white/90">{user.user_username}</td>
                                                <td className="p-4 text-white/90">{user.user_email}</td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(user.user_id)}
                                                        className="bg-red-500/20 hover:bg-red-500/40 text-red-100 px-3 py-1 rounded border border-red-500/50 transition-colors text-sm"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 flex items-center justify-between border-t border-white/10 bg-white/5 w-full">
                            <div className="text-white/50 text-sm">
                                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} utilisateurs)
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={pagination.page <= 1 || loading}
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    className="px-4 py-2 rounded bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                >
                                    Précédent
                                </button>
                                <button
                                    disabled={pagination.page >= pagination.totalPages || loading}
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    className="px-4 py-2 rounded bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    </div>
                </GlassSurface>

                {error && (
                    <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </>
    );
}
