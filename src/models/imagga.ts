/**
 * Imagga Response Data Types
 */

export interface Tag {
    confidence: number
    tag: TagLabel
}

export interface TagLabel {
    en: string
}

export interface ImaggaResponse {
    result: ImaggaResult
    status: ImaggaStatus
}

export interface ImaggaResult {
    tags: Tag[]
}

export interface ImaggaStatus {
    text: string
    type: string
}

export interface UploadResponse {
    result: UploadResult
    status: ImaggaStatus
}

export interface UploadResult {
    upload_id: string
}
