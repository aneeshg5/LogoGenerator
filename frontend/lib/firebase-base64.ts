import { storage } from "@/firebase/config"
import { ref, uploadString, getDownloadURL } from "firebase/storage"

export async function uploadBase64ToFirebase(
  base64Data: string,
  userId: string,
  filename?: string
): Promise<string> {
  const timestamp = Date.now()
  const sanitizedFilename = filename 
    ? filename.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
    : 'logo'
  const fullFilename = `${sanitizedFilename}_${timestamp}.png`
  
  const storageRef = ref(storage, `logos/${userId}/${fullFilename}`)
  
  await uploadString(storageRef, base64Data, 'data_url')
  
  const downloadURL = await getDownloadURL(storageRef)
  
  return downloadURL
}

export async function uploadMaskToFirebase(
  base64Data: string,
  userId: string
): Promise<string> {
  const timestamp = Date.now()
  const filename = `mask_${timestamp}.png`
  
  const storageRef = ref(storage, `masks/${userId}/${filename}`)
  
  await uploadString(storageRef, base64Data, 'data_url')
  
  const downloadURL = await getDownloadURL(storageRef)
  
  return downloadURL
}
