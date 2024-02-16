import { useNavigate } from 'react-router-dom'

const Home = () => {

    let navigate = useNavigate()

    
    const onCreate=() =>{
        navigate('/Create')
    }

    const onJoin=() =>{
        navigate('/Room')
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            Bienvenue! 
            <div className="group">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-400" onClick={onCreate}>
                    Create 
                </button>
            </div>
            <div className="group">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-10" onClick={onJoin}>
                    Join
                </button>
            </div>

        </div>
    );
};

export default Home;