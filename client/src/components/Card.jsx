import { Link } from "react-router-dom"

const Card = () => {
    return (
        <>
            <div className="flex flex-row justify-center p-10">
                <div className="card w-96 bg-neutral text-neutral-content">
                    <div className="card-body items-center text-center">
                        <h2 className="card-title">Hello World!</h2>
                        <p>Welcome to Rect Express Project.</p>
                        <div className="card-actions justify-end mt-2">
                            <Link to="/posts" className="btn btn-primary">Go to Posts</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card