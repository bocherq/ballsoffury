import { useUserStore } from "../../../entities/user/model/useUserStore";

function HeaderProfile() {
    const user = useUserStore((state) => state.user);
    if (!user) return (<></>)

    const hasPhoto = user.photo;
    return (
        <>
            <div className="flex items-center">
                <a href="/profile/id" className="hidden sm:block mr-2 hover:text-blue-300">{ `${user.firstName} ${user.lastName}` }</a>
                <span className="hidden sm:block mr-5 text-yellow-500">{ `★${user.rating}` }</span>
                <a href="/profile/id">
                    {hasPhoto && <img src={ user.photo } alt="" className="w-[50px] h-[50px] rounded-full object-cover" />}
                    {!hasPhoto && <div className="w-[50px] h-[50px] rounded-full bg-orange-300 flex justify-center items-center">
                        { `${user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase()}` }
                    </div>}
                </a>
            </div>
        </>
    )
}

export default HeaderProfile;