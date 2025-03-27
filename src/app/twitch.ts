export interface TwitchAuth {
    clientId: string;
    token: string;
    userId: string;
}

declare global {
    interface Window {
        Twitch?: {
            ext: any;
        };
    }
}

export interface TwitchContext {
    theme: 'light' | 'dark';
}

const twitch = window.Twitch ? window.Twitch.ext : null;

export const onAuthorized = (callback: (auth: TwitchAuth) => void): void => {
    if (twitch) {
        twitch.onAuthorized(callback);
    }
};

export const onContext = (callback: (context: TwitchContext) => void): void => {
    if (twitch) {
        twitch.onContext(callback);
    }
};

export const onVisibilityChanged = (callback: (isVisible: boolean) => void): void => {
    if (twitch) {
        twitch.onVisibilityChanged(callback);
    }
};

export const getRole = (): 'viewer' | 'moderator' | 'broadcaster' => {
    return (twitch?.viewer?.role as 'viewer' | 'moderator' | 'broadcaster') || 'viewer';
};

export const isAdmin = (): boolean => {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }
    const role = getRole();
    return role === 'moderator' || role === 'broadcaster';
};

export const getBroadcasterId = (setBroadcasterId: React.Dispatch<React.SetStateAction<string>>) => {
    onAuthorized((auth: TwitchAuth) => {
        const role = getRole();
        if (role === 'broadcaster') {
            setBroadcasterId(auth.userId);
        }
    });
};

export const sendPubSubMessage = (message: object) => {
    if (twitch) {
        twitch.send('broadcast', 'application/json', JSON.stringify(message));
    }
};

export const onPubSubMessage = (callback: (message: any) => void) => {
    if (twitch) {
        twitch.listen('broadcast', (_target: string, _type: string, message: string) => {
            callback(JSON.parse(message));
        });
    }
};


export default twitch;