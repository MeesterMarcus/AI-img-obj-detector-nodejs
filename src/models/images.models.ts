export interface ImagesGetQueryParams {
    objects?: string    
}

export interface IImage {
    imgData: string
    label: string
    objects: Array<string>
}

export interface ImagePostRequestParams {
    imgData: string
    label?: string
    enableObjectDetection?: boolean
}