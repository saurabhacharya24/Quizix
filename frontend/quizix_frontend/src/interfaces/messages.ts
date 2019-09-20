export interface IInvites {
    group_name: string,
    group_desc: string,
    group_id: number,
    timestamp: Date
}

export interface IRequests {
    for_group: string,
    group_id: number,
    timestamp: Date,
    user_dname: string,
    user_email: string
}