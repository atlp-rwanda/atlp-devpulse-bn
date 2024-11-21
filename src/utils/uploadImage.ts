import cloudinary from "../config/cloudinary";

export const uploadImage = async (
    base64Image: string,
    folder: string = 'profile_picture',
    public_id?: string
) => {
    try{
        const options = {
            folder,
            public_id,
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
            transformation: [
                {width: 500, height: 500, crop: 'limit'},
                {quality: 'auto'}
            ]
        };

        const result = await cloudinary.uploader.upload(base64Image, options);
        return {
            url: result.secure_url,
            public_id: result.public_id
        }
    } catch(err){
        console.error('Cloudinary upload error:', err);
        throw new Error('Failed to upload image to Cloudinary');
    }
}