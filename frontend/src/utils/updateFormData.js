export const updateFormData = (entry, updatedFiles) => {
    const formData = new FormData()

    updatedFiles.forEach((file, index) => {
        formData.append(`attachments`, file);
    })

    Object.keys(entry).forEach(key => {
        if (key !== 'attachments') {
            formData.append(key, entry[key]);
        }
    });

    return formData;
}