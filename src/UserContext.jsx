import { createContext, useState } from "react";

const UserContext = createContext({})

//need to wrap App component in a provider to make accessible from other components
//children prop: any nested components that are wrapped by the provider
export const UserContextProvider = ({children}) => {
    const[userInfo, setUserInfo] = useState({})
    
    return (
    <UserContext.Provider value={{userInfo, setUserInfo}}>
        {children}
    </UserContext.Provider>
    )
}

export default UserContext