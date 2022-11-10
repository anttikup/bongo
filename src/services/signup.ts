import axios from "axios";

import { User } from '../types';

type Credentials = {
    username: string;
    password: string;
};

const signup = async (credentials: Credentials) : Promise<User> => {
    const { data: user } = await axios.post<User>('/api/user', credentials);
    console.log("TYPE:", typeof user);

    return user;
};


export default { signup };
