/**
 * Image Metadata Models
 */

export interface ImagesGetQueryParams {
    objects?: string    
}

export interface ImageMetadataEntity extends ImageMetadata {
    _id: string
}

export interface ImageMetadata {
    imgUrl: string
    label: string
    objects: Array<string>
}

export interface ImagePostRequestParams {
    imgUrl: string
    label?: string
    enableObjectDetection?: boolean
    dryRun?: boolean
}