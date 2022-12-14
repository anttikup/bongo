import axios from "axios";

import { User } from '../types';

//const baseUrl = '/api/login';



type Credentials = {
    username: string;
    password: string;
};

/* const login = async (credentials: Credentials) => {
 *     console.log(credentials);
 *     const { data: user } = await axios.get<User>(
 *         '/api/login',
 *         { params: credentials }
 *     );
 *     return user;
 * };
 *  */
const login = async (credentials: Credentials) : Promise<User> => {
    const response = await axios.post<User>('/api/login', credentials);

    return response.data;
};

export default { login };
