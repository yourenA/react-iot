import {GET_ENDPOINTS_FAILED,GET_ENDPOINTS_REQUEST,GET_ENDPOINTS_SUCCEED} from '../actions/endpoints';

export default (state = {page: 1}, action) => {
    switch (action.type) {
        case GET_ENDPOINTS_REQUEST:
            return {...state};
        case GET_ENDPOINTS_SUCCEED:
            const _data = {
                data: action.data.data,
                loaded: true,
                page:action.page,
                meta:action.data.meta

            };
            return {...state, ..._data};
        case GET_ENDPOINTS_FAILED:
            return {...state, loaded: false};
        default:
            return state
    }
}
