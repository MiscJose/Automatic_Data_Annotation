import { Link } from "react-router-dom";

function Home(){
    return (
        <div>
            <h1>This is the homepage, where you should see a demonstration!</h1>
            <button><Link to={"/login"}>Login</Link></button>
            <button><Link to={"/register"}>Register</Link></button>
        </div>
    )
}

export default Home