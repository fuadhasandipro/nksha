export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Remove the prefix
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
