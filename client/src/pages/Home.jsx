import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"

const Home = () => {
    const {
        isLogin,
        setIsLogin,
        authUser,
        setAuthUser,
    } = useAuth()

    const navigate = useNavigate()

    const login = () => {
        navigate("/login")
    }

    const logout = (e) => {
        e.preventDefault()
        setIsLogin(false)
        setAuthUser(null)
        navigate("/")
    }

    return (
        <>
            <Header title="This is Home Page" />
            <div className="flex flex-col gap-4 py-4">
                {
                    isLogin ?
                        <div className="flex flex-col gap-4 w-20">
                            Hello, {authUser.Email}
                            <button type="button" onClick={(e) => { logout(e) }} className="btn btn-secondary">Logout</button>
                        </div>
                        :
                        <button type="button" onClick={() => { login() }} className="btn btn-accent">Login</button>
                }
                <Link to="/posts">
                    <button className="btn btn-primary">Go to Post Page</button>
                </Link>
            </div>
        </>
    )
}

export default Home