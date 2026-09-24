export interface StandardCompressRequest {
	image: File | Blob;
}

export interface ImagesClient {
	standardCompress(request: StandardCompressRequest): Promise<string>;
}
