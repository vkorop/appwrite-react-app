import { bottombarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

function Bottombar() {
  const { pathname } = useLocation();

  return (
    <section className="bottom-bar">
        <ul className="w-full flex justify-around">
          {bottombarLinks.map((link, index) => {
              const isActive = pathname === link.route;

              return (
                  <li 
                      className={`inline-block rounded-[10px] ${
                          isActive && "bg-primary-500"
                        }`}
                      key={index}
                  >
                      <Link 
                          className="flex-col flex-center gap-1 p-2 transition" 
                          to={link.route}>
                          <img 
                              src={link.imgURL} 
                              alt={link.label} 
                              className={`group-hover:invert-white ${
                                  isActive && "invert-white"
                              }`}
                          />

                          <span className="tiny-medium text-light-2">
                              {link.label}
                          </span>
                      </Link>
                  </li>
              );
          })}
      </ul>
    </section>
  )
}

export default Bottombar