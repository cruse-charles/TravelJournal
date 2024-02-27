// check if the file is a URL or a file object
const isUrl = (file) => typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'));

// if the file is a URL, fetch the file and create a new file object, return as an array of files
export const getUpdatedFiles = async (previews) => {
    const filePromises = previews.map(async (file) => {
        if (isUrl(file)) {
            const response = await fetch(file)
            const blob = await response.blob()
            const fileName = file.split('/').pop()
            const newFile = new File([blob], fileName, { type: blob.type })
            return newFile
        } else {
            return file
        }
    })

    return await Promise.all(filePromises)
}

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

// update previews with new files and return imageUrl
export const updatePreviews = (files) => {
    return files.map((file) => {
        const imageUrl = URL.createObjectURL(file)
        return {imageUrl, fileName: file.name}
    })
}