import { UserContext } from "./UserContext";
import { useContext } from "react";

function Header() {
  const { user } = useContext(UserContext);

  return (
    <div className="py-1">
      <header className="flex h-16 justify-between bg-slate-500 border rounded-lg p-2">
        <div className="font-bold">
          <p>Automatic Data Annotation App!</p>
        </div>

        <div>
          <p className="font-bold">{user ? `Hello ${user.name}` : 'Not Logged In'}</p>
        </div>
      </header>
    </div>
  );
}

export default Header;
