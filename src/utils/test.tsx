function ValidateURL(url: string) {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
}
<a href={ValidateURL(url) ? url : ''}> Link </a>

const isSafeURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        return ['http:', 'https:'].includes(parsedURL.protocol);
    } catch {
        return false;
    }
};

const handleLinkClick = (url: string) => {
    if (isSafeURL(url)) {
        window.location.href = url;
    } else {
        console.error('Unsafe URL');
    }
};

class RateLimiter {
    private maxRequests: number;
    private timeWindow: number;
    private requests: number[];
    constructor(maxRequests: number, timeWindow: number) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }

    public async request(apiCall: () => Promise<any>): Promise<any> {
        const now = Date.now();
        this.requests = this.requests.filter((timestamp) => now - timestamp < this.timeWindow);
        if (this.requests.length >= this.maxRequests) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        this.requests.push(now);
        return apiCall();
    }
}

const limiter = new RateLimiter(5, 60000); // 5 requests per minute

const fetchAPI = async () => {
    try {
        const data = await limiter.request(() =>
            fetch('https://api.example.com/data').then((res) => res.json())
        );
        console.log(data);
    } catch (err) {
        console.error(err.message);
    }
};

fetchAPI();
{
    "plugins": ["security"],
        "extends": ["plugin:security/recommended"]
}

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        const selectedFile = event.target.files[0];

        const allowedTypes = ["application/zip", "application/x-zip-compressed"];
        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Invalid file type. Only ZIP files are allowed.");
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            alert("File size exceeds the 5MB limit.");
            return;
        }
        return selectedFile
    }
};