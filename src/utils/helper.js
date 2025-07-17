import { toast, Slide } from "react-toastify";

export function triggerToast(message, type, id = null) {
    toast.dismiss(id)
    const toastId = toast(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        type: type,
        transition: Slide,
    })

    return toastId
}

export const hasPermission = (userPermissions, requiredPermission) => {
    return userPermissions.includes(requiredPermission);
};

export function numberToWords(n) {
    if (n < 0) return false;

    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    const single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (n === 0) return 'Zero';

    // Recursive function to translate the number into words
    function translate(n) {
        let word = "";
        if (n < 10) {
            word = single_digit[n] + ' ';
        } else if (n < 20) {
            word = double_digit[n - 10] + ' ';
        } else if (n < 100) {
            let rem = translate(n % 10);
            word = below_hundred[Math.floor(n / 10) - 2] + ' ' + rem;
        } else if (n < 1000) {
            word = single_digit[Math.floor(n / 100)] + ' Hundred ' + translate(n % 100);
        } else if (n < 1000000) {
            word = translate(Math.floor(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        } else if (n < 1000000000) {
            word = translate(Math.floor(n / 1000000)).trim() + ' Million ' + translate(n % 1000000);
        } else if (n < 1000000000000) {
            word = translate(Math.floor(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        } else {
            word = translate(Math.floor(n / 1000000000000)).trim() + ' Trillion ' + translate(n % 1000000000000);
        }
        return word;
    }

    // Get the result by translating the given number
    let result = translate(n);
    return result.trim();
}

export function goToViewPage(navigate, user, link, permission = null) {
    switch (user?.userInfo?.role) {
        case "admin":
            navigate(link);
            break;
        case "user":
            if (hasPermission(user.permissions, permission)) {
                navigate(link);
            }
            break;
        default:
            break;
    }
}