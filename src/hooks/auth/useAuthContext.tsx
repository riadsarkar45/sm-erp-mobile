
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import useAxiosPublic from '../baseURL/axiosPublicBase';


/* ---------- Types ---------- */

// Replace or extend these fields to match your actual
// /api/auth/me and /api/auth/login response.
export interface AuthUser {
    id: string | number;
    phoneNo?: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
}

interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}

interface RefreshResponse {
    accessToken: string;
}

export interface AuthContextValue {
    user: AuthUser | null;
    accessToken: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    setAccessToken: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    login: (
        phoneNo: string,
        password: string
    ) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<boolean>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext =
    createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);

    const hasAttemptedRefresh = useRef<boolean>(false);

    const axiosPublic = useAxiosPublic();

    const login = useCallback(
        async (
            phoneNo: string,
            password: string
        ): Promise<LoginResponse> => {
            const { data } = await axiosPublic.post<LoginResponse>(
                '/api/auth/login',
                {
                    phoneNo,
                    password,
                }
            );

            if (!data.accessToken || !data.user) {
                throw new Error('Invalid login response.');
            }

            setAccessToken(data.accessToken);
            setUser(data.user);
            console.log(data.user, "logged in user");
            return data;
        },
        []
    );

    const logout = useCallback(async (): Promise<void> => {
        try {
            await axiosPublic.post('/api/auth/logout');
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    }, []);

    const refreshSession = useCallback(
        async (): Promise<boolean> => {
            try {
                const { data } =
                    await axiosPublic.post<RefreshResponse>(
                        '/api/auth/refresh'
                    );

                if (!data.accessToken) {
                    throw new Error('No access token returned.');
                }

                console.log(data.accessToken, "access token");


                const meResponse = await axiosPublic.get<AuthUser>(
                    '/api/auth/me',
                    {
                        headers: {
                            Authorization: `Bearer ${data.accessToken}`,
                        },
                    }
                );

                setAccessToken(data.accessToken);
                setUser(meResponse.data);

                return true;
            } catch {
                setAccessToken(null);
                setUser(null);

                return false;
            }
        },
        []
    );

    useEffect(() => {
        if (hasAttemptedRefresh.current) {
            return;
        }

        hasAttemptedRefresh.current = true;

        let mounted = true;

        const initializeAuth = async (): Promise<void> => {
            try {
                await refreshSession();
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void initializeAuth();

        return () => {
            mounted = false;
        };
    }, [refreshSession]);

    const value: AuthContextValue = {
        user,
        accessToken,
        loading,
        isAuthenticated: accessToken !== null,
        setAccessToken,
        login,
        logout,
        refreshSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            'useAuth must be used within an AuthProvider'
        );
    }

    return context;
}
