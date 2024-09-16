// new
import { getUpdatedFiles } from "./uploaderHelper";
// new

// // Update form data with new files and entry data
// export const updateFormData = (entry, updatedFiles) => {
//     //create FormData object to submit object with files
//     const formData = new FormData()
//     console.log('SINDIE UPDATEFORMDATA', entry, updatedFiles)

//     //old
//     // append data and files to FormData object
//     updatedFiles.forEach((file, index) => {
//         formData.append(`attachments`, file);
//     })
//     //old

//     // turn previews, {imageurl} into an array of files
//     // const files = await getUpdatedFiles(updatedFiles);
//     // files.forEach((file, index) => {
//     //     formData.append(`attachments`, file);
//     // });
    

//     // //TODO: THIS HERE IS ACTUALLY DOING 3 ATTACHMENT KEYS WITH EACH FILE IN ONE, CHANGE TO MAKE IT AN ARRAY UNDER ONE KEY
//     Object.keys(entry).forEach(key => {
//         if (key !== 'attachments') {
//             formData.append(key, entry[key]);
//         }
//     });

//     return formData;
// }



// Update form data with new files and entry data
export const updateFormData = async (entry, updatedFiles) => {
    //create FormData object to submit object with files
    const formData = new FormData()
    console.log('SINDIE UPDATEFORMDATA', entry, updatedFiles)

    // turn previews, {imageurl} into an array of files
    const files = await getUpdatedFiles(updatedFiles);
    files.forEach((file, index) => {
        formData.append(`attachments`, file);
    });
    

    // //TODO: THIS HERE IS ACTUALLY DOING 3 ATTACHMENT KEYS WITH EACH FILE IN ONE, CHANGE TO MAKE IT AN ARRAY UNDER ONE KEY
    Object.keys(entry).forEach(key => {
        if (key !== 'attachments') {
            formData.append(key, entry[key]);
        }
    });

    return formData;
}