export const APP_URL = "https://eman-traders-new-layout.vercel.app/";
export const API_URL = "https://api.upliffting.com/api/";
export const ASSETS_URL = "https://api.upliffting.com/"
export const itemsPerPage = 25;

export const dummyOptions = [
    {
        label: 'Home',
        type: 'link',
        href: '/',
    },
    {
        label: 'Profile',
        type: 'link',
        href: '/profile',
    },
    {
        label: 'Settings',
        type: 'link',
        href: '/settings',
    },
    {
        label: 'Log Out',
        type: 'button',
        action: () => {
            console.log('Logging out...');
        },
    },
];

export const ProductStatus = {
    0: {
        status: "In Stock",
        badgeColor: "bg-red-100",
        color: "text-red-600",
        dotColor: "bg-red-600"
    },
    1: {
        status: "Low in Stock",
        badgeColor: "bg-yellow-100",
        color: "text-yellow-600",
        dotColor: "bg-yellow-600"
    },
    2: {
        status: "Out of Stock",
        badgeColor: "bg-lime-100",
        color: "text-lime-600",
        dotColor: "bg-yellow-600"
    }
}

export const systemStatus = {
    0: {
        name: "Pending",
        color: "orange"
    },
    1: {
        name: "Approved",
        color: "green"
    },
    2: {
        name: "Rejected",
        color: "red"
    },
    3: {
        name: "Reversed",
        color: "blue"
    },
}

export const paymentStatus = {
    0: {
        name: "Pending",
        color: "orange"
    },
    1: {
        name: "Paid",
        color: "blue"
    },
    2: {
        name: "Rejected",
        color: "red"
    },
    3: {
        name: "Approved",
        color: "green"
    }
}

export const paySlipStatus = {
    0: { name: "Pending", color: "orange" },
    1: { name: "Approved", color: "green" },
    2: { name: "Rejected", color: "red" },
    3: { name: "Paid", color: "blue" }
};