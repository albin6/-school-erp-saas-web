 

 
export const getSubdomain = (): string | null => {
    const hostname = window.location.hostname;

    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return null;
    }

    
    const parts = hostname.split('.');

    
    if (parts.length >= 2 && parts[0] !== 'localhost') {
        return parts[0];
    }

    
    if (parts.length >= 3) {
        return parts[0];
    }

    return null;
};

 
export const isRootDomain = (): boolean => {
    return getSubdomain() === null;
};

 
export const isSuperAdminDomain = (): boolean => {
    return getSubdomain() === 'sadmin';
};

 
export const isTenantDomain = (): boolean => {
    const subdomain = getSubdomain();
    return subdomain !== null && subdomain !== 'sadmin';
};


export const getTenantSubdomain = (): string | null => {
    const subdomain = getSubdomain();
    if (subdomain && subdomain !== 'sadmin') {
        return subdomain;
    }
    return null;
};

 
export const buildSubdomainUrl = (subdomain: string | null, path: string = '/'): string => {
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';

    if (!subdomain) {
        return `${protocol}//localhost${port}${path}`;
    }

    return `${protocol}//${subdomain}.localhost${port}${path}`;
};

 
export const navigateToSubdomain = (subdomain: string | null, path: string = '/') => {
    window.location.href = buildSubdomainUrl(subdomain, path);
};
