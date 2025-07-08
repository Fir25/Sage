import { combineReducers } from 'redux';
const ADD_USER = 'ADD_USER';


export function addUSER(user) {
  return {
    type: ADD_USER,
    user,
  }
}


const defaultInfo = [

];

function userinfo(state=defaultInfo, action) {
  switch (action.type) {
    case ADD_USER:
      return [
        ...state,
     
      action.user,
      
        
      ];

    default:
      return state;
  }
}

const UserInfoApp = combineReducers({
  userinfo
});

export default UserInfoApp;