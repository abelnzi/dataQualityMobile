export const addOrguit = (orgunits) => {
	return {
		type: 'ADD_OU',
		orgunits,
	};
};

export const getOrgunit = () => {
    return {
        type: 'GET_OU',
    }
}

export const addAllOrguit = (listOrgunits) => {
	return {
		type: 'ADD_All_OU',
		listOrgunits,
	};
};

export const addUser = (user) => {
	return {
		type: 'ADD_USER',
		user,
	};
};

export const getUser = () => {
    return {
        type: 'GET_USER',
    }
}

export const addAllUser = (listUser) => {
    return {
		type: 'ADD_ALL_USER',
		listUser,
    }
}

export const addOnline = (online) => {
	return {
		type: 'ADD_ONLINE',
		online,
	};
};

export const getOnline = () => {
    return {
        type: 'GET_ONLINE',
    }
}

export const addDataStore= (dataStore) => {
	return {
		type: 'ADD_DATASTORE',
		dataStore,
	};
};

export const getDataStore = () => {
    return {
        type: 'GET_DATASTORE',
    }
}

export const addChartsData= (chartsData) => {
	return {
		type: 'ADD_CHARTSDATA',
		chartsData,
	};
};

export const addAllChartsData= (listChartsData) => {
	return {
		type: 'ADD_All_CHARTSDATA',
		listChartsData,
	};
};

export const getChartsData = () => {
    return {
        type: 'GET_CHARTSDATA',
    }
}


