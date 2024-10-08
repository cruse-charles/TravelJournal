// check if the file is a URL or a file object
const isUrl = (file) => typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('blob:'));
const isFile = (file) => file instanceof File;
// Receive array of previews, [{imageUrl, fileName}, File] and convert to blobs, return an array of files

export const getUpdatedFiles = async (previews) => {
    // create an array of promises to fetch the files from the URLs
    const filePromises = previews.map(async (preview) => {
        if (!isFile(preview)) {
            try {
                // fetch the image from the URL
                const {imageUrl} = preview
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${imageUrl}: ${response.statusText}`);
                }
                const blob = await response.blob();
                const fileName = imageUrl.split('/').pop();
                const newFile = new File([blob], fileName, { type: blob.type });
                return newFile;
            } catch (error) {
                console.error(`Error fetching file from URL: ${preview}`, error);
                throw error;
            }
        } else {
            return preview;
        }
    });

    // wait for all promises to resolve
    return await Promise.all(filePromises);
};

// filter out file or URL that matches given key
export const deleteSelectedFiles = (previews, key) => {
    const updatedFiles = previews.filter((item) => {
        const { fileName } = item;
        return fileName !== key;
    })

    return updatedFiles
}

// Receive file object or URL, return an array of objects: {imageUrl, fileName}
    // if file object, create an objectURL. If URL, use the URL as imageUrl
export const updatePreviews = (files) => {
    const updatedPreviews = files.map((file) => {
        if (isUrl(file)) {
            return {imageUrl: file, fileName: file}
        } else {
            const imageUrl = URL.createObjectURL(file)
            return {imageUrl, fileName: file.name}
        }
    })

    return updatedPreviews;
}