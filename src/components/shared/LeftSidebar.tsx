import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";

function LeftSidebar() {
    const { user } = useUserContext();
    const { pathname } = useLocation();
    const { mutate: signOut } = useSignOutAccount();
    const navigate = useNavigate();

    const logout = async () => {
        await signOut();

        navigate('/sign-in');
    };

    return (
    <nav className="leftsidebar h-full">
        <div className="flex flex-col gap-2">
            <Link
                className="p-4" 
                to="/"
            >
                <img 
                    src="/assets/images/logo.svg" 
                    alt="logo" 
                />
            </Link>

            <div className="flex gap-4 p-4">
                <img
                    className="rounded-full w-10 h-10"
                    src={user.imageURL || '/assets/images/profile.png'}
                    alt="profile"
                />

                <div className="flex flex-col">
                    <span>
                        {user.name}
                    </span>

                    <span className="text-sm">
                        @{user.username}
                    </span>
                </div>
            </div>

            <ul>
                {sidebarLinks.map((link, index) => {
                    const isActive = pathname === link.route;

                    return (
                        <li 
                            className={`leftsidebar-link group ${
                                isActive && "bg-primary-500"
                              }`}
                            key={index}
                        >
                            <NavLink 
                                className="flex p-4" 
                                to={link.route}>
                                <img 
                                    src={link.imgURL} 
                                    alt={link.label} 
                                    className={`group-hover:invert-white ${
                                        isActive && "invert-white"
                                    }`}
                                />

                                <span className="ml-3">
                                    {link.label}
                                </span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </div>

        <Button 
            variant="ghost"
            className="shad-button_ghost"
            onClick={logout}>
            <img
                src="/assets/icons/logout.svg"
                alt="logout"
            />

            <p>Logout</p>
        </Button>
    </nav>
    )
}

export default LeftSidebar