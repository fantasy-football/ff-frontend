interface AuthConfig {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
    CLIENT_DOMAIN: 'wcfl.auth0.com',
    CLIENT_ID: 'QYxP0DrtRGpNTn2OrB9iyjzCHdMmp32t',
    REDIRECT: 'http://wcfl.excelmec.org/callback',
    AUDIENCE: 'https://wcfl.auth0.com/userinfo',
    SCOPE: 'openid profile email'
};