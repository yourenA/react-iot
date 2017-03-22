import {GET_POLICIES_REQUEST,GET_POLICIES_SUCCEED,GET_POLICIES_FAILED} from '../actions/policies';

export default (state = {page: 1}, action) => {
    switch (action.type) {
        case GET_POLICIES_REQUEST:
            return {...state};
        case GET_POLICIES_SUCCEED:
            const _data = {
                data: action.data.data,
                loaded: true,
                page:action.page,
                meta:action.data.meta,
                q:action.q
            };
            return {...state, ..._data};
        case GET_POLICIES_FAILED:
            return {...state, loaded: false};
        default:
            return state
    }
}
