function HeaderProfile() {
    const hasPhoto = true;

    return (
        <>
            <div className="flex items-center">
                <a href="/profile/id" className="hidden sm:block mr-5 hover:text-blue-300">Nikolai Rodionov</a>
                <a href="/profile/id">
                    {hasPhoto && <img src="https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg" alt="" className="w-[50px] h-[50px] rounded-full object-cover" />}
                    {!hasPhoto && <div className="w-[50px] h-[50px] rounded-full bg-orange-300 flex justify-center items-center">NR</div>}
                </a>
            </div>
        </>
    )
}

export default HeaderProfile;