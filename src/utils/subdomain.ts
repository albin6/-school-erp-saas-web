import { config } from '../config';

export const getSubdomain = (): string | null => {
    const hostname = window.location.hostname;
    const rootDomain = config.ROOT_DOMAIN.split(':')[0]; // Remove port if present

    // Check if we are on the root domain (including port if needed for local dev)
    if (hostname === rootDomain || hostname === '127.0.0.1') {
        return null;
    }

    const parts = hostname.split('.');
    const rootParts = rootDomain.split('.');

    // If the hostname ends with the root domain, extracting the subdomain is easier
    // Example: tenant.example.com vs example.com
    // Example: tenant.localhost vs localhost

    // If we're determining subdomain based on parts length relative to root domain
    // localhost (1 part) -> subdomain.localhost (2 parts)
    // example.com (2 parts) -> subdomain.example.com (3 parts)

    // SPECIAL CASE: Handle misconfigured production environment where VITE_ROOT_DOMAIN is missing (defaults to localhost)
    // If we are on a custom domain (e.g. zyramoments.in) but config says localhost, 
    // parts comparison (2 vs 1) will incorrectly think 'zyramoments' is a subdomain.
    if (rootDomain === 'localhost' && !hostname.includes('localhost')) {
        // We are likely in production with default config. 
        // Treat this as root domain to prevent redirect loops.
        // Unless it's explicitly a subdomain of the custom domain (e.g. tenant.zyramoments.in),
        // but we can't know that without the correct config.
        // Safer to return null (Root Domain) so the landing page loads.

        // Improve: If it has 3+ parts (tenant.zyramoments.in), maybe we can guess?
        // But for now, fixing the main domain loop is priority.
        const hostParts = hostname.split('.');
        if (hostParts.length === 2) {
            // e.g. zyramoments.in -> return null (Root)
            return null;
        }
        // If 3 parts (test.zyramoments.in), it might be a tenant, but let's be careful.
        // The safest fix for the loop is to return null if we can't determine.
    }

    if (parts.length > rootParts.length) {
        // Return the first part as subdomain
        // This assumes single-level subdomains for now

        // Ignore 'www' if it's the extra part (standard convention)
        if (parts[0] === 'www') {
            return null;
        }

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
    // We construct the URL based on the configured ROOT_DOMAIN
    // If config.ROOT_DOMAIN includes a port (e.g. localhost:5173), it will be preserved

    if (!subdomain) {
        return `${config.PROTOCOL}://${config.ROOT_DOMAIN}${path}`;
    }

    return `${config.PROTOCOL}://${subdomain}.${config.ROOT_DOMAIN}${path}`;
};


export const navigateToSubdomain = (subdomain: string | null, path: string = '/') => {
    window.location.href = buildSubdomainUrl(subdomain, path);
};
