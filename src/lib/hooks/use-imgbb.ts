import { useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useUser } from '@clerk/nextjs';


const useImageUpload = () => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [uploads, setUploads] = useState<any[]>([])

    const uploadImage = async (base64: string, isLogo: boolean) => {
        const apiKey = '007aff46bb49446f04020287cfbcb445';
        const apiUrl = 'https://api.imgbb.com/1/upload';
        const formData = new FormData();
        formData.append('key', apiKey);
        formData.append('image', base64);

        setIsLoading(true);

        try {
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const preview = response.data.data.display_url;

            const upload = {
                id: nanoid(),
                src: preview,
                preview: preview,
                type: "StaticImage",
            };

            setUploads((prevUploads) => [...prevUploads, upload]);

            if (isLogo) {
                if (user) {
                    await user.update({
                        unsafeMetadata: {
                            ...user.unsafeMetadata,
                            userLogo: preview
                        },
                    });
                }
            }

        } catch (e) {
            setIsLoading(false);
            alert("Upload Error, Please try again...")
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, uploads, uploadImage };
};

export default useImageUpload;
