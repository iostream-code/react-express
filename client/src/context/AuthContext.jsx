import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props) {
    const [authUser, setAuthUser] = useState(null)
    const [isLogin, setIsLogin] = useState(false)

    const value = {
        authUser,
        setAuthUser,
        isLogin,
        setIsLogin,
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}