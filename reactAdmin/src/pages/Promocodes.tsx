import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, CircularProgress, Box, TablePagination, } from "@mui/material";
import { getPromocodesByUser, type Promocode } from "../api/promocodes.ts";

export default function Promocodes() {
    const [promocodes, setPromocodes] = useState<Promocode[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchPromocodes = async () => {
        setLoading(true);
        try {
            const userId = Number(localStorage.getItem("userId"));
            const adminUserId = Number(localStorage.getItem("userId"));
            const allPromocodes = await getPromocodesByUser(userId, adminUserId);
            setTotal(allPromocodes.length);
            setPromocodes(allPromocodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
        } catch (e) {
            console.error("Ошибка при получении промокодов:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromocodes();
    }, [page, rowsPerPage]);

    return (
        <Box sx={{ p: 3, mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Промокоды
            </Typography>

            <Card>
                <CardContent>
                    <TextField
                        label="Поиск"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ mb: 2, maxWidth: 300 }}
                    />

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
                                            <TableCell>ID</TableCell>
                                            <TableCell>Пользователь</TableCell>
                                            <TableCell>Название</TableCell>
                                            <TableCell>Описание</TableCell>
                                            <TableCell>Кол-во</TableCell>
                                            <TableCell>Статус</TableCell>
                                            <TableCell>Токен</TableCell>
                                            <TableCell>Создано</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {promocodes
                                            .filter((p) => p.name.includes(search))
                                            .map((promo) => (
                                                <TableRow key={promo.id}>
                                                    <TableCell>{promo.id}</TableCell>
                                                    <TableCell>{promo.userId}</TableCell>
                                                    <TableCell>{promo.name}</TableCell>
                                                    <TableCell>{promo.description}</TableCell>
                                                    <TableCell>{promo.promoCount}</TableCell>
                                                    <TableCell>{promo.status ? "Активен" : "Неактивен"}</TableCell>
                                                    <TableCell>{promo.tokenHash}</TableCell>
                                                    <TableCell>{promo.createdAt.toLocaleString()}</TableCell>
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
        </Box>
    );
}