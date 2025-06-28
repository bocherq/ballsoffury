import logo from '../../../assets/logo.png'
import HeaderProfile from './HeaderProfile';

function Header() {
    const isSigned = true;

    return (
        <>
            <header className="mt-5 text-white text-lg font-bold">
                <div className="flex justify-between items-center">
                    <a href="/"><img src={ logo } alt="" className="max-h-[50px] mr-5" /></a>
                    { isSigned && <HeaderProfile />  }
                    { !isSigned && <a href="" className="hover:text-blue-300">Sign in</a> }
                </div>
                <div className="border-t border-gray-600 my-5">
                    <nav className="py-5">
                        <ul className="flex gap-10">
                            <li><a href="/" className="hover:text-blue-300">Tournaments</a></li>
                            <li><a href="/rating" className="hover:text-blue-300">Rating</a></li>
                            <li><a href="/rules" className="hover:text-blue-300">Rules</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Header;