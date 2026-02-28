import { useEffect } from 'react';
import Header from '../shared/ui/header/Header';
import { useUserStore } from '../entities/user/model/useUserStore';

function App() {
    const getUser = useUserStore((state) => state.getUser);

    useEffect(() => {
        getUser();
    }, [ getUser ]);

    return (
        <>
            <Header />
        </>
    )
}

export default App;