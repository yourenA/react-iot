import {GET_DEVICE_CATEGORIES_FAILED,GET_DEVICE_CATEGORIES_REQUEST,GET_DEVICE_CATEGORIES_SUCCEED} from '../actions/device_categories';

export default (state = {page: 1}, action) => {
    switch (action.type) {
        case GET_DEVICE_CATEGORIES_REQUEST:
            return {...state};
        case GET_DEVICE_CATEGORIES_SUCCEED:
            const _data = {
                data: action.data.data,
                loaded: true,
                page:action.page,
                meta:action.data.meta,
                q:action.q
            };
            return {...state, ..._data};
        case GET_DEVICE_CATEGORIES_FAILED:
            return {...state, loaded: false};
        default:
            return state
    }
}
