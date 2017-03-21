import {GET_DEVICE_GROUPS_FAILED,GET_DEVICE_GROUPS_REQUEST,GET_DEVICE_GROUPS_SUCCEED} from '../actions/device_groups';

export default (state = {page: 1}, action) => {
    switch (action.type) {
        case GET_DEVICE_GROUPS_REQUEST:
            return {...state};
        case GET_DEVICE_GROUPS_SUCCEED:
            const _data = {
                data: action.data.data,
                loaded: true,
                page:action.page,
                meta:action.data.meta,
                q:action.q
            };
            return {...state, ..._data};
        case GET_DEVICE_GROUPS_FAILED:
            return {...state, loaded: false};
        default:
            return state
    }
}
