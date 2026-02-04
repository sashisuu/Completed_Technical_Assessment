import axios, { AxiosProgressEvent } from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000' })

export async function uploadFile(file: File, onProgress?: (p: number) => void) {
  const form = new FormData();
  form.append('file', file);
  return new Promise((resolve, reject) => {
    api.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // Changed ProgressEvent to AxiosProgressEvent
      onUploadProgress: (e: AxiosProgressEvent) => {
        if (e.total && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      }
    }).then(r => resolve(r.data)).catch(reject)
  })
}

export async function fetchComments(page = 1, limit = 20, search = ''){
  const r = await api.get('/comments', { params: { page, limit, search } });
  return r.data;
}

export default api