export function reducer(state, action) {
  console.log("reducer");
  switch (action.type) {
    case "get":
      return action.payload;
    case "delete":
      return state.filter(item => item._id !== action.payload);
    case "create":
      return [action.payload, ...state];
    default:
      throw new Error();
  }
}

export const initialState = [];
