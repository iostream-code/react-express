import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineAdd } from "react-icons/md";
import axios from "axios"
import Header from "../../components/Header"

const PostIndex = () => {
    const [posts, setPosts] = useState([]);
    const {
        isLogin,
        authUser,
    } = useAuth()

    const navigate = useNavigate()

    const fetchDataPosts = async () => {
        const response = await axios.get('http://localhost:3001/api/posts');
        const data = await response.data.data;
        setPosts(data);
    }

    useEffect(() => {
        fetchDataPosts()
        !isLogin && navigate("/login")
    });

    return (
        <>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-row justify-between gap-6">
                    <Header title="Posts" />
                    <hr className="w-full my-auto border-slate-500 rounded-lg"></hr>
                    <Link to="/post/create" className="btn btn-success btn-sm">
                        <MdOutlineAdd size={14} /> Add Post
                    </Link>
                </div>
                <div className="overflow-x-auto mt-4">
                    <table className="table">
                        <thead>
                            <tr className="text-lg">
                                <th>No</th>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                posts.length > 0 ?
                                    posts.map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.title}</td>
                                            <td>{data.content}</td>
                                            <td className="grid grid-col gap-2">
                                                <button className="btn btn-secondary btn-sm">Edit</button>
                                                <button className="btn btn-error btn-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={4} className="text-center">
                                            <div className="p-4 w-full bg-error rounded-lg text-black">
                                                Data belum ada
                                            </div>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {
                isLogin ?
                    <div className="mt-6 py-4 text-xl font-semibold">
                        Hello, {isLogin && authUser.Name} do You want to add some post?
                    </div>
                    :
                    null
            }
        </>
    )
}

export default PostIndex