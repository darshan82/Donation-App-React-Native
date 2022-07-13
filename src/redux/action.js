export const ADD_USER_TYPE = 'USER_TYPE';
export const REMOVE_USER='REMOVE_USER';
export const LOADER_ON='LOADER_ON';
export const LOADER_OFF='LOADER_OFF';



export const addUser=(userType)=> {
  return {
    type: ADD_USER_TYPE,
    payload:userType
  };
}

export const removeUser =()=> {
    return {
      type: REMOVE_USER,
    };
  }
  export const loaderOn =()=> {
    return {
      type: LOADER_ON,
    };
  }
  export const loaderOff =()=> {
    return {
      type: LOADER_OFF,
    };
  }
