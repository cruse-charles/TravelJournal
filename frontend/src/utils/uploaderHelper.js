const isUrl = (file) => typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'));

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
