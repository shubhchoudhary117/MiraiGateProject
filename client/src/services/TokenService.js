


export class TokenService {

    static setToken = (token) => {

        localStorage.setItem("miraigate-user", token);
        return true;
    }

    static getToken = () => {
        return localStorage.getItem("miraigate-user")
    }

    static removeToken = () => {
        localStorage.removeItem("miraigate-user")
    }
}

