export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}

// export const getBase64 = (file) =>
//     new Promise((resolve, reject) => {
//         const reader = new FileReader()
//         reader.readAsDataURL(file)
//         reader.onload = () => resolve(reader.result)
//         reader.onerror = (error) => reject(error)
//     })

export function getItem(label, key, icon, children, type) {
    return {
        label,
        key,
        icon,
        children,
        type
    }
}

export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replace(/,/g, '.')
        return result
    } catch (error) {
        return null
    }
}

export const resizeImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.7) =>
    new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()

        reader.readAsDataURL(file)
        reader.onload = (e) => {
            img.src = e.target.result
        }

        img.onload = () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")

            let width = img.width
            let height = img.height

            if (width > maxWidth || height > maxHeight) {
                const widthRatio = maxWidth / width
                const heightRatio = maxHeight / height
                const ratio = Math.min(widthRatio, heightRatio)
                width = Math.floor(width * ratio)
                height = Math.floor(height * ratio)
            }

            canvas.width = width
            canvas.height = height

            ctx.drawImage(img, 0, 0, width, height)

            resolve(canvas.toDataURL("image/jpeg", quality))
        }

        img.onerror = (error) => {
            reject(error)
        }
    })

export const initFacebookSDK = () => {
    if (window.FB) {
        window.FB.XFBML.parse();
        return;
    }

    let locale = 'en_EN';

    window.fbAsyncInit = function () {
        if (window.FB) {
            window.FB.init({
                appId: process.env.REACT_APP_FB_ID,
                cookie: true,
                xfbml: true,
                version: 'v8.6',
            });
        } else {
            console.error("Facebook SDK failed to load.");
        }
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = `https://connect.facebook.net/${locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
};

export const sortByDate = (data) => {
    if (!Array.isArray(data)) return []
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}