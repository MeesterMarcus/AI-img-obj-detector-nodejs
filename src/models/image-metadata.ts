export interface ImagesGetQueryParams {
    objects?: string    
}

export interface ImageMetadata {
    imgData: string
    label: string
    objects: Array<string>
}

export interface ImagePostRequestParams {
    imgData: string
    label?: string
    enableObjectDetection?: boolean
    dryRun?: boolean
}