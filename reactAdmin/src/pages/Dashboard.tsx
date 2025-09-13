import { useEffect, useState } from "react";
import { Card, Typography, Grid, Box } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getUsers } from "../api/users.ts";

export default function Dashboard() {
    const [stats, setStats] = useState({ totalUsers: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const userId = Number(localStorage.getItem("userId"));
            const usersData = await getUsers({ id_user: userId, offset: 0, limit: 10000 });
            setStats({ totalUsers: usersData.total });
        } catch (e) {
            console.error("Ошибка при загрузке статистики:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    return (
        <Box sx={{ p: 3, mt: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }} mb={2}>Статистика</Typography>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <Card sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
                        <GroupIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {loading ? "..." : stats.totalUsers}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.6 }}>Пользователей</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ mt: 4, p: 2 }}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <TrendingUpIcon sx={{ fontSize: 64, color: "grey.400" }} />
                    <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
                        Здесь будут графики и детальная аналитика
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}