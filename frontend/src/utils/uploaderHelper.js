// check if the file is a URL or a file object
const isUrl = (file) => typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('blob:'));

// if the file is a URL, fetch the file and create a new file object, return as an array of files
// export const getUpdatedFiles = async (previews) => {
//     const filePromises = previews.map(async (file) => {
//         if (isUrl(file)) {
//             const response = await fetch(file)
//             const blob = await response.blob()
//             const fileName = file.split('/').pop()
//             const newFile = new File([blob], fileName, { type: blob.type })
//             return newFile
//         } else {
//             return file
//         }
//     })

//     return await Promise.all(filePromises)
// }

export const getUpdatedFiles = async (previews) => {
    console.log('HERE ARE THE PREVIEWS', previews)
    const filePromises = previews.map(async (file) => {
        console.log('FILE in getupdatedfiles', file)
        // const { imageUrl } = file;
        if (isUrl(file)) {
            try {
                console.log(`Fetching file from URL: ${file}`);
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
                }
                const blob = await response.blob();
                const fileName = file.split('/').pop();
                const newFile = new File([blob], fileName, { type: blob.type });
                return newFile;
            } catch (error) {
                console.error(`Error fetching file from URL: ${file}`, error);
                throw error;
            }
        } else {
            console.log('RETURNING FILE ITSELF')
            return file;
        }
    });

    return await Promise.all(filePromises);
};

// filter out file or URL that matches given key
export const deleteSelectedFiles = (previews, key) => {
    const updatedFiles = previews.filter((item) => {
        if (isUrl(item)) {
            return `url-${item}` !== key
        } else {
            return `file-${item.name}` !== key
        }
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