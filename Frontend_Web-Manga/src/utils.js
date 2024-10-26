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
    };
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
        const img = new Image();
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                const widthRatio = maxWidth / width;
                const heightRatio = maxHeight / height;
                const ratio = Math.min(widthRatio, heightRatio);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL("image/jpeg", quality));
        };

        img.onerror = (error) => {
            reject(error);
        };
    });