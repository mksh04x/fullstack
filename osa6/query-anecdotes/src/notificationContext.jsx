import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "notification":
            return action.payload
        case "null":
            return null
        default:
            return state
    }
}

const notificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')

    return (
        <notificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </notificationContext.Provider>
    )
}


export default notificationContext