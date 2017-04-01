import {GET_POLICIES_REQUEST,GET_POLICIES_SUCCEED,GET_POLICIES_FAILED,GET_ALL_ENDPOINTS_SUCCEED,GET_ALL_ENDPOINTS_FAILED} from '../actions/policies';

export default (state = {page: 1}, action) => {
    switch (action.type) {
        case GET_ALL_ENDPOINTS_SUCCEED:
            return {...state,...{endpointsData:action.endpointsData.data,page:1,q:'',start_at:'',end_at:'',order:'asc'}};
        case GET_POLICIES_REQUEST:
            return {...state};
        case GET_POLICIES_SUCCEED:
            const _data = {
                data: action.data.data,
                loaded: true,
                page:action.page,
                meta:action.data.meta,
                q:action.q,
                endpoint_uuid:action.endpoint_uuid,
                start_at:action.start_at,
                end_at:action.end_at,
                order:action.order
            };
            return {...state, ..._data};
        case GET_POLICIES_FAILED:
            return {...state, loaded: false};
        default:
            return state
    }
}
