import logo from '../../../assets/logo.png'
import HeaderProfile from './HeaderProfile';
import { useUserStore } from '../../../entities/user/model/useUserStore';

function Header() {
    const user = useUserStore((state) => state.user);
    const isSigned = user !== null && localStorage.getItem('accessToken');
    const isLoading = useUserStore((state) => state.isLoading);

    return (
        <>
            <header className="mt-5 text-white text-lg font-bold">
                <div className="flex justify-between items-center">
                    <a href="/"><img src={ logo } alt="" className="max-h-[50px] mr-5" /></a>
                    { isLoading && <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div> }
                    { isSigned && !isLoading && <HeaderProfile />  }
                    { !isSigned && !isLoading && <a href="/api/auth/google/login" className="hover:text-blue-300">Sign in</a> }
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