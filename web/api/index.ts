import axios, { AxiosProgressEvent } from 'axios'

async function processResponse(response: Response) {
  if (response.ok) return await response.json()

  return {
    result: false,
    data: null,
    message: await response.text(),
  }
}

export async function resolveFileByCode(
  code: string,
): Promise<ApiResponseType<FileType>> {
  const response = await fetch(`/files/share/${code}`)
  return processResponse(response)
}

export async function uploadFile(
  fileInfo: {
    data: Blob
    isEphemeral?: boolean
    duration?: string | null
  },
  onUpload?: (progressEvent: AxiosProgressEvent) => void,
): Promise<ApiResponseType<FileUploadedType>> {
  const { data, isEphemeral = false, duration = '' } = fileInfo
  const formData = new FormData()
  formData.append('file', data)
  formData.append('isEphemeral', JSON.stringify(isEphemeral))
  formData.append('duration', JSON.stringify(duration))
  try {
    const { data } = await axios.put('/files', formData, {
      onUploadProgress: onUpload,
    })
    return data as ApiResponseType<FileUploadedType>
  } catch (e) {
    return {
      result: false,
      data: null,
      message: (e as Error)?.message ?? JSON.stringify(e),
    }
  }
}

export async function fetchPlainText(id: string): Promise<string> {
  const response = await fetch(`/files/${id}`)
  return response.text()
}
