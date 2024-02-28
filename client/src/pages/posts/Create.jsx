import axios from "axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import Header from "../../components/Header";

const PostCreate = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [validation, setValidation] = useState([]);

    const navigate = useNavigate();

    const storePost = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:3001/api/posts/store', {
            title: title,
            content: content
        })
            .then(() => {
                navigate('/posts');
            })
            .catch((error) => {
                setValidation(error.response.data);
            })
    };

    return (
        <>
            <div className="max-w-screen-lg  mx-auto">
                <div className="flex flex-row justify-between">
                    <Header title="Add Post" className="basis-1/6" />
                    <hr className="basis-4/6 w-full my-auto border-slate-500 rounded-lg"></hr>
                    <Link to="/posts" className="btn btn-success btn-sm basis-1/6">
                        <MdArrowBackIos size={14} /> Back to Posts
                    </Link>
                </div>
                <form onSubmit={storePost} className=" mt-4 p-4 rounded-lg">
                    {
                        validation.errors &&
                        <div role="alert" className="alert alert-error my-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Error! Failed to Add New Post.</span>
                            <ul>
                                {
                                    validation.errors.map((error, index) => (
                                        <li key={index}>{`${error.status} : ${error.message}`}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    }
                    <div className="space-y-12">
                        <div className="border-b border-white pb-12">
                            <h2 className="text-lg font-semibold leading-7 text-white">Post</h2>
                            <p className="mt-1 text-sm leading-6 text-white">
                                This information will be displayed publicly
                            </p>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-white">
                                        Title
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                autoComplete="title"
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Enter Your Post Title"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="content" className="block text-sm font-medium leading-6 text-white">
                                        Content
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            name="content"
                                            id="content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={3}
                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-500 bg-transparent shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-white">Write a few sentences about your post.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="submit" className="btn btn-error">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default PostCreate