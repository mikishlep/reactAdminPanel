import { useState } from "react";
import { TextField, Button, Box, Card, CardContent, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/userSlice.ts";
import { login, type LoginFormData } from "../api/auth.ts";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
    const [formData, setFormData] = useState<LoginFormData>({ userName: "", passUser: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await login(formData);

            if (res.userData && res.tokenUser) {
                dispatch(
                    loginAction({
                        userName: res.userData.user,
                        firstName: res.userData.firstName ?? "",
                        lastName: res.userData.lastName ?? "",
                        accessToken: res.tokenUser.access_token,
                        userId: String(res.userData.idUser),
                    })
                );
                navigate("/dashboard");
            } else {
                console.error("Ошибка: неожиданный ответ от сервера", res);
            }
        } catch (e) {
            console.error("Ошибка запроса:", e);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Card sx={{ width: 400 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Вход в админку
                    </Typography>
                    <TextField
                        fullWidth
                        label="Логин"
                        variant="outlined"
                        margin="normal"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        variant="outlined"
                        margin="normal"
                        type="password"
                        value={formData.passUser}
                        onChange={(e) => setFormData({ ...formData, passUser: e.target.value })}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Войти
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}