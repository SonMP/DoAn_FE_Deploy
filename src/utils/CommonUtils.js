import Resizer from "react-image-file-resizer";

class CommonUtils {
    static isNumber1(number) {
        if (number === 1) return true;
        return false;
    }
    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    static getBase64Resized(file) {
        return new Promise((resolve) => {
            let compressFormat = "JPEG";
            if (file.type === "image/png") {
                compressFormat = "PNG";
            }
            Resizer.imageFileResizer(
                file,
                800,
                800,
                compressFormat,
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        });
    }
}

export default CommonUtils;