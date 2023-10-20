import React from 'react';
import {observer} from "mobx-react-lite";
import "../../Styles/AuthenticationStyle/Authentication.scss"
import MyInput from "../../UI/MyInput";
import MyButton from "../../UI/MyButton";
import {useNavigate} from "react-router-dom";
import ShowPasswordIcon from "../../Imgs/SVG/ShowPasswordIcon";
import {
    getAuth,
    signInWithEmailAndPassword,
    browserSessionPersistence,
    setPersistence, onAuthStateChanged,
} from "firebase/auth";
import authStore from "../../Store/AuthStore";

const Auth: React.FC = observer(() => {
    const navigate = useNavigate()
    const auth = getAuth()

    // Автовход в сессию
    onAuthStateChanged(auth, (user) => {
        if (user) {
            navigate("/lobby")
        }
    })


    const handleOnCreate = () => {
        if (authStore.userAuthEmail && authStore.userAuthPassword) {
            const auth = getAuth();

            setPersistence(auth, browserSessionPersistence)
                .then(() => {
                    return signInWithEmailAndPassword(auth, authStore.userAuthEmail, authStore.userAuthPassword)
                        .then(() => navigate("/lobby"))
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            alert(errorCode + " " + errorMessage)
                        })
                })
        }
    }

    return (
        <main className="auth">
            <div className="auth__container container">
                <div className="auth__main">
                    <h2>
                        Авторизуйтесь, чтобы начать играть
                    </h2>
                    <div className="auth__inputs">
                        <MyInput style="auth__email" placeholder="email" type="email"
                                 handleOnChange={e => authStore.changeUserAuthEmail(e.target.value)}
                                 value={authStore.userAuthEmail}/>
                        <div className="auth__passwordBlock">
                            <MyInput style="auth__password" placeholder="пароль"
                                     type={authStore.userAuthShowPassword ? "text" : "password"}
                                     handleOnChange={e => authStore.changeUserAuthPassword(e.target.value)}
                                     value={authStore.userAuthPassword}/>
                            <span onClick={() => authStore.changeUserAuthShowPassword()}>
                                <ShowPasswordIcon/>
                            </span>
                        </div>
                    </div>
                    <div className="auth__bottom">
                        <MyButton btnText="Создать аккаунт" btnStyle="auth__create"
                                  handleOnClick={() => navigate("/register")}/>
                        <MyButton btnText="Войти" btnStyle="auth__login"
                                  handleOnClick={() => handleOnCreate()}/>
                    </div>
                </div>
            </div>
        </main>
    );
})

export default Auth;
