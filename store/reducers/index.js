const initialState ={
    orgunits:[],
    online: false,
    user : null,
    dataStore:[],
    chartsData:[],
    listUser:[],
    listChartsData:[],
    listOrgunits:[]
}
export default (state = initialState, action) => {

    switch (action.type) {

        case 'GET_OU':
            return {
                ...state,
            }
        
        case 'ADD_OU':
            return {
                ...state,
                orgunits:  action.orgunits,
            }
        case 'ADD_All_OU':
            return {
                ...state,
                listOrgunits:  action.listOrgunits,
            }
        
        case 'GET_ONLINE':
            return {
                ...state,
            }
        
        case 'ADD_ONLINE':
            return {
                ...state,
                online: action.online,
            }

        case 'GET_USER':
            return {
                ...state,
            }
        case 'ADD_ALL_USER':
            return {
                ...state,
                listUser:  action.listUser,
            }
        case 'ADD_USER':
            return {
                ...state,
                user:  action.user,
            }

        case 'GET_DATASTORE':
            return {
                ...state,
            }
        
        case 'ADD_DATASTORE':
            return {
                ...state,
                dataStore: action.dataStore,
            }
        case 'GET_CHARTSDATA':
            return {
                ...state,
            }
        case 'ADD_CHARTSDATA':
            return {
                ...state,
                chartsData: action.chartsData,
            }
        case 'ADD_All_CHARTSDATA':
            return {
                ...state,
                listChartsData: action.listChartsData,
            }

        default:
            return state
    }

}