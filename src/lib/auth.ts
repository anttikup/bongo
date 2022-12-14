import dbConnect from './dbconnect'
import User from '../models/user';
import bcrypt from 'bcrypt';

const getDate = () => {
    var date = new Date();
    return date.toISOString().substring(0, 10);
};

type Credentials = {
    username: string;
    password: string;
    signup?: boolean;
};

const handleLogin = async (credentials: Credentials) => {
    const { password, username } = credentials
    console.log("login", credentials);
    const existingUser = await User.findOne({ username });

    if ( existingUser ) {
        console.log("FOUND:", existingUser, password, username);
    }
    const credentialsCorrect = existingUser?.passwordHash
                          ? await bcrypt.compare(password, existingUser.passwordHash)
                          : false;

    if ( !credentialsCorrect ) {
        throw new Error('invalid username or password');
    }

    return existingUser;
};

const handleSignup = async (credentials: Credentials) => {
    const { password, username } = credentials
    console.log("signup", credentials);
    const existingUser = await User.findOne({ username });
    if ( existingUser ) {
        console.log("on", existingUser);
        throw new Error('username already in use');
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        userId: '9999',
        username,
        passwordHash,
        progress: {},
        xp: 0,
        xpHistory: {
            [getDate()]: 0,
        }
    })

    const savedUser = await user.save();
    savedUser.userId = savedUser._id.toString();
    return await savedUser.save();
};

export async function loginOrSignup({ password, username, signup }: Credentials) {
    console.log("XXX:", password, username, signup);
    return signup
         ? await handleSignup({ password, username })
         : await handleLogin({ password, username });
};
