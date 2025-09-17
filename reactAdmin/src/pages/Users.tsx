import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, CircularProgress, Box, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, } from "@mui/material";
import { getUsers, type User } from "../api/users.ts";
import { getPromocodesByUser, usePromocode, type Promocode } from "../api/promocodes.ts";

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [promoModalOpen, setPromoModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userPromos, setUserPromos] = useState<Promocode[]>([]);
    const [loadingPromos, setLoadingPromos] = useState(false);
    const [usingPromocode, setUsingPromocode] = useState(false);
    const [promocodeError, setPromocodeError] = useState("");
    const [promocodeSuccess, setPromocodeSuccess] = useState("");

    const headers = [
        { title: "ID", key: "idUser" },
        { title: "Пользователь", key: "user" },
        { title: "Имя", key: "firstName" },
        { title: "Фамилия", key: "lastName" },
        { title: "Email", key: "email" },
        { title: "Роль", key: "role" },
        { title: "Действия", key: "action", align: "right" },
    ];

    const filteredUsers = useMemo(() => {
        if (!search) return users;
        const s = search.toLowerCase();
        return users.filter((u) =>
            ["user", "firstName", "lastName"].some(
                (field) => u[field as keyof User]?.toString().toLowerCase().includes(s)
            )
        );
    }, [users, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const userId = Number(localStorage.getItem("userId"));
            const response = await getUsers({
                id_user: userId,
                offset: page * rowsPerPage,
                limit: rowsPerPage,
            });
            setUsers(response.users);
            setTotal(response.total);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const openPromosModal = async (user: User) => {
        setSelectedUser(user);
        setPromoModalOpen(true);
        setLoadingPromos(true);
        setPromocodeError("");
        setPromocodeSuccess("");
        try {
            const promos = await getPromocodesByUser(user.idUser, Number(localStorage.getItem("userId")));
            setUserPromos(promos);
        } catch (e) {
            console.error(e);
            setUserPromos([]);
        } finally {
            setLoadingPromos(false);
        }
    };

    const handleUsePromocode = async (promo: Promocode) => {
        if (!selectedUser) return;
        setUsingPromocode(true);
        setPromocodeError("");
        setPromocodeSuccess("");
        try {
            const result = await usePromocode({
                token: promo.tokenHash,
                user_id: selectedUser.idUser,
                user_admin_id: Number(localStorage.getItem("userId")),
            });
            setPromocodeSuccess(`Промокод успешно использован: ${result.name} (${result.description})`);
            const promos = await getPromocodesByUser(selectedUser.idUser, Number(localStorage.getItem("userId")));
            setUserPromos(promos);
        } catch (e) {
            console.error(e);
            setPromocodeError("Ошибка при использовании промокода. Проверьте токен и попробуйте снова.");
        } finally {
            setUsingPromocode(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage]);

    return (
        <Box sx={{ p: 3, mt: 8 }}>
            <Card>
                <CardContent>
                    <Box display="flex" alignItems="center" mb={2} gap={2}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Пользователи</Typography>
                        <Box flexGrow={1} />
                        <TextField
                            label="Поиск"
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ maxWidth: 300 }}
                        />
                    </Box>
                    <Divider />
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {headers.map((h) => (
                                                <TableCell key={h.key} align={(h.align as "left" | "right" | "center" | "justify") || "left"}>
                                                    {h.title}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.idUser}>
                                                <TableCell>{user.idUser}</TableCell>
                                                <TableCell>{user.user}</TableCell>
                                                <TableCell>{user.firstName}</TableCell>
                                                <TableCell>{user.lastName}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.RoleId}</TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        onClick={() => openPromosModal(user)}
                                                    >
                                                        Промокоды
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={promoModalOpen} onClose={() => setPromoModalOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Промокоды пользователя: {selectedUser?.user}</DialogTitle>
                <Divider />
                <DialogContent>
                    {loadingPromos ? (
                        <Box display="flex" justifyContent="center" py={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Название</TableCell>
                                            <TableCell>Описание</TableCell>
                                            <TableCell>Тип</TableCell>
                                            <TableCell>Статус</TableCell>
                                            <TableCell>Токен</TableCell>
                                            <TableCell>Создано</TableCell>
                                            <TableCell align="right">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userPromos.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} align="center">
                                                    Промокодов нет
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            userPromos.map((promo) => (
                                                <TableRow key={promo.id}>
                                                    <TableCell>{promo.id}</TableCell>
                                                    <TableCell>{promo.name}</TableCell>
                                                    <TableCell>{promo.description}</TableCell>
                                                    <TableCell>
                                                        {promo.promoCount === 1
                                                            ? "Рублей"
                                                            : promo.promoCount === 0
                                                                ? "Процентов"
                                                                : promo.promoCount}
                                                    </TableCell>
                                                    <TableCell>{promo.status}</TableCell>
                                                    <TableCell>{promo.tokenHash}</TableCell>
                                                    <TableCell>{new Date(promo.createdAt).toLocaleString()}</TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            size="small"
                                                            variant="text"
                                                            onClick={() => handleUsePromocode(promo)}
                                                            disabled={usingPromocode}
                                                        >
                                                            {usingPromocode ? "..." : "Применить"}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {promocodeError && (
                                <Typography color="error" mt={2}>
                                    {promocodeError}
                                </Typography>
                            )}
                            {promocodeSuccess && (
                                <Typography color="success.main" mt={2}>
                                    {promocodeSuccess}
                                </Typography>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPromoModalOpen(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}