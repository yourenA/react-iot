import {GET_ENDPOINTS_FAILED,GET_ENDPOINTS_REQUEST,GET_ENDPOINTS_SUCCEED} from '../actions/endpoints';

export default (state = {page:1,q:'',start_at:'',end_at:'',order:'asc',status:'',ep_type:''}, action) => {
    switch (action.type) {
        case GET_ENDPOINTS_REQUEST:
            return {...state, loaded: false};
        case GET_ENDPOINTS_SUCCEED:
            const _data = {
                data: action.data.data,
                loaded: true,
                page:action.page,
                meta:action.data.meta,
                q:action.q,
                start_at:action.start_at,
                end_at:action.end_at,
                order:action.order,
                status:action.status,
                ep_type:action.ep_type
            };
            return {...state, ..._data};
        case GET_ENDPOINTS_FAILED:
            return {...state, loaded: false};
        default:
            return state
    }
}
