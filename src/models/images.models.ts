export interface ImagesGetRequestParams {
    objects?: string    
}

export interface IImage {
    imgData: string
    label: string
    objects: Array<string>
}